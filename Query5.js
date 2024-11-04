import { MongoClient } from "mongodb";
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function createUsersCollection() {
  try {
    const database = client.db("ieeevisTweets");
    const tweets = database.collection("tweet");
    const users = database.collection("user");

    const uniqueUsers = await tweets
      .aggregate([
        {
          $group: {
            _id: "$user.id",
            name: { $first: "$user.name" },
            screen_name: { $first: "$user.screen_name" },
            followers_count: { $first: "$user.followers_count" },
            other_user_fields: { $first: "$user.other_fields" },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            screen_name: 1,
            followers_count: 1,
          },
        },
      ])
      .toArray();

    const response = await users.insertMany(uniqueUsers);
    console.log(
      "Users collection created with unique user documents. Number of documents inserted:",
      response.insertedCount
    );
  } finally {
    await client.close();
  }
}

createUsersCollection().catch(console.error);
