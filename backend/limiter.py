import os, time
from typing import Tuple, Callable
from fastapi import Request, HTTPException
from redis.asyncio import Redis

# Shared Redis client (lazy singleton)
_redis: Redis | None = None
def get_redis() -> Redis:
    global _redis
    if _redis is None:
        _redis = Redis.from_url(
            os.getenv("REDIS_URL", "redis://localhost:6379/0"),
            decode_responses=True
        )
    return _redis

# Atomic token bucket
TOKEN_BUCKET_LUA = """
-- KEYS[1] key ; ARGV[1] cap ; ARGV[2] rate/sec ; ARGV[3] now_ms
local cap = tonumber(ARGV[1])
local rate = tonumber(ARGV[2])
local nowms = tonumber(ARGV[3])

local data = redis.call('HMGET', KEYS[1], 'tokens', 'ts')
local tokens = tonumber(data[1])
local ts = tonumber(data[2])
if not tokens or not ts then
  tokens = cap
  ts = nowms
end

local delta = (nowms - ts) / 1000.0
tokens = math.min(cap, tokens + delta * rate)

local allowed = 0
local retry_ms = 0
if tokens >= 1.0 then
  tokens = tokens - 1.0
  allowed = 1
else
  local need = 1.0 - tokens
  retry_ms = math.ceil((need / rate) * 1000.0)
end

redis.call('HMSET', KEYS[1], 'tokens', tokens, 'ts', nowms)
local idle_ms = math.ceil((cap / rate) * 1000.0)
redis.call('PEXPIRE', KEYS[1], idle_ms * 2)  -- free idle keys

return {allowed, retry_ms, math.floor(tokens)}
"""

class TokenBucket:
    def __init__(self, redis: Redis, capacity: int, refill_per_sec: float, prefix: str = "rl"):
        self.redis = redis
        self.capacity = int(capacity)
        self.refill = float(refill_per_sec)
        self.prefix = prefix

    def key(self, scope: str, identity: str) -> str:
        # {scope} = Redis Cluster hash-tag (safe even if not clustering)
        return f"{self.prefix}:tb:{{{scope}}}:{identity}"

    async def allow(self, scope: str, identity: str) -> Tuple[bool, float, int]:
        now_ms = int(time.time() * 1000)
        allowed, retry_ms, tokens = await self.redis.eval(
            TOKEN_BUCKET_LUA, 1,
            self.key(scope, identity),
            self.capacity, self.refill, now_ms
        )
        return bool(int(allowed)), int(retry_ms) / 1000.0, int(tokens)

# FastAPI helper ---
def rate_limit(scope: str, bucket: TokenBucket) -> Callable:
    async def _dep(req: Request):
        # Prefer user id if available (e.g., after auth), else IP
        uid = req.headers.get("x-user-id")
        identity = f"user:{uid}" if uid else f"ip:{req.client.host}"
        allowed, retry_after, remaining = await bucket.allow(scope, identity)
        if not allowed:
            raise HTTPException(
                status_code=429,
                detail=f"Rate limit exceeded. Retry in {retry_after:.2f}s.",
                headers={"Retry-After": str(max(1, int(round(retry_after))))}
            )
        req.state.rate_remaining = remaining  # optional
    return _dep