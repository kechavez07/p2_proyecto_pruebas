import request from 'supertest';
import app from '../src/index';

describe('GET /api/health', () => {
  it('debe responder con status 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
  });
});