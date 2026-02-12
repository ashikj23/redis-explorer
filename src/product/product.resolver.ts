import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Mutation(() => Product)
  createProduct(
    @Args('input') input: CreateProductInput,
  ) {
    return this.productService.create(input);
  }

  @Query(() => Product, { nullable: true })
  product(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.productService.findOne(id);
  }
}
