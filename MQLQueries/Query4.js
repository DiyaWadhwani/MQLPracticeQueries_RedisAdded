import { MongoClient } from "mongodb";
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function main() {
  try {
    const database = client.db("ieeevisTweets");
    const tweets = database.collection("tweet");

    const result = await tweets
      .aggregate([
        {
          $group: {
            _id: "$user.id",
            username: { $first: "$user.name" },
            screen_name: { $first: "$user.screen_name" },
            total_retweets: { $sum: "$retweet_count" }, // Sum total retweets per user
            tweet_count: { $sum: 1 }, // Count total tweets per user
          },
        },
        {
          $match: {
            tweet_count: { $gt: 3 }, // Filter users with more than 3 tweets
          },
        },
        {
          $project: {
            username: 1,
            screen_name: 1,
            total_retweets: 1,
            tweet_count: 1,
            average_retweets: { $divide: ["$total_retweets", "$tweet_count"] }, // Calculate average retweets
          },
        },
        {
          $sort: { average_retweets: -1 },
        },
        {
          $limit: 10,
        },
      ])
      .toArray();

    console.log("Top 10 users with the highest average retweets:", result);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
