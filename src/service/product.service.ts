import { User } from './../schema/user.schema';
import {
  CreateProductInput,
  ProductModel,
  GetProductInput,
} from './../schema/product.schema';
import { Arg } from 'type-graphql';

class ProductService {
  async createProduct(input: CreateProductInput & { user: User['_id'] }) {
    return ProductModel.create(input);
  }

  async findProduct() {
    // TODO: pagination logic
    return ProductModel.find().lean();
  }

  async findSingleProduct(input: GetProductInput) {
    return ProductModel.findOne(input).lean();
  }
}

export default ProductService;
