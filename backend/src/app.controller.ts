import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller({ version: '1' })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello-world') // Define a rota em nível de método
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }

  @Get('nestjs')
  async getNestJS(): Promise<any> {
    return this.appService.getNestJS();
  }
}
