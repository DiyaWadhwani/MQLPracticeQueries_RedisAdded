import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

export async function getTotalTweets() {
  try {
    await client.connect();
    const database = client.db("ieeevisTweets");
    const tweetsCollection = database.collection("tweet");

    const tweets = await tweetsCollection.find({}).toArray();
    console.log(`Total number of tweets retrieved from db: ${tweets.length}`);
    return tweets;
  } catch (error) {
    console.error("Error in getTotalTweets:", error);
    throw error;
  } finally {
    await client.close();
  }
}

export async function getTotalFavorites() {
  try {
    await client.connect();
    const database = client.db("ieeevisTweets");
    const tweetsCollection = database.collection("tweet");

    const tweets = await tweetsCollection
      .find({}, { projection: { favorite_count: 1 } })
      .toArray();

    console.log(
      `Retrieved ${tweets.length} tweets with favorite_count from db.`
    );
    return tweets;
  } catch (error) {
    console.error("Error in getTotalFavorites:", error);
    throw error;
  } finally {
    await client.close();
  }
}

export async function getDistinctUsers() {
  try {
    await client.connect();
    const database = client.db("ieeevisTweets");
    const tweetsCollection = database.collection("tweet");

    const distinctUsers = await tweetsCollection.distinct("user.screen_name");
    console.log(`Total distinct users from db: ${distinctUsers.length}`);
    return distinctUsers;
  } catch (error) {
    console.error("Error in getDistinctUsers:", error);
    throw error;
  } finally {
    await client.close();
  }
}

export async function getTopUsersByTweetCount(limit = 10) {
  try {
    await client.connect();
    const database = client.db("ieeevisTweets");
    const tweetsCollection = database.collection("tweet");

    const leaderboard = await tweetsCollection
      .aggregate([
        { $group: { _id: "$user.screen_name", tweetCount: { $sum: 1 } } },
        { $sort: { tweetCount: -1 } },
        { $limit: limit },
      ])
      .toArray();

    console.log("Top users by tweet count from db:", leaderboard);
    return leaderboard;
  } catch (error) {
    console.error("Error in getTopUsersByTweetCount:", error);
    throw error;
  } finally {
    await client.close();
  }
}

export async function getTweetsByUser() {
  try {
    await client.connect();
    const database = client.db("ieeevisTweets");
    const tweetsCollection = database.collection("tweet");

    const tweets = await tweetsCollection.find().toArray();
    const tweetsByUser = {};

    for (const tweet of tweets) {
      const screenName = tweet.user.screen_name;
      const tweetId = tweet._id;

      if (!tweetsByUser[screenName]) {
        tweetsByUser[screenName] = [];
      }

      tweetsByUser[screenName].push({
        id: tweetId,
        text: tweet.text,
        created_at: tweet.created_at,
        favorite_count: tweet.favorite_count,
        retweet_count: tweet.retweet_count,
      });
    }

    console.log("Tweets organized by user");
    return tweetsByUser;
  } catch (error) {
    console.error("Error in getTweetsByUser:", error);
    throw error;
  } finally {
    await client.close();
  }
}
