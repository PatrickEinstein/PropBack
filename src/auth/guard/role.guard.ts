import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { UserType } from '../../user/schema/user.schema';
import { RequestWithUser } from '../strategy/requestWithUser';

function RoleGuard(...roles: UserType[]): Type<CanActivate> {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      return roles.includes(user.type);
    }
  }

  return mixin(RoleGuardMixin);
}

export default RoleGuard;
