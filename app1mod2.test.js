const request = require('supertest');
const app = require('./app1mod2');

describe('GET /greeting', () => {
    it('"Hello World!"', async () => {
        const response = await request(app).get('/greeting');
        expect(response.text).toBe('Hello World!');
        expect(response.status).toBe(200);
    });
});
