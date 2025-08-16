select u.id, u.first_name, u.last_name, u.bio, u.image_url,
        u.user_domain, u.user_sector, u.skills,
        u.linkedin_url, u.github_url, u.twitter_url
from "Matches" m
join "User" u
    on u.id = case 
                when m.user1_id = target_user_id then m.user2_id
                else m.user1_id
            end
where (m.user1_id = target_user_id or m.user2_id = target_user_id)
    and u.has_onboarded = true;
