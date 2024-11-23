import { MongoClient } from "mongodb";
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function main() {
  try {
    const database = client.db("ieeevisTweets");
    const tweets = database.collection("tweet");
    const query = {
      retweeted_status: { $exists: false },
      in_reply_to_status_id: null,
    };
    const result = await tweets
      .find(query)
      .toArray();
    console.log(
      "Number of tweets that are not rewteets or replies:",
      result.length
    );
  } finally {
    await client.close();
  }
}

main().catch(console.error);
