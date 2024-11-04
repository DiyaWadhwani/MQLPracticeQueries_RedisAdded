import { MongoClient } from "mongodb";
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function main() {
  try {
    const database = client.db("ieeevisTweets");
    const tweets = database.collection("tweet");
    const query = {};
    const result = await tweets
      .aggregate([
        {
          $group: {
            _id: "$user.screen_name", // Group by unique user screen name
            followers_count: { $max: "$user.followers_count" }, // Get the maximum followers count for each user
          },
        },
        {
          $sort: { followers_count: -1 }, // Sort by followers count in descending order
        },
        {
          $limit: 10, // Limit to top 10 users
        },
        {
          $project: {
            screen_name: "$_id",
            followers_count: 1,
            _id: 0, 
          },
        },
      ])
      .toArray();
    console.log("Top 10 users with the most followers:", result);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
