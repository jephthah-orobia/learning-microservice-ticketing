import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@sirjhep/ticketing-common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { OrderStatus, Order } from '../models/order';

const router = express.Router();

// create charge
router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError();

    if (order.userId != req.currentUser!.id) throw new NotAuthorizedError();

    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestError('Cannot pay for a cancelled order!');

    res.send({ success: true });
  }
);

export default router;
