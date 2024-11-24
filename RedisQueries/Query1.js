import { createClient } from "redis";
import { getTotalTweets } from "../db/myMongoDB.js";

const client = createClient();

client.on("error", (err) => {
  console.log("Error " + err);
});

await client.connect();

client.on("connect", () => {
  console.log("Connected to Redis");
});

async function main() {
  await client.set("tweetCount", "0");
  console.log("tweetCount set to 0");

  const tweets = await getTotalTweets();
  for (let tweet of tweets) {
    await client.incr("tweetCount");
  }

  const tweetCount = await client.get("tweetCount");
  console.log("tweetCount completed updates", tweetCount);
}

main().finally(() => client.quit());
