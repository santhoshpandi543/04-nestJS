import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Logger,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, Observable, tap, timeout, TimeoutError } from 'rxjs';
import { v4 as uuid } from 'uuid';

export class TracingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    const trace_id = uuid();
    request['trace_id'] = trace_id;

    const startTime = Date.now();
    const { method, url } = request;

    const logData = {
      trace_id,
      method,
      url,
    };

    return next.handle().pipe(
      timeout(15000),

      tap(async () => {
        const duration = Date.now() - startTime;
        const statusCode = response.statusCode;
        const logType = 'SUCCESS';

        Logger.log({
          ...logData,
          duration,
          statusCode,
          logType,
        });
      }),

      catchError((err) => {
        const duration = Date.now() - startTime;
        const statusCode = err.response.statusCode;
        const logType = 'ERROR';

        const errData = {
          trace_id,
          duration,
          logType,
          err,
        };

        Logger.error(errData);

        if (err instanceof TimeoutError) {
          throw new RequestTimeoutException(errData);
        }

        throw new HttpException(errData, statusCode);
      }),
    );
  }
}
