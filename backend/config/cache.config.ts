/**
 * Configuração do sistema de Cache com Redis
 *
 * Utiliza o Redis como store de cache para melhorar a performance
 * armazenando em memória resultados de queries frequentes
 *
 * Benefícios:
 * - Reduz carga no banco de dados
 * - Melhora tempo de resposta das requisições
 * - Cache distribuído (pode ser compartilhado entre instâncias)
 */

import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

export const cacheConfig: CacheModuleAsyncOptions = {
  imports: [ConfigModule],  // Importa ConfigModule para acessar variáveis de ambiente
  inject: [ConfigService],  // Injeta ConfigService na factory
  useFactory: (configService: ConfigService) => ({
    store: redisStore,                                      // Usa Redis como store de cache
    host: configService.get('REDIS_HOST', 'redis'),        // Host do Redis
    port: configService.get('REDIS_PORT', 6379),           // Porta do Redis (padrão: 6379)
    ttl: configService.get('CACHE_TTL', 10),               // Time To Live - tempo de expiração do cache em segundos
    max: configService.get('CACHE_MAX', 100),              // Número máximo de itens no cache
  }),
  isGlobal: true,  // Torna o cache disponível globalmente em toda a aplicação
};
