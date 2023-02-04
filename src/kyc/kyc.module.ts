import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';

@Module({
  imports: [UserModule],
  controllers: [KycController],
  providers: [KycService],
})
export class KycModule {}
