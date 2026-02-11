/**
 * Configuração do TypeORM para conexão com banco de dados MySQL
 *
 * Esta configuração é carregada assincronamente usando o ConfigService
 * para acessar as variáveis de ambiente de forma segura
 *
 * Configurações importantes:
 * - autoLoadEntities: Carrega automaticamente todas as entidades registradas
 * - synchronize: Sincroniza automaticamente o schema (apenas em desenvolvimento!)
 */

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule], // Importa ConfigModule para acessar variáveis de ambiente
  inject: [ConfigService], // Injeta ConfigService na factory function
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',                                          // Tipo do banco de dados
    host: configService.get('MYSQL_HOST'),                  // Host do MySQL (ex: localhost)
    port: configService.get('MYSQL_PORT'),                  // Porta do MySQL (padrão: 3306)
    username: configService.get('MYSQL_USERNAME'),          // Usuário do banco
    password: configService.get('MYSQL_PASSWORD'),          // Senha do banco
    database: configService.get('MYSQL_DATABASE'),          // Nome do banco de dados
    autoLoadEntities: true,                                 // Carrega automaticamente as entidades
    synchronize: true,                                      // ATENÇÃO: Usar apenas em dev! Sincroniza schema automaticamente
    // Em produção, use: synchronize: false e rode migrations manualmente
  }),
};
