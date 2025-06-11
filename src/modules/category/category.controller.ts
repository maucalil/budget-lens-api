import { FastifyReply, FastifyRequest } from 'fastify';
import { CategoryService } from './category.service';
import { GetCategoriesRes, GetCategoriesResSchema } from './category.schema';

export default class CategoryController {
  constructor(private service: CategoryService) {}

  async getCategories(
    _request: FastifyRequest,
    _reply: FastifyReply
  ): Promise<GetCategoriesRes> {
    const categories = await this.service.getCategories();
    return GetCategoriesResSchema.parse(categories);
  }
}
