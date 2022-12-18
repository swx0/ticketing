import mongoose from 'mongoose';

// interface for the properties of a Ticket
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// interface for the properties of a Ticket Model
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

// interface for the properties of Ticket Document (contains extra attributes added by mongoose)
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
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

// instead of creating a new user from new Ticket(),
// will use this fn for type checking
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
