import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { PubSub } from 'graphql-subscriptions';
export declare const pubSub: PubSub<Record<string, never>>;
export declare class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly redis;
    private subClient;
    constructor(redis: Redis);
    onModuleInit(): Promise<void>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    setWithExpiry<T>(key: string, value: T, ttl: number): Promise<void>;
    get<T>(key: string): Promise<T | null>;
    delete(key: string): Promise<boolean>;
    exists(key: string): Promise<boolean>;
    onModuleDestroy(): Promise<void>;
}
