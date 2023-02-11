import request from 'supertest';
import { isObjectBindingPattern } from 'typescript';
import { app } from '../../app';

describe('Test `/api/users/signup` agains possible type of inputs', () => {
  it('Empty body should return status code 400 and 2 error messages', async () => {
    await request(app).post('/api/users/signup').expect(400);
  });

  it('Missing field will return status code 400', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'sends',
      })
      .expect(400);

    await request(app)
      .post('/api/users/signup')
      .send({
        password: 'sends',
      })
      .expect(400);
  });

  it('Invalid fields will return status code 400', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'invalid_email',
        password: 'password',
      })
      .expect(400);

    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'valid@email.com',
        password: 'pa', //invalid password
      })
      .expect(400);

    await request(app)
      .post('/api/users/signup')
      .send({
        //both fields are invalid
        email: 'invalid_email',
        password: 'pa',
      })
      .expect(400);
  });

  it('Valid inputs return status code 401', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'valid@email.com',
        password: 'password',
      })
      .expect(201);
  });

  it('Disallow reuse of email', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'valid1@email.com',
        password: 'password',
      })
      .expect(201);

    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'valid1@email.com',
        password: 'password',
      })
      .expect(400);
  });
});

describe('Test cookie', () => {
  it('It sets cookie after successful signup', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'valid1@email.com',
        password: 'password',
      })
      .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
