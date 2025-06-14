import { PrismaClient, User } from '@prisma/client';
import { UserCreateInput, UserLoginInput } from './user.schema';
import bcrypt from 'bcrypt';
import { BadRequestError } from '@utils/errors';

export class UserService {
  private SALT_ROUNDS = 10;
  constructor(private prisma: PrismaClient) {}

  public async createUser(data: UserCreateInput): Promise<User> {
    const { name, email, password } = data;
    const hash = await bcrypt.hash(password, this.SALT_ROUNDS);
    return this.prisma.user.create({
      data: {
        name,
        email,
        password: hash,
      },
    });
  }

  public async login(data: UserLoginInput): Promise<User> {
    const { email, password } = data;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestError('Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new BadRequestError('Invalid email or password');
    }

    return user;
  }
}
