import request from 'supertest';
import { app } from '../../app';

it('clears the cookie after signing out', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'valid1@email.com',
      password: 'password',
    })
    .expect(201);

  const res = await request(app).post('/api/users/signout').expect(200);

  expect(res.get('Set-Cookie')[0]).toBe(
    'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
