import request from 'supertest';
import { app } from '../../app';

describe('Test /api/users/sign agains varying inputs', () => {
  it('fails when an email that does not exist is supplied', async () => {
    await request(app)
      .post('/api/users/signin')
      .send({
        email: 'valid1@email.com',
        password: 'password',
      })
      .expect(400);
  });

  it('fails when an wrong password supplied', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'valid1@email.com',
        password: 'password',
      })
      .expect(201);

    await request(app)
      .post('/api/users/signin')
      .send({
        email: 'valid1@email.com',
        password: 'pass',
      })
      .expect(400);
  });

  it('responds with a cookie when given valid credentials', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'valid1@email.com',
        password: 'password',
      })
      .expect(201);

    const response = await request(app)
      .post('/api/users/signin')
      .send({
        email: 'valid1@email.com',
        password: 'password',
      })
      .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
