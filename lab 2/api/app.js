const express = require('express');
const app = express();
const port = process.env.SERVER1_PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World from Api to Proxy!');
});

app.listen(port, () => {
    console.log(`Слухає порт: http://127.0.0.1:${port}/`);
});

