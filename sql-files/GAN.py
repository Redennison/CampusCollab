import os
import pandas as pd
from supabase import create_client
from sdv.single_table import CTGANSynthesizer
from sdv.metadata import SingleTableMetadata
import uuid
import numpy as np

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

res = supabase.table("User").select("*").execute()
df = pd.DataFrame(res.data)

list_cols = [
    'user_domain','desired_domain',
    'user_sector','skills','desired_skills'
]

for col in list_cols:
    df[col] = (
        df[col]
        .apply(lambda v: ",".join(v) if isinstance(v, list) else "")
        .astype("string")
    )

df['created_at'] = pd.to_datetime(df['created_at'], utc=True)
df['last_login'] = pd.to_datetime(df['last_login'], utc=True)


metadata = SingleTableMetadata()

metadata.detect_from_dataframe(df)          

metadata.set_primary_key('id')

for col in list_cols:
    metadata.update_column(column_name=col, sdtype='categorical')

metadata.update_column(
    column_name='created_at',
    sdtype='datetime',
    datetime_format='%Y-%m-%d %H:%M:%S%z'
)
metadata.update_column(
    column_name='last_login',
    sdtype='datetime',
    datetime_format='%Y-%m-%d %H:%M:%S%z'
)

synthesizer = CTGANSynthesizer(
    metadata,
    enforce_rounding=True,
    enforce_min_max_values=True,
    epochs=300,
    verbose=True,
    cuda=False
)
synthesizer.fit(df)

n_samples = 20
synthetic = synthesizer.sample(n_samples)


synthetic['id'] = [str(uuid.uuid4()) for i in range(len(synthetic))]

synthetic = synthetic.replace({np.inf: np.nan, -np.inf: np.nan})
synthetic = synthetic.where(pd.notnull(synthetic), None)

for col in list_cols:
    synthetic[col] = synthetic[col].apply(
        lambda v: v.split(",") if (isinstance(v, str) and v != "") else []
    )

for ts_col in ['created_at', 'last_login']:
    synthetic[ts_col] = synthetic[ts_col].apply(
        lambda x: x.isoformat() 
    )


records = synthetic.to_dict(orient="records")

batch_size = 50
for i in range(0, len(records), batch_size):
    chunk = records[i : i + batch_size]
    supabase.table("User").insert(chunk).execute()
    print(f"Inserted {len(chunk)} rows (chunk starting at {i})")


