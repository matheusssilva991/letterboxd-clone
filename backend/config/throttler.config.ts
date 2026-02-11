/**
 * Configuração do Rate Limiting (Throttler)
 *
 * Implementa proteção contra abuso de API limitando o número
 * de requisições que um cliente pode fazer em um período de tempo
 *
 * Benefícios:
 * - Protege contra ataques DDoS
 * - Previne sobrecarga do servidor
 * - Garante uso justo dos recursos da API
 * - Melhora estabilidade e disponibilidade
 */

import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerAsyncOptions } from '@nestjs/throttler';

export const throttlerConfig: ThrottlerAsyncOptions = {
  imports: [ConfigModule],  // Importa ConfigModule para acessar variáveis de ambiente
  inject: [ConfigService],  // Injeta ConfigService na factory
  useFactory: (config: ConfigService) => [
    {
      // TTL (Time To Live): Janela de tempo em milissegundos
      ttl: config.get('THROTTLE_TTL', 60),
      // LIMIT: Número máximo de requisições permitidas na janela de tempo
      // Exemplo: 50 requisições a cada 60 segundos
      limit: config.get('THROTTLE_LIMIT', 50),
    },
  ],
};
