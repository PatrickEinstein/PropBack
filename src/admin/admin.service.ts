import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { BaseService } from '../common/BaseService';
import {
  FundTransaction,
  FundTransactionDocument,
} from '../fund/schema/fund-transaction.schema';
import { Project, ProjectDocument } from '../project/schema/project.schema';
import { Funder, FunderDocument } from '../user/schema/funder.schema';

@Injectable()
export class AdminService extends BaseService {
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

  async fetchAdminFundersPageSummary() {
    const funders = await this.funderModel.countDocuments();
    const activelyFunding = await this.fundTransactionModel.aggregate([
      {
        $group: {
          _id: '$user',
        },
      },
    ]);
    const activeFunders = activelyFunding.length;
    const nonFunding = funders - activeFunders;

    return {
      data: {
        funders,
        activeFunders,
        nonFunding,
      },
      message: `Admin funder's page summary fetched successfully`,
    };
  }

  async fetchAdminFundersPageDetails() {
    const funders = await this.funderModel.aggregate([
      {
        $lookup: {
          as: 'user',
          from: 'users',
          localField: 'user',
          foreignField: '_id',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $lookup: {
          as: 'funded',
          from: 'fundtransactions',
          localField: '_id',
          foreignField: 'user',
        },
      },
      {
        $addFields: {
          funded: {
            $filter: {
              input: '$funded',
              as: 'transaction',
              cond: {
                $eq: ['$$transaction.status', 'approved'],
              },
            },
          },
        },
      },
      {
        $unwind: {
          path: '$funded',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: { $ifNull: ['$_id', '$funded.user'] },
          field: {
            $first: '$$ROOT',
          },
        },
      },
      {
        $group: {
          _id: '$field._id',
          firstName: { $first: '$field.firstName' },
          lastName: { $first: '$field.lastName' },
          email: { $first: '$field.user.email' },
          projectsFunded: {
            $push: '$field.funded',
          },
        },
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastname: 1,
          email: 1,
          projectsFunded: {
            $size: '$projectsFunded',
          },
        },
      },
    ]);

    return {
      data: funders,
      message: 'Admin funders page details fetched successfully',
    };
  }
}
