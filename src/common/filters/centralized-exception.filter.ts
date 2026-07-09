import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

interface IResponseData {
  status: number;
  error: string | null;
  errorResponse: string | null | string[] | any;
  timestamp: Date;
  path: string;
  method: string;
  // stackTrace: string | undefined | null;
  requestData: {
    body?: object | string;
    params?: object | string;
    query?: object | string;
  };
}

@Catch()
export class CentralizedExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const [status, error, errorResponse] =
      exception instanceof HttpException
        ? [exception.getStatus(), exception.message, exception.getResponse()]
        : [
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Internal Server Error',
            'Internal Server Error',
          ];

    // const stackTrace =
    //   exception instanceof HttpException ? exception.stack : null;

    const { url, method, body, params, query } = request;
    
    const responseData: IResponseData = {
      status,
      errorResponse,
      error,
      timestamp: new Date(),
      path: url,
      method,
      requestData: {
        body,
        params,
        query,
      },
      // stackTrace,
    };

    return response.status(status).json(responseData);
  }
}
