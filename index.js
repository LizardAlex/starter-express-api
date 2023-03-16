const AWS = require('aws-sdk');
const express = require('express');
const bodyParser = require('body-parser');

AWS.config.update({
  region: 'us-east-1'
});

const docClient = new AWS.DynamoDB.DocumentClient();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;

// Обработка запроса от игровой рекламы
app.post('/trackingData', (req, res) => {
  const {
    user_id,
    game_name,
    event_name,
    event_value,
  } = req.body.Item;

  const params = {
    TableName: 'trackingData',
    Item: {
      user_id,
      game_name,
      event_name,
      event_value,
      created_at: new Date().toISOString(),
    },
  };

  docClient.put(params, (err, data) => {
    if (err) {
      console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
      res.status(500).send();
    } else {
      console.log('Added item:', JSON.stringify(data, null, 2));
      res.status(200).send();
    }
  });
});

// Обработка запроса от фронтенда
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Обработка запроса данных для фронтенда
app.get('/gameData', (req, res) => {
  const params = {
    TableName: 'trackingData',
  };

  docClient.scan(params, (err, data) => {
    if (err) {
      console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
      res.status(500).send();
    } else {
      console.log('Scan succeeded:', JSON.stringify(data, null, 2));
      res.json(data.Items);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});