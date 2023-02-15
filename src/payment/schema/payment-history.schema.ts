import { Injectable, Scope } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { PaymentStatus } from '../../nowpayment/types';
import { PaymentDocument } from './payment.schema';

export type PaymentHistoryDocument =
  mongoose.HydratedDocument<PaymentHistory> & {
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
export class PaymentHistory {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'payment id is required'],
    ref: 'Payment',
  })
  payment:
    | mongoose.Schema.Types.ObjectId
    | mongoose.LeanDocument<PaymentDocument>;

  @Prop({
    type: String,
    required: [true, 'payment status is required'],
    enum: Object.values(PaymentStatus),
  })
  previousStatus: PaymentStatus;

  @Prop({
    type: String,
    required: [true, 'payment status is required'],
    enum: Object.values(PaymentStatus),
  })
  status: PaymentStatus;
}

const PaymentHistorySchema = SchemaFactory.createForClass(PaymentHistory);

PaymentHistorySchema.index({
  status: 1,
  payment: 1,
  previousStatus: 1,
});

export default PaymentHistorySchema;
