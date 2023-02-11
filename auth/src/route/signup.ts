import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, validateRequest } from '@sirjhep/ticketing-common';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({
        min: 4,
        max: 20,
      })
      .withMessage('Password must be between 4 and 40 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email: email });

    if (existingUser) throw new BadRequestError('Email in use!');
    else {
      const user = User.build({ email: email, password: password });
      try {
        await user.save();

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

        return res.status(201).send(user);
      } catch (e) {
        throw new BadRequestError(e as string);
      }
    }
  }
);

export { router as signUpRouter };
