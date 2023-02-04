import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import RoleGuard from '../auth/guard/role.guard';
import { UserOption } from '../auth/strategy/requestWithUser';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateFunderDto } from './dto/create-funder.dto';
import { UpdateProfilePictureDto } from './dto/update-profile-picture.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @HttpCode(HttpStatus.CREATED)
  @Post('funder')
  funderSignUp(@Body() dto: CreateFunderDto) {
    return this.userService.createNewFunder(dto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('admin')
  adminSignUp(@Body() dto: CreateAdminDto) {
    return this.userService.createAdminAccount(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Put('profile-picture')
  @UseGuards(RoleGuard('funder'))
  @UseGuards(JwtGuard)
  updateProfilePicture(
    @Body() dto: UpdateProfilePictureDto,
    @GetUser() user: UserOption,
  ) {
    return this.userService.updateUserProfilePicture(user, dto);
  }
}
