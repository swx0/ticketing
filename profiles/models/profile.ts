import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { ReviewDoc } from './review';

// interface for the properties of a Profile
interface ProfileAttrs {
  id: string;
}

// interface for the properties of a Profile Model
interface ProfileModel extends mongoose.Model<ProfileDoc> {
  build(attrs: ProfileAttrs): ProfileDoc;
}

// interface for the properties of Profile Document (contains extra attributes added by mongoose)
interface ProfileDoc extends mongoose.Document {
  reviews?: ReviewDoc[];
  version: number;
}

const profileSchema = new mongoose.Schema(
  {
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  {
    // take Profile document and convert to a customised json
    // Modifying ret directly will modify json
    // this is the returned object when Profile.build() is returned
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

profileSchema.set('versionKey', 'version');
profileSchema.plugin(updateIfCurrentPlugin);

// instead of creating a new Profile from new Profile(),
// will use this fn for type checking
profileSchema.statics.build = (attrs: ProfileAttrs) => {
  return new Profile({ _id: attrs.id });
};

profileSchema.statics.findByEvent = (event: {
  id: string;
  version: number;
}) => {
  // find using id and version number
  // will only update if received's version number is 1 more than version number in db
  return Profile.findOne({ _id: event.id, version: event.version - 1 });
};

const Profile = mongoose.model<ProfileDoc, ProfileModel>(
  'Profile',
  profileSchema
);

export { Profile };
