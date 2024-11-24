import { createClient } from "redis";
import { getTotalTweets } from "./myMongoDB.js";

const client = createClient();
client.on("error", (err) => {
  console.log("Error " + err);
});
await client.connect();
client.on("connect", () => {
  console.log("Connected to Redis");
});

const tweets = await getTotalTweets();
await client.set("tweetCount", "0");
for (let tweets of tweets) {
  await client.incr("tweetCount");
}

const tweetCount = await client.get("tweetCount");

console.log("tweetCount", tweetCount);
