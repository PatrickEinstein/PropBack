import { Module } from '@nestjs/common';
import { NowPaymentService } from '../nowpayment/nowpayment.service';
import { UserModule } from '../user/user.module';
import { FundController } from './fund.controller';
import { FundService } from './fund.service';

@Module({
  controllers: [FundController],
  providers: [FundService, NowPaymentService],
  imports: [UserModule],
})
export class FundModule {}
