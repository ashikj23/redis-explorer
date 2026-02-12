"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = exports.pubSub = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
const graphql_subscriptions_1 = require("graphql-subscriptions");
exports.pubSub = new graphql_subscriptions_1.PubSub();
let RedisService = class RedisService {
    redis;
    subClient;
    constructor(redis) {
        this.redis = redis;
        this.subClient = this.redis.duplicate();
    }
    async onModuleInit() {
        await this.redis.config('SET', 'notify-keyspace-events', 'Ex');
        await this.subClient.psubscribe('__keyevent@*__:expired');
        this.subClient.on('pmessage', (pattern, channel, key) => {
            console.log(`TTL Expired for key: ${key}`);
            exports.pubSub.publish('redisUpdated', {
                redisUpdated: `Expired: ${key}`
            });
        });
    }
    async set(key, value, ttl) {
        const data = JSON.stringify(value);
        if (ttl && ttl > 0) {
            await this.redis.set(key, data, 'EX', ttl);
        }
        else {
            await this.redis.set(key, data);
        }
    }
    async setWithExpiry(key, value, ttl) {
        await this.set(key, value, ttl);
    }
    async get(key) {
        const data = await this.redis.get(key);
        if (!data)
            return null;
        try {
            return JSON.parse(data);
        }
        catch {
            return data;
        }
    }
    async delete(key) {
        const result = await this.redis.del(key);
        return result > 0;
    }
    async exists(key) {
        const result = await this.redis.exists(key);
        return result === 1;
    }
    async onModuleDestroy() {
        await this.subClient.quit();
        await this.redis.quit();
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [ioredis_1.default])
], RedisService);
//# sourceMappingURL=redis.service.js.map