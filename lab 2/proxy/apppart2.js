// Сервер
const express = require('express');
const convict = require('convict');
const dotenv = require('dotenv');
const axios = require('axios');
const http = require('http');

dotenv.config();

const config = convict({
    server1: {
        url: {
            doc: "URL api",
            format: String,
            default: "http://127.0.0.1",
            env: "API_URL"
        },
        port: {
            doc: "Port api",
            format: "port",
            default: 3000,
            env: "API_PORT"
        }
    },
    server2: {
        port: {
            doc: "Port proxy",
            format: "port",
            default: 3001,
            env: "PROXY_PORT"
        }
    }
});

config.validate({ allowed: 'strict' });

const server1Url = config.get('server1.url');
const server1Port = config.get('server1.port');
const server2Port = config.get('server2.port');

const app = express();

// Сервіси
const fetchExternalData = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error(`Проблема з даними тут: ${url}: ${error.message}`);
    }
};

// Роутинг
app.get('/', async (req, res) => {
    try {
        const response = await axios.get(`${server1Url}:${server1Port}/`);
        res.send(response.data);
    } catch (error) {
        console.error(`Проблема із запитом: ${error.message}`);
        res.status(500).send(`Проблема із запитом: ${error.message}`);
    }
});


app.use((req, res) => {
    res.status(404).send("Не знайдено");
});

const server = http.createServer(app);

server.listen(server2Port, "127.0.0.1", () => {
    console.log(`Сервер слухає порт: http://127.0.0.1:${server2Port}/`);
});


