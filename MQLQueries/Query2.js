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
          $sort: { followers_count: -1 },
        },
        {
          $limit: 10,
        },
      ])
      .toArray();
    console.log("Top 10 users with the most followers:", result);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
