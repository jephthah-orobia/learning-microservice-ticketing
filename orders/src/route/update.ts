import {
  requireAuth,
  validateRequest,
  NotFoundError,
  ForbiddenError,
  DatabaseValidationError,
  natsu,
} from '@sirjhep/ticketing-common';
import { body } from 'express-validator';
import express, { Request, Response } from 'express';
import { Order, OrderStatus } from '../models/order';
import { OrderUpdatedPublisher } from '../events/order-updated-publisher';

const router = express.Router();

router.put(
  '/api/orders/:id',
  requireAuth,
  [
    body('status')
      .not()
      .isEmpty()
      .withMessage('status must not be empty')
      .isIn([OrderStatus.AwaitingPayment, OrderStatus.Complete])
      .withMessage(
        `status should be either ${OrderStatus.AwaitingPayment} or ${OrderStatus.Complete}`
      ),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).populate('ticket');

    if (!order) throw new NotFoundError();

    if (order.userId != req.currentUser!.id) throw new ForbiddenError();

    order.status = status;

    try {
      const newOrder = await order.save();
      new OrderUpdatedPublisher(natsu.client).publish({
        id: newOrder.id,
        status: newOrder.status as OrderStatus,
        __v: newOrder.__v,
      });
      res.status(201).send(order);
    } catch (e) {
      console.error(e);
      throw new DatabaseValidationError();
    }
  }
);

export default router;
