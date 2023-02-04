import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { FunderDocument } from '../../user/schema/funder.schema';
import { ProjectDocument } from '../../project/schema/project.schema';
import { FundTransactionDocument } from './fund-transaction.schema';

export type PortfolioItemDocument = mongoose.HydratedDocument<PortfolioItem> & {
  updatedAt: Date;
  createdAt: Date;
};

export type PortfolioItemStatus = 'active' | 'sold' | 'pending' | 'failed';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collation: { locale: 'en', caseLevel: false },
})
export class PortfolioItem {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Funder',
    required: [true, 'funder id is required'],
  })
  user: mongoose.Schema.Types.ObjectId | mongoose.LeanDocument<FunderDocument>;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'project id is required'],
  })
  project:
    | mongoose.Schema.Types.ObjectId
    | mongoose.LeanDocument<ProjectDocument>;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FundTransaction',
    required: [true, 'transaction id is required'],
  })
  transaction:
    | mongoose.Schema.Types.ObjectId
    | mongoose.LeanDocument<FundTransactionDocument>;

  @Prop({
    type: String,
    required: [true, 'portfolio item status is required'],
    enum: ['active', 'sold', 'pending', 'failed'],
    default: 'pending',
  })
  status: PortfolioItemStatus;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: PortfolioItem.name,
  })
  item:
    | mongoose.Schema.Types.ObjectId
    | mongoose.LeanDocument<PortfolioItemDocument>;
}

const PortfolioItemSchema = SchemaFactory.createForClass(PortfolioItem);

PortfolioItemSchema.index({
  user: 1,
  project: 1,
  transaction: 1,
  status: 1,
  item: 1,
});

export default PortfolioItemSchema;
