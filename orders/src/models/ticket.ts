import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

// This is a stripped down version of Ticket model compared to the model in tickets service

// interface for the properties of a Ticket
interface TicketAttrs {
  title: string;
  price: number;
}

// interface for the properties of a Ticket Model
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

// interface for the properties of Ticket Document (contains extra attributes)
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    // take user document and convert to a customised json
    // Modifying ret directly will modify json
    // this is the returned object when Ticket.build() is returned
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// ticketSchema.statics used to add functions to ticket model itself
// instead of creating a new user from new Ticket(),
// will use this fn for type checking
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

// ticketSchema.methods add function to ticket document
// cannot use arrow function here
ticketSchema.methods.isReserved = async function () {
  // 'this' keyword refers to ticket document we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  if (!existingOrder) {
    return false;
  }
  return true;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
