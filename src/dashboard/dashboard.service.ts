import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import * as mongoose from 'mongoose';
import { UserOption } from '../auth/strategy/requestWithUser';
import { BaseService } from '../common/BaseService';
import {
  FundTransaction,
  FundTransactionDocument,
} from '../fund/schema/fund-transaction.schema';
import { Project, ProjectDocument } from '../project/schema/project.schema';
import { Funder, FunderDocument } from '../user/schema/funder.schema';

@Injectable()
export class DashboardService extends BaseService {
  constructor(
    @InjectModel(Funder.name)
    private funderModel: mongoose.Model<FunderDocument>,
    @InjectModel(Project.name)
    private projectModel: mongoose.Model<ProjectDocument>,
    @InjectModel(FundTransaction.name)
    private fundTransactionModel: mongoose.Model<FundTransactionDocument>,
  ) {
    super();
  }

  // async getFounderDashboardSummary(user: UserOption) {
  //   if (user.type !== 'founder') {
  //     throw new ForbiddenException('Not a founder');
  //   }

  //   const projects = await this.projectModel.countDocuments({
  //     founder: user.founder._id,
  //   });

  //   const funders = await this.fundTransactionModel.aggregate([
  //     {
  //       $match: {
  //         founder: new mongoose.Types.ObjectId(user.founder._id),
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: '$user',
  //       },
  //     },
  //   ]);

  //   const teamMembers = await this.teamMemberModel.countDocuments({
  //     founder: user.founder._id,
  //   });

  //   return {
  //     data: {
  //       projects,
  //       teamMembers,
  //       funders: funders.length,
  //     },
  //     message: 'Founder dashboard summary fetched successfully',
  //   };
  // }

  // async getFounderDashboardAnalysis(user: UserOption) {
  //   if (user.type !== 'founder') {
  //     throw new ForbiddenException('Not a founder');
  //   }

  //   const volume = await this.projectModel.aggregate([
  //     {
  //       $match: {
  //         founder: new mongoose.Types.ObjectId(user.founder._id),
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: null,
  //         progress: { $sum: '$progress' },
  //         target: { $sum: '$fundingTarget' },
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 0,
  //       },
  //     },
  //   ]);

  //   return {
  //     data: volume[0],
  //     message: 'Founder dashboard analysis fetched successfully',
  //   };
  // }

  async getFundingReport(user: UserOption) {
    if (user.type !== 'admin') {
      throw new ForbiddenException('Not allowed');
    }

    const data = await this.projectModel.aggregate([
      {
        $match: {
          status: { $in: ['active', 'completed'] },
          createdAt: {
            $gte: moment().startOf('year').toDate(),
            $lte: moment().endOf('year').toDate(),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$createdAt' } },
          amount: { $sum: '$progress' },
        },
      },
      {
        $addFields: {
          month: '$_id.month',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    return {
      data,
      message: 'Funding report fetched successfully',
    };
  }

  async getTopProjects() {
    const projects = await this.projectModel.aggregate([
      {
        $match: {
          status: 'active',
        },
      },
      {
        $group: {
          _id: '$_id',
          volumeSold: { $sum: '$progress' },
          totalVolume: { $sum: '$fundingTarget' },
          name: { $first: '$name' },
          imageUrl: { $first: '$imageUrl' },
          industry: { $first: '$industry' },
        },
      },
      {
        $sort: {
          volumeSold: -1,
          totalVolume: -1,
        },
      },
      {
        $limit: 8,
      },
    ]);

    return {
      data: projects,
      message: 'Top projects fetched successfully',
    };
  }
}
