import {
  ForbiddenError,
  NotFoundError,
  requireAuth,
} from '@sirjhep/ticketing-common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('ticket');

  res.json(orders);
});

router.get(
  '/api/orders/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate('ticket');

    if (!order) throw new NotFoundError();

    if (order.userId != req.currentUser!.id) throw new ForbiddenError();

    res.json(order);
  }
);

export default router;
