const CyclicDB = require('cyclic-dynamodb');
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const db = CyclicDB("vast-plum-badger-suitCyclicDB");
const animalCollection = db.collection('game_events');

app.use(express.json());
app.use(express.static('public'));

app.post("/", async (req, res) => {
  const { user_id, game_name, event_name, event_value } = req.body;
  const data = {
    user_id,
    game_name,
    event_name,
    event_value,
    created_at: new Date().toISOString()
  };
  await animalCollection.set(user_id, data);
  res.sendStatus(200);
});

app.get("/gameData", async (req, res) => {
  try {
    const client = db.getClient();
    const params = {
      TableName: "game_events",
    };
    const items = await client.query(params).promise();
    const data = items.Items.map(({user_id, ...values}) => ({ user_id, ...values }));
    res.json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});