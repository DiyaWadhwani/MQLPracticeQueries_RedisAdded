# MQLPracticeQueries_RedisAdded

This project extends Node.js-based MongoDB queries to integrate with Redis. It queries a MongoDB database containing tweets from the 2020 IEEE VIS Conference and performs various operations like counting, grouping, and storing tweet data in Redis.

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (v14 or later)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or in a Docker container)
- [Redis](https://redis.io/) (running locally or in a Docker container)
- MongoDB Node.js Driver (`mongodb` package)
- Redis Node.js Client (`redis` package)

## Project Structure

- `Query1.js`: Counts the total number of tweets and stores the count in Redis.
- `Query2.js`: Computes the total number of favorites from all tweets and stores the sum in Redis.
- `Query3.js`: Finds the number of distinct users based on their screen name and uses Redis to manage a set of unique screen names.
- `Query4.js`: Creates a leaderboard of the top 10 users with the most tweets, stored as a Redis sorted set.
- `Query5.js`: Stores all tweets for each user in Redis as a list (`tweets:<screen_name>`) and creates a hash (`tweet:<tweet_id>`) for tweet details.

## Setup and Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/DiyaWadhwani/MQLPracticeQueries.git
   git checkout a6-redis_mongo
   ```

2. Install the necessary Node.js dependencies:

   ```sh
   npm install mongodb redis
   ```

### Database Setup

On cloning the project, the `ieeevis2020Tweets.dump` file gets added to your project.
Import it to MongoDB using the following command in your terminal:

```sh
mongoimport -h localhost:27017 -d ieeevisTweets -c tweet --file ieeevis2020Tweets.dump
```

Make sure MongoDB is running locally or adjust the `mongoimport` command with your connection details.

### Redis Setup

Start your Redis server locally or in Docker. Verify that it is accessible at `localhost:6379` (the default port).

## Running the Queries

Each query is a separate script that you can run with Node.js.

### Query 1: Count Total Number of Tweets

To run `Query1.js`, execute:

```sh
node RedisQueries/Query1.js
```

This will count the total number of tweets in MongoDB, store the count in Redis (`tweetCount` key), and output the result.

### Query 2: Compute Total Favorites

To run `Query2.js`, execute:

```sh
node RedisQueries/Query2.js
```

This will calculate the sum of the `favorite_count` field from all tweets, store it in Redis (`favoritesSum` key), and display the result.

### Query 3: Count Distinct Users

To run `Query3.js`, execute:

```sh
node RedisQueries/Query3.js
```

This will count distinct users by their screen name, store unique screen names in a Redis set (`screen_names`), and output the total count.

### Query 4: Create Leaderboard of Top 10 Users

To run `Query4.js`, execute:

```sh
node RedisQueries/Query4.js
```

This will create a Redis sorted set (`leaderboard`) with the top 10 users who tweeted the most and display the results in descending order.

### Query 5: Store Tweets Grouped by User

To run `Query5.js`, execute:

```sh
node RedisQueries/Query5.js
```

This script stores:
- A list of tweet IDs for each user (`tweets:<screen_name>`).
- Detailed tweet data in a hash (`tweet:<tweet_id>`), including fields like text, creation time, favorite count, and retweet count.

For example:
- To see all tweet IDs for a user `bexxmodd`:
  ```sh
  LRANGE tweets:bexxmodd 0 -1
  ```
- To view details of a specific tweet:
  ```sh
  HGETALL tweet:<tweet_id>
  ```

## Notes

- Ensure MongoDB and Redis servers are running before executing any queries.
- If there are connection issues, verify the MongoDB URI (`mongodb://localhost:27017`) and Redis connection details (`localhost:6379`).
- The queries process the dataset in-memory. Adjust memory usage for large datasets if needed.

## License

This project is licensed under the MIT License.