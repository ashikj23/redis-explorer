import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateProductInput } from './dto/create-product.input';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async create(input: CreateProductInput) {
    const product = await this.prisma.product.create({
      data: input,
    });

    return product;
  }

  async findOne(id: string) {
    const cacheKey = `product:${id}`;

    // 1️⃣ Check Redis
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      console.log('⚡ Returning from Redis');
      return cached;
    }

    console.log('📦 Fetching from Database');

    // 2️⃣ Fetch from DB
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    // 3️⃣ Store in Redis (TTL 60 sec)
    if (product) {
      await this.redis.set(cacheKey, product, 60);
    }

    return product;
  }
}
