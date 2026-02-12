import { Test, TestingModule } from '@nestjs/testing';
import { RedisResolver } from './redis.resolver';
import { RedisService } from './redis.service';
import { pubSub } from './redis.service';

describe('RedisResolver', () => {
  let resolver: RedisResolver;
  let redisService: jest.Mocked<RedisService>;

  const mockRedisService = {
    setWithExpiry: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisResolver,
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    resolver = module.get<RedisResolver>(RedisResolver);
    redisService = module.get(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  
  // ==============================
  // ✅ setRedis
  // ==============================
  it('should set key with expiry', async () => {
    mockRedisService.setWithExpiry.mockResolvedValue(undefined);

    const result = await resolver.setRedis('testKey', 'value', 10);

    expect(redisService.setWithExpiry).toHaveBeenCalledWith(
      'testKey',
      'value',
      10,
    );
    expect(result).toBe('Key set with 10s expiry');
  });

  // ==============================
  // ✅ getRedis
  // ==============================
  it('should return value for key', async () => {
    mockRedisService.get.mockResolvedValue('hello');

    const result = await resolver.getRedis('testKey');

    expect(redisService.get).toHaveBeenCalledWith('testKey');
    expect(result).toBe('hello');
  });

  it('should return null if key not found', async () => {
    mockRedisService.get.mockResolvedValue(null);

    const result = await resolver.getRedis('missing');

    expect(result).toBeNull();
  });

  // ==============================
  // ✅ deleteRedis
  // ==============================
  it('should delete key', async () => {
    mockRedisService.delete.mockResolvedValue(true);

    const result = await resolver.deleteRedis('testKey');

    expect(redisService.delete).toHaveBeenCalledWith('testKey');
    expect(result).toBe(true);
  });

  it('should set key with custom TTL', async () => {
    mockRedisService.set.mockResolvedValue(undefined);

    const result = await resolver.setRedisWithTTL(
      'ttlKey',
      'value',
      30,
    );

    expect(redisService.set).toHaveBeenCalledWith(
      'ttlKey',
      'value',
      30,
    );
    expect(result).toBe('Stored with TTL 30 seconds');
  });

  it('should return async iterator for redisUpdated subscription', () => {
    const iterator = resolver.redisUpdated();

    expect(iterator).toBeDefined();
    expect(typeof iterator.next).toBe('function');
  });
});
