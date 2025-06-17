import { FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from './user.service';
import { UserCreateInput, UserLoginInput, UserResSchema } from './user.schema';

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
    reply.setCookie('token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'prod',
      expires: new Date(Date.now() + 60 * 60 * 1000),
    });
    reply.code(200).send();
  };

  public logout = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    reply.clearCookie('token', {
      path: '/',
      secure: process.env.NODE_ENV === 'prod',
    });
    reply.code(200).send();
  };
}
