import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import RoleGuard from '../auth/guard/role.guard';
import { UserOption } from '../auth/strategy/requestWithUser';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('funding/report')
  @UseGuards(RoleGuard('admin'))
  @UseGuards(JwtGuard)
  fetchFundingReport(@GetUser() user: UserOption) {
    return this.dashboardService.getFundingReport(user);
  }

  @Get('projects/top')
  fetchTopProjects() {
    return this.dashboardService.getTopProjects();
  }
}
