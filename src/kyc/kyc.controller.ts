import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import RoleGuard from '../auth/guard/role.guard';
import { UserOption } from '../auth/strategy/requestWithUser';
import { SubmitKycDataDto } from './dto/submit-kyc-data.dto';
import { KycService } from './kyc.service';

@Controller('kyc')
export class KycController {
  constructor(private kycService: KycService) {}

  @Post()
  @UseGuards(RoleGuard('funder'))
  @UseGuards(JwtGuard)
  async submitKycData(
    @GetUser() user: UserOption,
    @Body() dto: SubmitKycDataDto,
  ) {
    return this.kycService.submitKycData(dto, user);
  }
}
