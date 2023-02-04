import { Injectable, Scope } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { FunderDocument } from '../../user/schema/funder.schema';
import { ProjectDocument } from './project.schema';

export type FavouriteProjectDocument =
  mongoose.HydratedDocument<FavouriteProject> & {
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
export class FavouriteProject {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'project id is required'],
    ref: 'Project',
  })
  project:
    | mongoose.Schema.Types.ObjectId
    | mongoose.LeanDocument<ProjectDocument>;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'funder id is required'],
    ref: 'Funder',
  })
  funder:
    | mongoose.Schema.Types.ObjectId
    | mongoose.LeanDocument<FunderDocument>;
}

const FavouriteProjectSchema = SchemaFactory.createForClass(FavouriteProject);

FavouriteProjectSchema.index({
  project: 1,
  funder: 1,
});

export default FavouriteProjectSchema;
