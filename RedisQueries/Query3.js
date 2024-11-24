import { createClient } from "redis";
import { getDistinctUsers } from "../db/myMongoDB.js";

const client = createClient();

client.on("error", (err) => {
  console.log("Error " + err);
});

await client.connect();

client.on("connect", () => {
  console.log("Connected to Redis");
});

async function main() {
  const users = await getDistinctUsers();
  const userSetKey = "distinctUsers";

  for (const user of users) {
    await client.sAdd(userSetKey, user);
  }
  console.log("Distinct users added to Redis");

  const distinctUserCount = await client.sCard(userSetKey);
  console.log(
    `Total distinct users retrieved from Redis: ${distinctUserCount}`
  );
}

main().finally(() => client.quit());
