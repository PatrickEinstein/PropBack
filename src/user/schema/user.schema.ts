import { Injectable, Scope } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = mongoose.HydratedDocument<User> & {
  comparePassword: comparePasswordFunction;
  updatedAt: Date;
  createdAt: Date;
};

export type UserType = 'funder' | 'admin';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collation: { locale: 'en', caseLevel: false },
})
@Injectable({ scope: Scope.TRANSIENT })
export class User {
  @Prop({
    type: String,
    required: [true, 'email is required'],
    lowercase: true,
    trim: true,
    match:
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  })
  email: string;

  @Prop({
    type: String,
    required: [true, 'user type is required'],
    enum: ['founder', 'funder', 'admin', 'member'],
  })
  type: UserType;

  @Prop({
    type: String,
    required: [true, 'password is required'],
    select: false,
  })
  password: string;

  comparePassword: comparePasswordFunction;
}

const UserSchema = SchemaFactory.createForClass(User);

type comparePasswordFunction = (password: string) => Promise<boolean>;

async function comparePassword(
  this: UserDocument,
  password: string,
): Promise<boolean> {
  try {
    const validPassword = await bcrypt.compare(password, this.password || '');
    return validPassword;
  } catch (error) {
    console.error(error);
    return error;
  }
}

UserSchema.methods.comparePassword = comparePassword;

UserSchema.index({
  type: 1,
  email: 1,
  password: 1,
});

UserSchema.index({ email: 1, type: 1 }, { unique: true });

UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password') || !this.isNew) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);

    this.password = hash;
    next();
  } catch (error) {
    const err = error as Error;
    console.log(err);
    next(err);
  }
});

export default UserSchema;
