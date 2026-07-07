const request = require('supertest');
const app = require('./server'); // Imports your express app

describe('Backend API Endpoints', () => {
    it('should return 200 for the root health check', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
    });

    it('should block empty chat requests with a 400 error', async () => {
        const res = await request(app).post('/api/chat').send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });
});