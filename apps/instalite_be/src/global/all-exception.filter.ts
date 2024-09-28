import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: Logger
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Log the error
    this.logger.error(
      `Exception: ${exception instanceof Error ? exception.message : 'Unknown error'}`,
      exception instanceof Error ? exception.stack : undefined
    );

    // Let the default exception handler handle the response
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      // Ensure the response is an object
      const responseBody =
        typeof exceptionResponse === 'string'
          ? { message: exceptionResponse, statusCode: httpStatus }
          : {
              ...exceptionResponse,
              statusCode: httpStatus
            };

      return httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }

    // For non-HttpExceptions, return a generic error response
    const responseBody = {
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      statusCode: httpStatus
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
