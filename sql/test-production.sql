/*
Below is a sample query on the production dataset.
This query is used in the "swiping page" feature.
The purpose of this query is to return the most similar users to the "looking_user_id" in order of similarity.
*/

SELECT offering_user_id, similarity
FROM "Similarity"
WHERE looking_user_id = '1df7d007-3918-43df-b050-8c99deec7b85'
ORDER BY similarity DESC
LIMIT 10;