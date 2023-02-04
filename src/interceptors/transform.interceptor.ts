import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CustomResponse<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, CustomResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CustomResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const { message, ...rest } = data;
        const { data: nestedData, ...nestedRest } = rest;

        const response = {
          data: nestedData || rest || null,
          status: true,
          message: message || '',
          ...(nestedData && nestedRest),
        };

        return response;
      }),
    );
  }
}
