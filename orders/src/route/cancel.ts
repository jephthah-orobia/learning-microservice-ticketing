import {
  requireAuth,
  validateRequest,
  NotFoundError,
  ForbiddenError,
  DatabaseValidationError,
  natsu,
} from '@sirjhep/ticketing-common';
import { Order, OrderStatus } from '../models/order';
import express, { Request, Response } from 'express';
import { OrderCancelledPublisher } from '../events/order-canceled-publisher';

const router = express.Router();

router.delete(
  '/api/orders/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate('ticket');

    if (!order) throw new NotFoundError();

    if (order.userId != req.currentUser!.id) throw new ForbiddenError();

    order.status = OrderStatus.Cancelled;

    try {
      const newOrder = await order.save();

      new OrderCancelledPublisher(natsu.client).publish({
        id: newOrder.id,
        ticket: {
          id: newOrder.ticket.id,
          __v: newOrder.ticket.__v + 1,
        },
        __v: newOrder.__v,
      });

      res.status(204).send();
    } catch (e) {
      console.error(e);
      throw new DatabaseValidationError();
    }
  }
);

export default router;
