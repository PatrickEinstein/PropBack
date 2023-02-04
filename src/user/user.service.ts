import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { UserOption } from '../auth/strategy/requestWithUser';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateFunderDto } from './dto/create-funder.dto';
import { UpdateProfilePictureDto } from './dto/update-profile-picture.dto';
import { Funder, FunderDocument } from './schema/funder.schema';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Funder.name) private funderModel: Model<FunderDocument>,
  ) {}
  async createNewFunder(dto: CreateFunderDto) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const type = 'funder';
      let { email } = dto;
      email = email.toLowerCase();
      const { firstName, lastName, phoneNumber, password } = dto;
      const check = await this.userModel.findOne({ email, type });
      if (check) {
        throw new BadRequestException('Email exists already');
      }

      const user = await this.userModel.create(
        [
          {
            email,
            password,
            type,
          },
        ],
        { session },
      );

      await this.funderModel.create(
        [
          {
            firstName,
            lastName,
            phoneNumber,
            user: user[0]._id,
          },
        ],
        { session },
      );

      await session.commitTransaction();

      return {
        message: 'Funder signup completed successfully',
      };
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }

  async createAdminAccount(dto: CreateAdminDto) {
    const type = 'admin';
    let { email } = dto;
    email = email.toLowerCase();
    const { password } = dto;

    const check = await this.userModel.findOne({ email, type });
    if (check) {
      throw new BadRequestException('Email exists already');
    }

    await this.userModel.create({
      email,
      type,
      password,
    });

    return {
      message: 'Admin sign up completed successfully',
    };
  }

  async updateUserProfilePicture(
    user: UserOption,
    dto: UpdateProfilePictureDto,
  ) {
    let data: any;

    switch (user.type) {
      case 'funder':
        data = await this.funderModel.findByIdAndUpdate(user.funder._id, dto, {
          new: true,
        });
        break;
      default:
        data = null;
    }

    return {
      data,
      message: 'Profile picture updated successfully',
    };
  }
}
