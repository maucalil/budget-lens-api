import { FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from './user.service';
import { UserCreateInput, UserLoginInput, UserLoginResSchema, UserResSchema } from './user.schema';

export class UserController {
  constructor(private service: UserService) {}

  public createUser = async (
    request: FastifyRequest<{ Body: UserCreateInput }>,
    reply: FastifyReply
  ): Promise<void> => {
    const user = await this.service.createUser(request.body);
    const parsedUser = UserResSchema.parse(user);
    reply.code(201).sendSuccess(parsedUser);
  };

  public login = async (request: FastifyRequest<{ Body: UserLoginInput }>, reply: FastifyReply): Promise<void> => {
    const user = await this.service.login(request.body);
    const token = await reply.jwtSign({ id: user.id });
    const parsedToken = UserLoginResSchema.parse({ token });
    reply.code(200).sendSuccess(parsedToken);
  };
}
