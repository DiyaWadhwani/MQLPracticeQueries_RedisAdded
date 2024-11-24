import { createClient } from "redis";
import { getTotalFavorites } from "../db/myMongoDB.js";

const client = createClient();

client.on("error", (err) => {
  console.log("Error " + err);
});

await client.connect();

client.on("connect", () => {
  console.log("Connected to Redis");
});

async function main() {
  await client.set("favoritesSum", "0");
  console.log("favoritesSum set to 0");

  const tweets = await getTotalFavorites();
  for (let tweet of tweets) {
    await client.incrBy("favoritesSum", tweet.favorite_count || 0);
  }
  console.log("favoritesSum completed updates");

  const totalFavorites = await client.get("favoritesSum");

  console.log(
    `Total number of favorites retrieved from redis: ${totalFavorites}`
  );
}

main().finally(() => client.quit());
