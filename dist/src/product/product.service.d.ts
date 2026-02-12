import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateProductInput } from './dto/create-product.input';
export declare class ProductService {
    private prisma;
    private redis;
    constructor(prisma: PrismaService, redis: RedisService);
    create(input: CreateProductInput): Promise<{
        name: string;
        price: number;
        id: string;
        createdAt: Date;
    }>;
    findOne(id: string): Promise<{} | null>;
}
