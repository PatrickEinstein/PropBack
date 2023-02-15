import { Injectable, Scope } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { PaymentStatus } from '../../nowpayment/types';
import { FunderDocument } from '../../user/schema/funder.schema';

export type PaymentDocument = mongoose.HydratedDocument<Payment> & {
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
export class Payment {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'funder id is required'],
    ref: 'Funder',
  })
  funder:
    | mongoose.Schema.Types.ObjectId
    | mongoose.LeanDocument<FunderDocument>;

  @Prop({
    type: String,
    required: [true, 'address is required'],
  })
  address: string;

  @Prop({
    type: String,
    required: [true, 'currency is required'],
  })
  currency: string;

  @Prop({
    type: String,
    required: [true, 'amount is required'],
  })
  amount: string;

  @Prop({
    type: String,
    required: [true, 'transaction id is required'],
  })
  transactionId: string;

  @Prop({
    type: String,
    required: [true, 'payment id is required'],
  })
  paymentId: string;

  @Prop({
    type: String,
    default: PaymentStatus.Waiting,
    enum: Object.values(PaymentStatus),
  })
  status: PaymentStatus;
}

const PaymentSchema = SchemaFactory.createForClass(Payment);

PaymentSchema.index({
  funder: 1,
  transactionId: 1,
  status: 1,
});

export default PaymentSchema;
