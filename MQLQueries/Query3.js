import { MongoClient } from "mongodb";
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function main() {
  try {
    const database = client.db("ieeevisTweets");
    const tweets = database.collection("tweet");
    const query = {
      user: { $exists: true },
      user_followers_count: { $exists: true },
    };
    const result = await tweets
      .aggregate([
        {
          $group: {
            _id: "$user.id",
            screen_name: { $first: "$user.screen_name" },
            username: { $first: "$user.name" },
            tweet_count: { $sum: 1 },
          },
        },
        { $sort: { tweet_count: -1 } },
        { $limit: 1 },
      ])
      .toArray();
    console.log("User with most tweets:", result);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
