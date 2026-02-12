import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisResolver } from './redis.resolver';
import { RedisService } from './redis.service';


@Global()
@Module({
  providers: [
  {
    provide: 'REDIS_CLIENT',
    useFactory: () => {
      return new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      });
    },
  },
  RedisService,
  RedisResolver,   
]})
export class RedisModule {} 