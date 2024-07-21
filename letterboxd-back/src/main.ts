// Arquivo principal da aplicação
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT || 3000; // Pega a porta do ambiente ou usa a porta 3000
  const app = await NestFactory.create(AppModule); // Cria a aplicação NestJS
  app.useGlobalPipes(new ValidationPipe({ transform: false })); // Adiciona o pipe de validação global
  await app.listen(port); // Inicia a aplicação na porta 3000
}
bootstrap();
