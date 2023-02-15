import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { GetPaymentStatusResponse, PaymentStatus } from '../nowpayment/types';
import { User, UserDocument } from '../user/schema/user.schema';
import { Payment, PaymentDocument } from './schema/payment.schema';
import * as crypto from 'crypto';
import { Project, ProjectDocument } from '../project/schema/project.schema';
import {
  FundTransaction,
  FundTransactionDocument,
} from '../fund/schema/fund-transaction.schema';
import {
  PaymentHistory,
  PaymentHistoryDocument,
} from './schema/payment-history.schema';
import {
  PortfolioItem,
  PortfolioItemDocument,
} from '../fund/schema/portfolio-item.schema';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(PaymentHistory.name)
    private paymentHistoryModel: Model<PaymentHistoryDocument>,
    @InjectModel(PortfolioItem.name)
    private portfolioItemModel: Model<PortfolioItemDocument>,
    @InjectModel(FundTransaction.name)
    private fundTransactionModel: Model<FundTransactionDocument>,
    private config: ConfigService,
    @InjectConnection() private connection: Connection,
  ) {}
  async webhookHandler(
    body: GetPaymentStatusResponse,
    nowPaymentSignature: string,
  ) {
    const endpointName = 'webhookHandler';
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const notificationsKey = this.config.getOrThrow(
        'NOW_PAYMENT_NOTIFICATIONS_KEY',
      );

      const hmac = crypto.createHmac('sha512', notificationsKey);
      hmac.update(JSON.stringify(body, Object.keys(body).sort()));
      const signature = hmac.digest('hex');

      if (signature !== nowPaymentSignature) {
        Logger.error(
          `${endpointName} - Invalid signature. Calculated signature=${signature}. Expected signature=${nowPaymentSignature}`,
        );
        throw new ForbiddenException();
      }

      const { order_id, payment_id } = body;
      const payment = await this.paymentModel.findOne(
        {
          transactionId: order_id,
          paymentId: payment_id,
        },
        {},
        { session },
      );

      if (!payment) {
        Logger.error(
          `${endpointName} - Payment not found for order id ${order_id}, payment id ${payment_id}`,
        );
        throw new BadRequestException();
      }

      const response = {
        data: null,
        message: 'Webhook handled',
      };

      const transaction = await this.fundTransactionModel.findById(
        order_id,
        {},
        { session },
      );
      if (!transaction) {
        Logger.error(
          `${endpointName} - Transaction not found for order id ${order_id}`,
        );
        throw new BadRequestException();
      }

      const project = await this.projectModel.findById(transaction.project);
      if (!project) {
        Logger.error(
          `${endpointName} - Project not found for order id ${order_id}`,
        );
        throw new BadRequestException();
      }

      switch (body.payment_status) {
        case PaymentStatus.Waiting:
          return response;
        case PaymentStatus.Sending:
        case PaymentStatus.Finished:
        case PaymentStatus.Confirming:
          await this.paymentHistoryModel.create(
            [
              {
                payment: payment._id,
                status: body.payment_status,
                previousStatus: payment.status,
              },
            ],
            { session },
          );
          payment.status = body.payment_status;
          break;
        case PaymentStatus.Expired:
        case PaymentStatus.Failed:
        case PaymentStatus.PartiallyPaid:
        case PaymentStatus.Refunded:
          transaction.status = 'cancelled';
          payment.status = body.payment_status;
          project.progress = project.progress - transaction.amount;
          break;
        case PaymentStatus.Confirmed:
          transaction.status = 'approved';
          payment.status = body.payment_status;
          await this.portfolioItemModel.create(
            [
              {
                user: transaction.user,
                project: transaction.project,
                transaction: transaction._id,
                status: 'active',
              },
            ],
            { session },
          )[0];
          break;
        default:
          return response;
      }

      await payment.save(),
        await transaction.save(),
        await project.save(),
        await session.commitTransaction();

      return response;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }
}
