import mongoose from 'mongoose';
import {
  BadRequestError,
  DatabaseValidationError,
  natsu,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@sirjhep/ticketing-common';
import { body } from 'express-validator';
import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/order-created-publisher';

const router = express.Router();

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError();

    // Make sure that the ticket is not already reseved
    const isReserved = await ticket.isReserved();
    if (isReserved) throw new NotAuthorizedError();

    // Calculate and expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 15 * 60);

    try {
      // Build the order and save it to the database
      const order = Order.build({
        userId: req.currentUser!.id,
        expiresAt: expiration,
        ticket: ticket,
      });

      const savedOrder = await order.save();

      await new OrderCreatedPublisher(natsu.client).publish({
        id: savedOrder.id,
        status: savedOrder.status as OrderStatus,
        userId: savedOrder.userId,
        expiresAt: savedOrder.expiresAt.toISOString(),
        ticket: {
          id: savedOrder.ticket.id,
          __v: savedOrder.ticket.__v + 1,
        },
      });
      // Publish an event sayhing that an order was created
      res.status(201).json(order);
    } catch (e) {
      throw new BadRequestError(e + '');
    }
  }
);

export default router;
