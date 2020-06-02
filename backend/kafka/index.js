const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Kafka } = require("kafkajs");

const app = express();

app.use(cors());

const server = app.listen(3001);

// const server = require("http").createServer(app);

const io = require("socket.io").listen(server);

const jsonParser = bodyParser.json();

const kafka = new Kafka({
  clientId: "bSocial",
  brokers: ["localhost:9092"],
});

io.sockets.on("connection", function (socket) {
  socket.on("room", function (room) {
    console.log("room: ", room);
    socket.join(room);
  });
});

listen();

async function listen() {
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

        const postId = jsonMessage.postId;
        const sender = jsonMessage.sender;
        const content = jsonMessage.content;
        const userId = jsonMessage.userId;

        io.sockets
          .in(userId)
          .emit(
            "notification",
            `User ${sender} commented on your post number ${postId} by saying ${content}`
          );

        console.log("comment from kafka: ", jsonMessage);
      },
    });
  } catch (err) {
    console.log(err);
  }
}

app.post("/sendComment", jsonParser, async (req, res) => {
  const sender = req.body.sender;
  const email = req.body.email;
  const senderId = req.body.senderId.toString();
  const timestamp = req.body.timestamp.toString();
  const postId = req.body.postId.toString();
  const commentId = req.body.commentId.toString();
  const content = req.body.content;
  const userId = req.body.userId;
  console.log("userId: ", userId);

  try {
    const producer = kafka.producer();
    await producer.connect();
    console.log("connected to kafka from comments");

    const messageToSend = JSON.stringify({
      sender,
      email,
      senderId,
      timestamp,
      postId,
      commentId,
      content,
      userId,
    });

    const result = await producer.send({
      topic: "Comments",
      messages: [
        {
          value: messageToSend,
        },
      ],
    });

    console.log(result);
    await producer.disconnect();
  } catch (err) {
    console.log(err);
  }

  res.send("comment sent").status(200);
});

app.post("/sendUser", jsonParser, async (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const username = req.body.username;
  const email = req.body.email;
  const date = req.body.date;

  try {
    const producer = kafka.producer();
    await producer.connect();
    console.log("connected to kafka from users");

    const messageToSend = JSON.stringify({
      firstname,
      lastname,
      username,
      email,
      date,
    });

    const result = await producer.send({
      topic: "Users",
      messages: [
        {
          value: messageToSend,
        },
      ],
    });

    console.log(result);
    await producer.disconnect();
  } catch (err) {
    console.log(err);
  }

  res.send("user sent").status(200);
});

app.post("/sendPost", jsonParser, async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const userId = req.body.userId.toString();
  const timestamp = req.body.timestamp.toString();
  const postId = req.body.postId.toString();
  const content = req.body.content;

  try {
    const producer = kafka.producer();
    await producer.connect();
    console.log("connected to kafka from posts");

    const messageToSend = JSON.stringify({
      username,
      email,
      userId,
      timestamp,
      postId,
      content,
    });

    const result = await producer.send({
      topic: "Posts",
      messages: [
        {
          value: messageToSend,
        },
      ],
    });

    console.log(result);
    await producer.disconnect();
  } catch (err) {
    console.log(err);
  }

  res.send("post sent").status(200);
});

// app.listen(3001);
