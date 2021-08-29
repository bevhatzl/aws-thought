const express = require('express');
const router = express.Router();
// Configure the service interface object
const AWS = require("aws-sdk");
const awsConfig = {
  region: "us-east-2"
};
AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();
const table = "Thoughts";

// GET method at the /api/users/ endpoint. We'll be retrieving all the users' thoughts from the Thoughts table.
router.get('/users', (req, res) => {
  const params = {
    TableName: table
  };
  // Pass the params object into the DynamoDB call
  // Scan return all items in the table
  dynamodb.scan(params, (err, data) => {
    if (err) {
      res.status(500).json(err); // an error occurred
    }else {
      res.json(data.Items)
    }
  });
})
// Get all thoughts for a specific user
router.get('/users/:username', (req, res) => {
  console.log(`Querying for thought(s) from ${req.params.username}.`);

  const params = {
    TableName: table,
    KeyConditionExpression: "#un = :user",
    ExpressionAttributeNames: {
      "#un": "username",
      "#ca": "createdAt",
      "#th": "thought"
    },
    ExpressionAttributeValues: {
      ":user": req.params.username
    },
    ProjectionExpression: "#th, #ca",
    ScanIndexForward: false
  };
  // Make the database call to the Thoughts table. Use the service interface object, dynamodb, and the query method to retrieve the user's thoughts from the database
  dynamodb.query(params, (err, data) => {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      res.status(500).json(err); // an error occurred
    } else {
      console.log("Query succeeded.");
      res.json(data.Items)
    }
  });

});

// Create new user at /api/users
router.post('/users', (req, res) => {
  const params = {
    TableName: table,
    Item: {
      "username": req.body.username,
      "createdAt": Date.now(),
      "thought": req.body.thought
    }
  };
  // database call
  dynamodb.put(params, (err, data) => {
    if (err) {
      console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
      res.status(500).json(err); // an error occurred
    } else {
      console.log("Added item:", JSON.stringify(data, null, 2));
      res.json({"Added": JSON.stringify(data, null, 2)});
    }
  });
});

module.exports = router;