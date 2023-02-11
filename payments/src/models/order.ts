import mongoose from 'mongoose';
import { OrderStatus } from '@sirjhep/ticketing-common';

export { OrderStatus };

interface OrderAttrs {
  id: string;
  status?: string;
  userId: string;
  price: number;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: string;
  price: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attr: OrderAttrs): OrderDoc;
  findByEventData(data: { id: string; __v: number }): Promise<OrderDoc | null>;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: OrderStatus,
      default: OrderStatus.Created,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    optimisticConcurrency: true,
  }
);

orderSchema.statics.findByEventData = (data: { id: string; __v: number }) => {
  return Order.findOne({
    _id: data.id,
    __v: data.__v - 1,
  }).populate('ticket');
};

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({ ...attrs, _id: attrs.id });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
