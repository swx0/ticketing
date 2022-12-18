import mongoose from 'mongoose';
import { Password } from '../services/password';

// interface for the properties of a User
interface UserAttrs {
  email: string;
  password: string;
}

// interface for the properties of a User Model
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// interface for the properties of User Document (contains extra attributes added by mongoose)
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
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

// function used instead of arrow, in order to use this. keyword
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

// instead of creating a new user from new User(),
// will use this fn for type checking
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
