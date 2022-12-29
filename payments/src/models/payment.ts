import mongoose from 'mongoose';

// Payment db to relate charges with orders
// No version number as payments will be unchanged

// interface for the properties of a Payment
interface PaymentAttrs {
  stripeId: string;
  orderId: string;
}

// interface for the properties of a User Model
interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

// interface for the properties of User Document (contains extra attributes added by mongoose)
interface PaymentDoc extends mongoose.Document {
  stripeId: string;
  orderId: string;
}

const PaymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
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

// instead of creating a new user from new User(),
// will use this fn for type checking
PaymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  'Payment',
  PaymentSchema
);

export { Payment };
