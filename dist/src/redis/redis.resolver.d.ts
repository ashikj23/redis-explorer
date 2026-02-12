import { RedisService } from './redis.service';
export declare class RedisResolver {
    private readonly redisService;
    constructor(redisService: RedisService);
    redisUpdated(): import("graphql-subscriptions/dist/pubsub-async-iterable-iterator").PubSubAsyncIterableIterator<unknown>;
    setRedis(key: string, value: string, ttl: number): Promise<string>;
    getRedis(key: string): Promise<string | null>;
    deleteRedis(key: string): Promise<boolean>;
    setRedisWithTTL(key: string, value: string, ttl: number): Promise<string>;
}
