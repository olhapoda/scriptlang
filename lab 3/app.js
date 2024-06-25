const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const url = 'mongodb://localhost:27017';
const dbName = 'Users';

// Підключення до сервера
let db;
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('Підключено до MongoDB');
        db = client.db(dbName);
    })
    .catch(err => {
        console.error('Неможливо підключитись до MongoDB:', err);
    });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Додати нового користувача
app.post('/items', async (req, res) => {
    const { name, age } = req.body;
    if (!name || age === undefined) {
        return res.status(400).send('Необхідно ввести дані обох полів');
    }

    try {
        const result = await db.collection('items').insertOne({ name, age });
        res.status(201).send(result.ops[0]);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Отримати усі елементи
app.get('/items', async (req, res) => {
    try {
        const query = req.query.name ? { name: { $regex: req.query.name, $options: 'i' } } : {};
        const items = await db.collection('items').find(query).toArray();
        res.status(200).send(items);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Отримати користувача по ID
app.get('/items/:id', async (req, res) => {
    try {
        const item = await db.collection('items').findOne({ _id: new ObjectId(req.params.id) });
        if (!item) return res.status(404).send('Користувача не знайдено');
        res.status(200).send(item);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Оновити користувача за ID
app.put('/items/:id', async (req, res) => {
    try {
        const result = await db.collection('items').findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body },
            { returnOriginal: false }
        );
        if (!result.value) return res.status(404).send('Користувача не знайдено');
        res.status(200).send(result.value);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Видалити користувача по ID
app.delete('/items/:id', async (req, res) => {
    try {
        const result = await db.collection('items').findOneAndDelete({ _id: new ObjectId(req.params.id) });
        if (!result.value) return res.status(404).send('Користувача не знайдено');
        res.status(200).send('Користувача видалено');
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(port, () => {
    console.log(`Сервер слухає порт: ${port}`);
});

