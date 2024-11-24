import { createClient } from "redis";
import { getTopUsersByTweetCount } from "../db/myMongoDB.js";

const client = createClient();

client.on("error", (err) => {
  console.log("Error " + err);
});

await client.connect();

client.on("connect", () => {
  console.log("Connected to Redis");
});

async function main() {
  const leaderboard = await getTopUsersByTweetCount();
  const leaderboardKey = "leaderboard";

  for (const user of leaderboard) {
    await client.zAdd(leaderboardKey, {
      score: user.tweetCount,
      value: user._id,
    });
  }

  const topUsers = await client.zRangeWithScores(leaderboardKey, 0, -1, {
    REV: true,
  });
  console.log("Leaderboard (Top 10 users by tweet count):", topUsers);
}

main().finally(() => client.quit());
