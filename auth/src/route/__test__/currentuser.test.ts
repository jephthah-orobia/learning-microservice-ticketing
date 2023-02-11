import request from 'supertest';
import { app } from '../../app';
import { signIn } from '../../test/setup';

it('responds with details about the current user', async () => {
  const cookie = await signIn('valid1@email.com', 'password');

  expect(cookie).toBeDefined;

  const user = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .expect(200);

  expect(user.body.currentUser.email).toEqual('valid1@email.com');
});
