import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { FundController } from './fund.controller';
import { FundService } from './fund.service';

@Module({
  controllers: [FundController],
  providers: [FundService],
  imports: [UserModule],
})
export class FundModule {}
