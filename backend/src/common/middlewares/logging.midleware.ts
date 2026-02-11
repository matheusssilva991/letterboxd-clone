/**
 * Middleware de Logging de Requisições HTTP
 *
 * Registra informações sobre cada requisição processada pela aplicação:
 * - Método HTTP (GET, POST, PUT, DELETE, etc)
 * - URL acessada
 * - Status code da resposta
 * - Tempo de processamento em milissegundos
 *
 * Logs de sucesso (200, 201) são registrados como INFO
 * Outros status codes são registrados como ERROR para facilitar debugging
 */

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  logger = new Logger('Response'); // Logger com contexto "Response"

  /**
   * Método executado para cada requisição HTTP
   *
   * @param req - Objeto de requisição Express
   * @param res - Objeto de resposta Express
   * @param next - Função para passar controle ao próximo middleware
   */
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl: url } = req;
    const reqTime = new Date().getTime(); // Timestamp do início da requisição

    // Listener para o evento 'finish' - quando a resposta é enviada
    res.on('finish', () => {
      const { statusCode } = res;
      const resTime = new Date().getTime(); // Timestamp do fim da resposta
      const duration = resTime - reqTime;   // Tempo total de processamento

      // Log diferenciado baseado no status code
      if (statusCode === 201 || statusCode === 200) {
        // Sucesso - log como INFO
        this.logger.log(
          `${method} ${url} ${statusCode} ${duration} ms`,
        );
      } else {
        // Outros status codes - log como ERROR para facilitar identificação
        this.logger.error(
          `${method} ${url} ${statusCode} ${duration} ms`,
        );
      }
    });

    // Passa o controle para o próximo middleware/handler
    next();
  }
}
