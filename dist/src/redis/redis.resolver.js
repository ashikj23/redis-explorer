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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const redis_service_1 = require("./redis.service");
let RedisResolver = class RedisResolver {
    redisService;
    constructor(redisService) {
        this.redisService = redisService;
    }
    redisUpdated() {
        return redis_service_1.pubSub.asyncIterableIterator('redisUpdated');
    }
    async setRedis(key, value, ttl) {
        await this.redisService.setWithExpiry(key, value, ttl);
        return `Key set with ${ttl}s expiry`;
    }
    async getRedis(key) {
        return this.redisService.get(key);
    }
    async deleteRedis(key) {
        return this.redisService.delete(key);
    }
    async setRedisWithTTL(key, value, ttl) {
        await this.redisService.set(key, value, ttl);
        return `Stored with TTL ${ttl} seconds`;
    }
};
exports.RedisResolver = RedisResolver;
__decorate([
    (0, graphql_1.Subscription)(() => String, {
        resolve: (payload) => payload.redisUpdated,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RedisResolver.prototype, "redisUpdated", null);
__decorate([
    (0, graphql_1.Mutation)(() => String),
    __param(0, (0, graphql_1.Args)('key')),
    __param(1, (0, graphql_1.Args)('value')),
    __param(2, (0, graphql_1.Args)('ttl', { defaultValue: 10 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], RedisResolver.prototype, "setRedis", null);
__decorate([
    (0, graphql_1.Query)(() => String, { nullable: true }),
    __param(0, (0, graphql_1.Args)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RedisResolver.prototype, "getRedis", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RedisResolver.prototype, "deleteRedis", null);
__decorate([
    (0, graphql_1.Mutation)(() => String),
    __param(0, (0, graphql_1.Args)('key')),
    __param(1, (0, graphql_1.Args)('value')),
    __param(2, (0, graphql_1.Args)('ttl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], RedisResolver.prototype, "setRedisWithTTL", null);
exports.RedisResolver = RedisResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], RedisResolver);
//# sourceMappingURL=redis.resolver.js.map