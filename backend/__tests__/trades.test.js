// Import required modules
const request = require('supertest');  // HTTP request testing library
const app = require('../index');   // Your Express.js server
require('dotenv/config');  // Import and configure dotenv
const bearerToken = process.env.APP_BEARER_TOKEN;

describe('GET /trades_list', () => {
    it('responds with a successful message', async () => {
        await app.listen(3217); // Add await here
        const response = await request(app).get('/api/trades_list').set('Authorization', `Bearer ${bearerToken}`);
        expect(response.status).toBe(200);
        expect.extend({
            toBeValidJSON(received) {
                try {
                    JSON.parse(received);
                    return {
                        pass: true,
                        message: () => 'Expected value to be valid JSON',
                    };
                } catch (error) {
                    return {
                        pass: false,
                        message: () => `Expected value to be valid JSON, but got error: ${error.message}`,
                    };
                }
            },
        });

        expect(response.text).toBeValidJSON();
    });
});
describe('POST /trades_list', () => {
    it('responds with a unsuccessful message', async () => {
        await app.listen(3218); // Add await here
        const response = await request(app).post('/api/trades_list').set('Authorization', `Bearer ${bearerToken}`);
        expect([405, 404]).toContain(response.status);
    });
});
