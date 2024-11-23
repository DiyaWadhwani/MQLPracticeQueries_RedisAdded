import { MongoClient } from "mongodb";
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function createUsersCollection() {
  const database = client.db("ieeevisTweets");
  const tweets = database.collection("tweet");
  const users = database.collection("users");

  const uniqueUsers = await tweets
    .aggregate([
      {
        $group: {
          _id: "$user.id",
          name: { $first: "$user.name" },
          screen_name: { $first: "$user.screen_name" },
          followers_count: { $first: "$user.followers_count" },
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
    "User collection created. Number of documents inserted:",
    response.insertedCount
  );
}

async function createTweetsOnlyCollection() {
  const database = client.db("ieeevisTweets");
  const tweets = database.collection("tweet");
  const tweetsOnly = database.collection("tweets_only");

  const tweetsWithoutUser = await tweets
    .aggregate([
      {
        $project: {
          _id: 1,
          created_at: 1,
          text: 1,
          retweet_count: 1,
          favorite_count: 1,
          user_id: "$user.id",
        },
      },
    ])
    .toArray();

  const response = await tweetsOnly.insertMany(tweetsWithoutUser);
  console.log(
    "tweets_only collection created. Number of documents inserted:",
    response.insertedCount
  );
}

async function main() {
  try {
    await client.connect();
    await createUsersCollection();
    await createTweetsOnlyCollection();
  } finally {
    await client.close();
  }
}

main().catch(console.error);
