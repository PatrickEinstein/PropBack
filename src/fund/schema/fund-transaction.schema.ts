import { Injectable, Scope } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ProjectDocument } from '../../project/schema/project.schema';
import { FunderDocument } from '../../user/schema/funder.schema';

export type FundTransactionDocument =
  mongoose.HydratedDocument<FundTransaction> & {
    updatedAt: Date;
    createdAt: Date;
  };

export type FundTransactionStatus = 'pending' | 'approved' | 'cancelled';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collation: { locale: 'en', caseLevel: false },
})
@Injectable({ scope: Scope.TRANSIENT })
export class FundTransaction {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Funder',
    required: [true, 'user id is required'],
  })
  user: mongoose.Schema.Types.ObjectId | mongoose.LeanDocument<FunderDocument>;

  @Prop({
    type: Number,
    required: [true, 'amount is required'],
  })
  amount: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'project id is required'],
  })
  project:
    | mongoose.Schema.Types.ObjectId
    | mongoose.LeanDocument<ProjectDocument>;

  @Prop({
    type: String,
  })
  transactionHash: string;

  @Prop({
    type: Number,
    required: true,
  })
  sharePercentage: number;

  @Prop({
    type: String,
    enum: ['approved', 'cancelled', 'pending'],
    default: 'pending',
  })
  status: FundTransactionStatus;
}

const FundTransactionSchema = SchemaFactory.createForClass(FundTransaction);

FundTransactionSchema.index({ transactionHash: 1 }, { unique: true });

FundTransactionSchema.index({
  user: 1,
  amount: 1,
  volume: 1,
  project: 1,
  status: 1,
});

export default FundTransactionSchema;
