import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import RoleGuard from '../auth/guard/role.guard';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('funders/summary')
  @UseGuards(RoleGuard('admin'))
  @UseGuards(JwtGuard)
  fetchAdminFundersPageSummary() {
    return this.adminService.fetchAdminFundersPageSummary();
  }

  @Get('funders/details')
  @UseGuards(RoleGuard('admin'))
  @UseGuards(JwtGuard)
  fetchAdminFundersPageDetails() {
    return this.adminService.fetchAdminFundersPageDetails();
  }
}
