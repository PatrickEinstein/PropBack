import { Injectable, Scope } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ProjectDocument = mongoose.HydratedDocument<Project> & {
  updatedAt: Date;
  createdAt: Date;
};
export type ProjectStatus = 'active' | 'pending' | 'completed';
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collation: { locale: 'en', caseLevel: false },
})
@Injectable({ scope: Scope.TRANSIENT })
export class Project {
  @Prop({
    type: String,
    required: [true, 'project name is required'],
  })
  name: string;

  @Prop({
    type: String,
    required: [true, 'description is required'],
  })
  description: string;

  @Prop({
    type: String,
    required: [true, 'industry is required'],
  })
  industry: string;

  @Prop({
    type: Number,
    required: [true, 'funding target is required'],
  })
  fundingTarget: number;

  @Prop({
    type: Number,
    required: [true, 'share percentage is required'],
  })
  sharePercentage: number;

  @Prop({
    type: Number,
    required: [true, 'funding tenure is required'],
  })
  fundingTenure: number;

  @Prop({
    type: Number,
    required: [true, 'maturity period is required'],
  })
  maturityPeriod: number;

  @Prop({
    type: String,
    // required: true,
  })
  imageUrl: string;

  @Prop({
    type: String,
    enum: ['active', 'pending', 'completed'],
    default: 'pending',
  })
  status: ProjectStatus;

  @Prop({
    type: Number,
    default: 0,
  })
  progress: number;
}

const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.index({
  name: 1,
  description: 1,
  industry: 1,
  fundingTarget: 1,
  sharePercentage: 1,
  fundingTenure: 1,
  maturityPeriod: 1,
  imageUrl: 1,
  status: 1,
});

export default ProjectSchema;
