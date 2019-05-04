import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    const errResponse = {
      code: status,
      message: exception.message.error || exception.message || null,
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
      method: request.method,
    };

    Logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(errResponse),
      'ExceptionFilter',
    );

    response.status(404).json(errResponse);
  }
}
