import {
  DatabaseValidationError,
  requireAuth,
  validateRequest,
  natsu,
} from '@sirjhep/ticketing-common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { TicketCreatedPublisher } from '../events/ticket-created-publisher';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required!'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    try {
      const ticket = await Ticket.build({
        title,
        price,
        userId: req.currentUser!.id,
      }).save();

      new TicketCreatedPublisher(natsu.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
      });

      res.status(201).send(ticket);
    } catch (e) {
      throw new DatabaseValidationError();
    }
  }
);

export default router;
