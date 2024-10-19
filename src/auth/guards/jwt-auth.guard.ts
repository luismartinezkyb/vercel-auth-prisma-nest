import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // canActivate(
  //   context: ExecutionContext,
  // ): boolean | Promise<boolean> | Observable<boolean> {
  //   //TODO: Para roles a futuro (SET METADATA)
  //   // const validRoles: string[] = this.reflector.get(
  //   //   'roles',
  //   //   context.getHandler(),
  //   // );
  //   // for (const role of user.roles) {
  //   //   if (validRoles.includes(role)) return true;
  //   // }
  //   const req = context.switchToHttp().getRequest();
  //   req.user =
  //   if (!user) throw new BadRequestException('NOT_USER');
  //   return true;
  // }
}
