import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { UserModule } from '../user/user.module';

@Module({
  providers: [DashboardService],
  controllers: [DashboardController],
  imports: [UserModule],
})
export class DashboardModule {}
