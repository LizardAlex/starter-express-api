const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const CyclicDB = require('cyclic-dynamodb');
const db = CyclicDB('vast-plum-badger-suitCyclicDB');

app.use(express.json());
app.use(express.static('public'));

app.post("/", async (req, res) => {
  const { user_id, game_name, event_name, event_value } = req.body;
  try {
    const animalCollection = db.collection("game_events");
    await animalCollection.set(user_id, {
      game_name: game_name,
      event_name: event_name,
      event_value: event_value,
      created_at: new Date().toISOString(),
    });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get("/gameData", async (req, res) => {
  const animalCollection = db.collection('game_events');
  try {
    const items = await animalCollection.find({});
    res.json(items);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});