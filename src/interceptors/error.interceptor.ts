import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        const { response } = err;
        console.log(err);
        throw new HttpException(
          {
            status: false,
            message: 'something went wrong',
            ...response,
          },
          response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }
}
