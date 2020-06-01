const express = require("express");
const { Kafka } = require("kafkajs");

const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://localhost:9200" });

const app = express();

const kafka = new Kafka({
  clientId: "bSocial",
  brokers: ["localhost:9092"],
});

listenToComments();
listenToUsers();
listenToPosts();

async function listenToComments() {
  try {
    const consumer = kafka.consumer({ groupId: "commentListener" });
    await consumer.connect();
    console.log("connected to kafka");

    await consumer.subscribe({
      topic: "Comments",
      fromBeginning: true,
    });
    console.log("subscribed to comments");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const jsonMessage = JSON.parse(message.value.toString());

        await client.index({
          index: "comments",
          body: jsonMessage,
        });

        console.log("comment from kafka: ", jsonMessage);
      },
    });
  } catch (err) {
    console.log(err);
  }
}

async function listenToUsers() {
  try {
    const consumer = kafka.consumer({ groupId: "userListener" });
    await consumer.connect();
    console.log("connected to kafka");

    await consumer.subscribe({
      topic: "Users",
      fromBeginning: true,
    });
    console.log("subscribed to users");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const jsonMessage = JSON.parse(message.value.toString());

        await client.index({
          index: "users",
          body: jsonMessage,
        });

        console.log("user from kafka: ", jsonMessage);
      },
    });
  } catch (err) {
    console.log(err);
  }
}

async function listenToPosts() {
  try {
    const consumer = kafka.consumer({ groupId: "postsListener" });
    await consumer.connect();
    console.log("connected to kafka");

    await consumer.subscribe({
      topic: "Posts",
      fromBeginning: true,
    });
    console.log("subscribed to posts");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const jsonMessage = JSON.parse(message.value.toString());

        await client.index({
          index: "posts",
          body: jsonMessage,
        });

        console.log("post from kafka: ", jsonMessage);
      },
    });
  } catch (err) {
    console.log(err);
  }
}

app.listen(3005);
