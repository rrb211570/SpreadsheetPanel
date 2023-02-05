const functions = require('firebase-functions')
const express = require('express')
const app = express()

app.get('*', (req, res) => {
  res.send("Hello from the API")
})

exports.api = functions.https.onRequest(app)