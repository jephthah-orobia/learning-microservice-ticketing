import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, validateRequest } from '@sirjhep/ticketing-common';
import { User } from '../models/user';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid!'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (user) {
      const passwordMatch = await Password.compare(user.password, password);
      if (passwordMatch) {
        const userJwt = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          process.env.JWT_KEY!
        );

        req.session = {
          jwt: userJwt,
        };

        return res.status(200).send(user);
      }
    }

    throw new BadRequestError('Invalid credentials!');
  }
);

export { router as signInRouter };
