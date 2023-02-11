import {
  currentUser,
  DatabaseValidationError,
  ForbiddenError,
  NotFoundError,
  requireAuth,
  validateRequest,
  natsu,
  BadRequestError,
} from '@sirjhep/ticketing-common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/ticket-updated-publisher';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  currentUser,
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price should be greater than 0.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) throw new NotFoundError();

    if (ticket.userId != req.currentUser!.id) throw new ForbiddenError();

    if (ticket.orderId) throw new BadRequestError('Ticket is reserved!');

    const { title, price } = req.body;

    ticket.set('title', title);
    ticket.set('price', price);

    try {
      const new_ticket = await ticket.save();

      await new TicketUpdatedPublisher(natsu.client).publish({
        id: new_ticket.id,
        title: new_ticket.title,
        price: new_ticket.price,
        userId: new_ticket.userId,
        __v: new_ticket.__v,
      });

      res.status(201).send(ticket);
    } catch (e) {
      throw new DatabaseValidationError();
    }
  }
);

export default router;
