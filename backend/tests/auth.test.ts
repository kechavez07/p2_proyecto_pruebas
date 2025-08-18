import request from 'supertest';
import app from '../src/index';
import { sequelize } from '../src/config/database';
jest.setTimeout(20000);

describe('Pruebas de autenticación', () => {
  const testUser = {
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'Test1234!',
    confirmPassword: 'Test1234!'
  };

  beforeAll(async () => {
    await sequelize.sync({ force: false });
  });


  it('1. Registro exitoso de usuario', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('2. Registro con email ya existente', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('3. Login exitoso', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('token');
  });

  it('4. Login con credenciales inválidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('5. Acceso a perfil sin token', async () => {
    const res = await request(app)
      .get('/api/auth/profile');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
