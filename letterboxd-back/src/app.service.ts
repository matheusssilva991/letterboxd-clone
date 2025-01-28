import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getHello(): Promise<string> {
    return 'Hello World!';
  }

  async getNestJS(): Promise<any> {
    const cachedValue = await this.cacheManager.get('todos');
    console.log('Cache', cachedValue);
    if (cachedValue) {
      console.log('From Cache');
      return cachedValue;
    }

    const response = await axios
      .get('https://jsonplaceholder.typicode.com/todos')
      .then((res) => res.data);
    await this.cacheManager.set('todos', response);
    console.log('From API');
    return response;
  }
}
