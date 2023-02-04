import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserType } from '../user/schema/user.schema';
import { UserSigninDto } from './dto/user-signin.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserOption } from './strategy/requestWithUser';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async userSignIn(dto: UserSigninDto) {
    const { email, password, type } = dto;
    const user = await this.userModel
      .findOne({ email, type })
      .select('password email type');

    if (!user) {
      throw new BadRequestException('Invalid login credentials');
    }

    const check = await user.comparePassword(password);

    if (!check) {
      throw new BadRequestException('Invalid login credentials');
    }

    const token = this.signToken(email, user.type);

    return {
      token,
      message: 'User authenticated successfully',
    };
  }

  async getUser(user: UserOption) {
    return {
      ...user,
      message: 'User fetched successfully',
    };
  }

  private signToken(email: string, type: UserType) {
    const payload = { email, type };
    return this.jwt.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
