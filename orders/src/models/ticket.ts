import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// This is a stripped down version of Ticket model compared to the model in tickets service

// interface for the properties of a Ticket
interface TicketAttrs {
  id: string;
  title: string;
  price: number;
  userId: string;
}

// interface for the properties of a Ticket Model
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

// interface for the properties of Ticket Document (contains extra attributes)
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
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
    userId: {
      type: String,
      required: true,
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

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

// ticketSchema.statics used to add functions to ticket model itself
// instead of creating a new user from new Ticket(),
// will use this fn for type checking
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
    userId: attrs.userId,
  });
};

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  // find using id and version number
  // will only update if ticket event received's version number is 1 more than version number in db
  return Ticket.findOne({ _id: event.id, version: event.version - 1 });
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
