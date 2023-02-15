import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  controllers: [PaymentController],
  imports: [UserModule],
  providers: [PaymentService],
})
export class PaymentModule {}
