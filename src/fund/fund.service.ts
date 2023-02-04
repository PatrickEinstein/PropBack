import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { UserOption } from '../auth/strategy/requestWithUser';
import { Project, ProjectDocument } from '../project/schema/project.schema';
import { Funder, FunderDocument } from '../user/schema/funder.schema';
import { User, UserDocument } from '../user/schema/user.schema';
import { FundProjectDto } from './dto/fund-project.dto';
import {
  FundTransaction,
  FundTransactionDocument,
} from './schema/fund-transaction.schema';
import { v4 as uuid } from 'uuid';
import { FetchFundingDto } from './dto/fetch-funding.dto';
import { BaseService } from '../common/BaseService';
import {
  PortfolioItem,
  PortfolioItemDocument,
} from './schema/portfolio-item.schema';
import { FetchPortfolioDto } from './dto/fetch-portfolio.dto';
import { FetchFundingHistoryDto } from './dto/fetch-funding-history.dto';

@Injectable()
export class FundService extends BaseService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Funder.name) private funderModel: Model<FunderDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(FundTransaction.name)
    private fundTransactionModel: Model<FundTransactionDocument>,
    @InjectModel(PortfolioItem.name)
    private portfolioItemModel: Model<PortfolioItemDocument>,
  ) {
    super();
  }

  async funderFundProject(
    dto: FundProjectDto,
    user: UserOption,
    projectId: string,
  ) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      // check project and project status
      // check progress compared to amount input by the user
      // check hash later on

      if (user.type !== 'funder') {
        throw new ForbiddenException('Not a Funder');
      }

      const project = await this.projectModel.findById(
        projectId,
        {},
        { session },
      );
      if (!project) {
        throw new BadRequestException('Invalid project id');
      }
      if (project.status !== 'active') {
        throw new BadRequestException('You can only fund an active project');
      }
      const { amount } = dto;
      if (project.progress + amount > project.fundingTarget) {
        throw new BadRequestException(
          'User input amount is greater than amount left',
        );
      }

      const sharePercentage =
        project.sharePercentage * (amount / project.fundingTarget);

      // Call the smart contract to create create the NFT for this user

      const transaction = (
        await this.fundTransactionModel.create(
          [
            {
              user: user.funder._id,
              amount,
              project: projectId,
              transactionHash: uuid(),
              sharePercentage,
            },
          ],
          {
            session,
          },
        )
      )[0];

      if (!transaction) {
        throw new BadRequestException('Could not fund project');
      }

      const item = await this.portfolioItemModel.create([
        {
          user: user.funder._id,
          project: projectId,
          transaction: transaction._id,
          status: 'active',
        },
      ]);
      if (!item) {
        throw new BadRequestException('Could not fund project');
      }

      project.progress = project.progress + amount;
      await project.save({ session });

      await session.commitTransaction();

      return { message: 'Project funded successfully' };
    } catch (err) {
      session.abortTransaction();
      throw err;
    }
  }

  async fetchProjectFunding(projectId: string, body: FetchFundingDto) {
    const project = await this.projectModel.findById(projectId);
    if (!project) {
      throw new BadRequestException('Invalid project id');
    }

    const query = {
      project: project._id.toHexString(),
    };

    return this.fetchFundingHistory({ ...query, ...body });
  }

  async fetchFundingHistory(body: FetchFundingHistoryDto) {
    body.populate = 'user founder project';
    const data = await this.getPaginatedReponse(
      { ...body },
      this.fundTransactionModel,
    );

    return {
      ...data,
      message: 'Funding transaction history fetched successfully',
    };
  }

  async fetchFunderPortfolio(user: UserOption, body: FetchPortfolioDto) {
    if (user.type !== 'funder') {
      throw new ForbiddenException('Not a funder');
    }
    body.populate = 'user founder project transaction item';
    const data = await this.getPaginatedReponse(
      { ...body, user: user.funder._id },
      this.portfolioItemModel,
    );

    return {
      ...data,
      message: 'Funder portfolio fetched successfully',
    };
  }
}
