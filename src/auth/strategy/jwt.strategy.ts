import { Model } from 'mongoose';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserDocument, UserType } from '../../user/schema/user.schema';
import { Funder, FunderDocument } from '../../user/schema/funder.schema';
import { ConfigService } from '@nestjs/config';
import { UserOption } from './requestWithUser';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Funder.name) private funderModel: Model<FunderDocument>,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: {
    email: string;
    type: UserType;
  }): Promise<UserOption> {
    const { type, email } = payload;
    const user = await this.userModel.findOne({ email, type });
    if (!user) {
      throw new ForbiddenException('Please sign in again');
    }

    if (type === 'admin') {
      return {
        ...user.toObject(),
      };
    } else if (type === 'funder') {
      const funder = await this.funderModel.findOne({
        user: user._id,
      });
      if (!funder) {
        throw new ForbiddenException('Not a funder');
      }
      return {
        ...user.toObject(),
        type: 'funder',
        funder: funder.toObject(),
      };
    }
  }
}
