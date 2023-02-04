import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import RoleGuard from '../auth/guard/role.guard';
import { UserOption } from '../auth/strategy/requestWithUser';
import { FetchFundingHistoryDto } from './dto/fetch-funding-history.dto';
import { FetchFundingDto } from './dto/fetch-funding.dto';
import { FetchPortfolioDto } from './dto/fetch-portfolio.dto';
import { FundProjectDto } from './dto/fund-project.dto';
import { FundService } from './fund.service';

@Controller('fund')
export class FundController {
  constructor(private fundService: FundService) {}
  @Get('portfolio')
  @UseGuards(RoleGuard('funder'))
  @UseGuards(JwtGuard)
  fetchFunderPortfolio(
    @Query() dto: FetchPortfolioDto,
    @GetUser() user: UserOption,
  ) {
    return this.fundService.fetchFunderPortfolio(user, dto);
  }

  @Get('history')
  fetchFundingHistory(@Query() dto: FetchFundingHistoryDto) {
    return this.fundService.fetchFundingHistory(dto);
  }

  @Get(':projectId/history')
  @UseGuards(RoleGuard('funder'))
  @UseGuards(JwtGuard)
  fetchProjectHistory(
    @Query() dto: FetchFundingDto,
    @Param('projectId') projectId: string,
  ) {
    return this.fundService.fetchProjectFunding(projectId, dto);
  }

  @Post(':projectId')
  @UseGuards(RoleGuard('funder'))
  @UseGuards(JwtGuard)
  fundProject(
    @GetUser() user: UserOption,
    @Body() dto: FundProjectDto,
    @Param('projectId') projectId: string,
  ) {
    return this.fundService.funderFundProject(dto, user, projectId);
  }
}
