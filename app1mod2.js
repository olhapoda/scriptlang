const express = require('express');
const app = express();

app.get('/greeting', (req, res) => {
    res.send('Hello World!');
});

module.exports = app;
