import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import FundTransactionSchema, {
  FundTransaction,
} from '../fund/schema/fund-transaction.schema';
import PortfolioItemSchema, {
  PortfolioItem,
} from '../fund/schema/portfolio-item.schema';
import KycSchema, { Kyc } from '../kyc/schema/kyc.schema';
import PaymentSchema, { Payment } from '../payment/schema/payment.schema';
import CategorySchema, { Category } from '../project/schema/category.schema';
import FavouriteProjectSchema, {
  FavouriteProject,
} from '../project/schema/favourite-project.schema';
import ProjectSchema, { Project } from '../project/schema/project.schema';
import FunderSchema, { Funder } from './schema/funder.schema';
import UserSchema, { User } from './schema/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Kyc.name, schema: KycSchema },
      { name: User.name, schema: UserSchema },
      { name: Funder.name, schema: FunderSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Category.name, schema: CategorySchema },
      { name: PortfolioItem.name, schema: PortfolioItemSchema },
      { name: FundTransaction.name, schema: FundTransactionSchema },
      { name: FavouriteProject.name, schema: FavouriteProjectSchema },
    ]),
  ],
  providers: [UserService],
  exports: [
    MongooseModule.forFeature([
      { name: Kyc.name, schema: KycSchema },
      { name: User.name, schema: UserSchema },
      { name: Funder.name, schema: FunderSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Category.name, schema: CategorySchema },
      { name: PortfolioItem.name, schema: PortfolioItemSchema },
      { name: FundTransaction.name, schema: FundTransactionSchema },
      { name: FavouriteProject.name, schema: FavouriteProjectSchema },
    ]),
  ],
  controllers: [UserController],
})
export class UserModule {}
