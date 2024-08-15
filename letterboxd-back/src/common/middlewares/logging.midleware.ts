import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  logger = new Logger('Response');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl: url } = req;
    const reqTime = new Date().getTime();

    res.on('finish', () => {
      const { statusCode } = res;
      const resTime = new Date().getTime();

      if (statusCode === 201 || statusCode === 200) {
        this.logger.log(
          `${method} ${url} ${statusCode} ${resTime - reqTime} ms`,
        );
      } else {
        this.logger.error(
          `${method} ${url} ${statusCode} ${resTime - reqTime} ms`,
        );
      }
    });
    next();
  }
}
