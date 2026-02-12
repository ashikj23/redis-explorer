import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { RedisService, pubSub } from './redis.service'; // 3. IMPORT, DON'T RE-DECLARE

@Resolver()
export class RedisResolver {
  constructor(private readonly redisService: RedisService) {}

  @Subscription(() => String, {
     resolve: (payload) => payload.redisUpdated,
  })
  redisUpdated() {
    return pubSub.asyncIterableIterator('redisUpdated');
  }

  @Mutation(() => String)
  async setRedis(
    @Args('key') key: string,
    @Args('value') value: string,
    @Args('ttl', { defaultValue: 10 }) ttl: number,
  ): Promise<string> {
    await this.redisService.setWithExpiry(key, value, ttl);
    return `Key set with ${ttl}s expiry`;
  } 
  @Query(() => String, { nullable: true })
  async getRedis(
    @Args('key') key: string,
  ): Promise<string | null> {
    return this.redisService.get<string>(key);
}
    @Mutation(() => Boolean)
    async deleteRedis(
    @Args('key') key: string,
        ): Promise<boolean> {
      return this.redisService.delete(key);
} 
    @Mutation(() => String) 
    async setRedisWithTTL(
    @Args('key') key: string,
    @Args('value') value: string,
      @Args('ttl') ttl: number,
    ): Promise<string> {
  await this.redisService.set(key, value, ttl);
  return `Stored with TTL ${ttl} seconds`;
    }
} 

