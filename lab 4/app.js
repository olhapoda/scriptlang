const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Підключення до MongoDB
mongoose.connect('mongodb://localhost:27017/Users', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Підключено до MongoDB');
}).catch(err => {
    console.error('Неможливо підключитись до MongoDB:', err);
});

const itemSchema = new mongoose.Schema({
    name: String,
    age: Number
});

const Item = mongoose.model('Item', itemSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Додати нового коистувача
app.post('/items', async (req, res) => {
    const { name, age } = req.body;

    const newItem = new Item({ name, age });

    try {
        const savedItem = await newItem.save();
        res.status(201).send(savedItem);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Отримати всі документи
app.get('/items', async (req, res) => {
    try {
        const query = req.query.name ? { name: { $regex: req.query.name, $options: 'i' } } : {};
        const items = await Item.find(query);
        res.status(200).send(items);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Отримати користувача через ID
app.get('/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).send('Користувача не знайдено');
        res.status(200).send(item);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Оновити користувача через ID
app.put('/items/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!item) return res.status(404).send('Користувача не знайдено');
        res.status(200).send(item);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Видалити користувача через  ID
app.delete('/items/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).send('Користувача не знайдено');
        res.status(200).send('Користувача видалено');
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(port, () => {
    console.log(`Сервер слухає порт: ${port}`);
});





