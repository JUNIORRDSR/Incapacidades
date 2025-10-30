const { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } = require('@nestjs/common');
const { decorateClass } = require('../utils/apply-decorators');

/**
 * Global HTTP Exception Filter
 * Handles all exceptions and formats error responses
 * @class HttpExceptionFilter
 * @implements {ExceptionFilter}
 */
class HttpExceptionFilter {
  catch(exception, host) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Error interno del servidor';

    const errorResponse = {
      success: false,
      error: {
        statusCode: status,
        message: typeof message === 'string' ? message : message.message || message,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    };

    // Log error for debugging
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error('❌ Internal Server Error:', exception);
    }

    response.status(status).json(errorResponse);
  }
}

decorateClass(HttpExceptionFilter, [Catch()]);

module.exports = { HttpExceptionFilter };
