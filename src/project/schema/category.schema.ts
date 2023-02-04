import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type CategoryDocument = mongoose.HydratedDocument<Category> & {
  updatedAt: Date;
  createdAt: Date;
};

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collation: { locale: 'en', caseLevel: false },
})
export class Category {
  @Prop({
    type: [String],
  })
  fields: string[];
}

const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.index({
  fields: 1,
});

export default CategorySchema;
