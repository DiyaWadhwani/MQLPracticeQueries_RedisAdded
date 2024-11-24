import { createClient } from "redis";
import { getTweetsByUser } from "../db/myMongoDB.js";

const client = createClient();

client.on("error", (err) => {
  console.error("Redis Client Error", err);
});

await client.connect();

async function main() {
  const tweetsByUser = await getTweetsByUser();

  for (const [screenName, tweets] of Object.entries(tweetsByUser)) {
    const userTweetsKey = `tweets:${screenName}`;
    await client.del(userTweetsKey);

    // Push tweet IDs to Redis list for the user
    for (const tweet of tweets) {
      await client.rPush(userTweetsKey, tweet.id.toString());
    }

    // Add tweet details as hashes
    for (const tweet of tweets) {
      const tweetKey = `tweet:${tweet.id}`;
      await client.hSet(tweetKey, {
        user_name: screenName,
        text: tweet.text,
        created_at: tweet.created_at,
        favorite_count: tweet.favorite_count,
        retweet_count: tweet.retweet_count,
      });
    }
  }

  console.log(
    "All users have been processed and their tweets are stored in Redis."
  );
}

main().finally(() => client.quit());
