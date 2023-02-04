import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser } from './decorator/get-user.decorator';
import { UserSigninDto } from './dto/user-signin.dto';
import { JwtGuard } from './guard/jwt.guard';
import { UserOption } from './strategy/requestWithUser';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  userAuthentication(@Body() dto: UserSigninDto) {
    return this.authService.userSignIn(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('me')
  @UseGuards(JwtGuard)
  async getUser(@GetUser() user: UserOption) {
    return this.authService.getUser(user);
  }
}
