import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import configuration from 'src/shared/configs/configuration';

export interface Response<T> {
  data: T;
  metadata: Record<string, unknown>;
}
@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const metadata = {
          appName: configuration().name,
          version: configuration().version,
          timestamp: new Date(),
        };

        return {
          code: HttpStatus.OK,
          data: data,
          metadata: metadata,
        };
      }),
    );
  }
}
