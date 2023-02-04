import { Injectable, Scope } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { FunderDocument } from '../../user/schema/funder.schema';

export type KycDocument = mongoose.HydratedDocument<Kyc> & {
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
export class Kyc {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Funder',
    required: [true, 'funder id is required'],
  })
  funder:
    | mongoose.Schema.Types.ObjectId
    | mongoose.LeanDocument<FunderDocument>;

  @Prop({
    type: String,
    required: [true, 'identity type is required'],
  })
  identityType: string;

  @Prop({
    type: String,
    required: [true, 'front is required'],
  })
  front: string;

  @Prop({
    type: String,
    required: [true, 'back is required'],
  })
  back: string;
}

const KycSchema = SchemaFactory.createForClass(Kyc);

KycSchema.index({
  funder: 1,
  identityType: 1,
  front: 1,
  back: 1,
});

export default KycSchema;
