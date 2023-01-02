import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// interface for the properties of a Review
interface ReviewAttrs {
  orderId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  content: string;
}

// interface for the properties of a User Model
interface ReviewModel extends mongoose.Model<ReviewDoc> {
  build(attrs: ReviewAttrs): ReviewDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<ReviewDoc | null>;
}

// interface for the properties of User Document (contains extra attributes added by mongoose)
interface ReviewDoc extends mongoose.Document {
  orderId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  content: string;
  version: number;
}

const ReviewSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    reviewerId: {
      type: String,
      required: true,
    },
    revieweeId: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    content: {
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
        delete ret.password;
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ReviewSchema.set('versionKey', 'version');
ReviewSchema.plugin(updateIfCurrentPlugin);

// instead of creating a new user from new User(),
// will use this fn for type checking
ReviewSchema.statics.build = (attrs: ReviewAttrs) => {
  return new Review(attrs);
};

ReviewSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  // find using id and version number
  // will only update if ticket event received's version number is 1 more than version number in db
  return Review.findOne({ _id: event.id, version: event.version - 1 });
};

const Review = mongoose.model<ReviewDoc, ReviewModel>('Review', ReviewSchema);

export { Review };
