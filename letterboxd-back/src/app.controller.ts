import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('Hello') // Define a rota em nível de controller
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('World') // Define a rota em nível de método
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('NestJS')
  getNestJS(): string {
    return 'NestJS!';
  }
}
