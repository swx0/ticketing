import mongoose from 'mongoose';
import { OrderStatus } from '@ticx/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Review } from './review';

export { OrderStatus };

// interface for the properties of a Order
interface OrderAttrs {
  id: string;
  userId: string;
  status: OrderStatus;
  version: number;
  price: number;
  title: string;
  ticketUserId: string;
}

// interface for the properties of a User Model
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

// interface for the properties of User Document (contains extra attributes added by mongoose)
interface OrderDoc extends mongoose.Document {
  userId: string;
  version: number;
  status: OrderStatus;
  price: number;
  title: string;
  ticketUserId: string;
  isReviewed(): Promise<boolean>;
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
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    price: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    ticketUserId: {
      type: String,
      required: true,
    },
  },
  {
    // take user document and convert to a customised json
    // Modifying ret directly will modify json
    // this is the returned object when User.build() is returned
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

// instead of creating a new user from new User(),
// will use this fn for type checking
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
    title: attrs.title,
    ticketUserId: attrs.ticketUserId,
  });
};

// orderSchema.methods add function to order document
// cannot use arrow function here
orderSchema.methods.isReviewed = async function () {
  // 'this' keyword refers to order document we just called 'isReviewed' on
  const existingReview = await Review.findOne({
    orderId: this.id,
  });

  if (!existingReview) {
    return false;
  }
  return true;
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
