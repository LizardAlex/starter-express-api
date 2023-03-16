const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const client = new DynamoDBClient({ region: "us-east-1" });

app.use(express.json());

app.get("/", (req, res) => {
  // Отображение HTML страницы с помощью EJS
  res.render("index.ejs");
});

app.post("/trackEvent", (req, res) => {
  const { user_id, game_name, event_name, event_value } = req.body;
  const params = {
    TableName: "game_events",
    Item: {
      user_id: { S: user_id },
      game_name: { S: game_name },
      event_name: { S: event_name },
      event_value: { S: event_value },
      created_at: { S: new Date().toISOString() },
    },
  };
  const command = new PutItemCommand(params);
  client
    .send(command)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.get("/gameData", (req, res) => {
  const params = {
    TableName: "game_events",
    ProjectionExpression: "user_id, game_name, event_name, event_value, created_at",
  };
  client
    .scan(params)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});