import { ProductService } from './product.service';
import { CreateProductInput } from './dto/create-product.input';
export declare class ProductResolver {
    private productService;
    constructor(productService: ProductService);
    createProduct(input: CreateProductInput): Promise<{
        name: string;
        price: number;
        id: string;
        createdAt: Date;
    }>;
    product(id: string): Promise<{} | null>;
}
