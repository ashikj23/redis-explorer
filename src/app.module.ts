import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: true,
  subscriptions: {
    'graphql-ws': true,
    'subscriptions-transport-ws': true, // Add this for compatibility with Playground
  },
})

,

    RedisModule,
  ],
})
export class AppModule {}
