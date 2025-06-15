import { CategoryService } from './category.service';
import { CategoriesResSchema } from './category.schema';
import { FastifyReply, FastifyRequest } from 'fastify';

export default class CategoryController {
  constructor(private service: CategoryService) {}

  public getCategories = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const categories = await this.service.getCategories();
    const parsedCategories = CategoriesResSchema.parse(categories);
    reply.code(200).sendSuccess(parsedCategories);
  };
}
