import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    UserModule,
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          url:
            configService.get<string>('REDIS_URL') ||
            `redis://${configService.get<string>('REDIS_HOST', 'redis')}:${configService.get<number>('REDIS_PORT', 6379)}`,
        },
      }),
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
      global: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule], // Injeta o ConfigModule
      useFactory: (configService: ConfigService) => {
        const expiresIn = (configService.get<string>('EXPIRES_IN') || '1d') as StringValue;
        return {
          secret: configService.get<string>('SECRET_KEY'), // Usa a secret key do .env
          signOptions: {
            expiresIn, // Usa o tempo de expiração do .env
          },
        };
      },
      inject: [ConfigService], // Injeta o ConfigService
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
