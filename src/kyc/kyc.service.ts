import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserOption } from '../auth/strategy/requestWithUser';
import { BaseService } from '../common/BaseService';
import { SubmitKycDataDto } from './dto/submit-kyc-data.dto';
import { Kyc, KycDocument } from './schema/kyc.schema';

@Injectable()
export class KycService extends BaseService {
  constructor(@InjectModel(Kyc.name) private kycModel: Model<KycDocument>) {
    super();
  }

  async submitKycData(dto: SubmitKycDataDto, user: UserOption) {
    if (user.type !== 'funder') {
      throw new ForbiddenException('Not a funder');
    }

    await this.kycModel.create({ ...dto, funder: user.funder._id });

    return {
      message: 'Kyc data uploaded successfully',
    };
  }
}
