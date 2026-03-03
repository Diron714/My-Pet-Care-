/**
 * Health check endpoint test.
 * Run with: npm test
 */
import request from 'supertest';
import app from '../server.js';

describe('Health Check', () => {
  it('GET /health returns 200 and status OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('message');
  });
});
