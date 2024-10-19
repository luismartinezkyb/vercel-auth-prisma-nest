import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const jwt_token = request.headers.authorization?.split(' ')[1];
    const token = jwt_token ? jwt_token : '';
    const statusCode = context.switchToHttp().getResponse().statusCode;
    return next.handle().pipe(map((data) => ({ statusCode, data, token })));
  }
}
