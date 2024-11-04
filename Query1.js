const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function main() {
  await client.connect();
  const database = client.db("ieeevisTweets");
  const collection = database.collection("tweet");
  const query = { retweeted_status: { $exists: false } };
  const result = await collection.find(query).toArray();
  console.log(
    "Number of tweets that are not rewteets or replies:",
    result.length
  );
  await client.close();
}

main().catch(console.error);
