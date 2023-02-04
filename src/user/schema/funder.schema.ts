import { Injectable, Scope } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { UserDocument } from './user.schema';

export type FunderDocument = mongoose.HydratedDocument<Funder> & {
  updatedAt: Date;
  createdAt: Date;
};

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collation: { locale: 'en', caseLevel: false },
})
@Injectable({ scope: Scope.TRANSIENT })
export class Funder {
  @Prop({
    type: String,
    required: [true, 'first name is required'],
  })
  firstName: string;

  @Prop({
    type: String,
    required: [true, 'last name is required'],
  })
  lastName: string;

  @Prop({
    type: String,
    required: [true, 'phone number is required'],
    match: [/(\+234)([7-9][01])([0-9]){8}/, 'Please add a valid phone number'],
  })
  phoneNumber: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'user id is required'],
    ref: 'User',
  })
  user: mongoose.Schema.Types.ObjectId | mongoose.LeanDocument<UserDocument>;

  @Prop({
    type: String,
  })
  profilePicture: string;
}

const FunderSchema = SchemaFactory.createForClass(Funder);

FunderSchema.index({
  firstName: 1,
  lastName: 1,
  phoneNumber: 1,
  user: 1,
});

export default FunderSchema;
