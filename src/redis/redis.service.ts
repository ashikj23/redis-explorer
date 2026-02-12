import { Inject, Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { PubSub } from 'graphql-subscriptions';

// 1. Shared PubSub instance for the whole module
export const pubSub = new PubSub();

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private subClient: Redis;

  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {
    // 2. Duplicate the client for subscribing (Pub/Sub blocks regular commands)
    this.subClient = this.redis.duplicate(); 
  }

  async onModuleInit() {
    // 3. Configure Redis to emit 'Expired' keyspace events
    await this.redis.config('SET', 'notify-keyspace-events', 'Ex');

    // 4. Pattern subscribe to expiry events on all databases
    await this.subClient.psubscribe('__keyevent@*__:expired');

    // 5. Listen for 'pmessage' (required when using psubscribe)
   this.subClient.on('pmessage', (pattern, channel, key) => {
  console.log(`TTL Expired for key: ${key}`);
  pubSub.publish('redisUpdated', {
    redisUpdated: `Expired: ${key}`
  });
});
  }

  /** Set key with optional TTL (seconds) */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const data = JSON.stringify(value);
    if (ttl && ttl > 0) {
      await this.redis.set(key, data, 'EX', ttl);
    } else {
      await this.redis.set(key, data);
    }
  }

  /** Explicit set with TTL for the Resolver */
  async setWithExpiry<T>(key: string, value: T, ttl: number): Promise<void> {
    await this.set(key, value, ttl);
  }

  /** Get and parse data */
  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T; // Return as-is if not JSON
    }
  }

  async delete(key: string): Promise<boolean> {
    const result = await this.redis.del(key);
    return result > 0;
  }
  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  async onModuleDestroy() {
    await this.subClient.quit();
    await this.redis.quit();
  }
}
