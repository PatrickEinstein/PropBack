import { Request } from 'express';
import { LeanDocument } from 'mongoose';

import { FunderDocument } from '../../user/schema/funder.schema';
import { UserDocument } from '../../user/schema/user.schema';

export interface AdminUser extends LeanDocument<UserDocument> {
  type: 'admin';
}

export interface FunderUser extends LeanDocument<UserDocument> {
  type: 'funder';
  funder: LeanDocument<FunderDocument>;
}

export type UserOption = AdminUser | FunderUser;

export interface RequestWithUser extends Request {
  user: UserOption;
}
