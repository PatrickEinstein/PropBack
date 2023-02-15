import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as axios from 'axios';
import { Model } from 'mongoose';
import { FunderUser } from '../auth/strategy/requestWithUser';
import { User, UserDocument } from '../user/schema/user.schema';
import { Payment, PaymentDocument } from './schema/payment.schema';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private config: ConfigService,
  ) {}
  async webhookHandler() {}
}
