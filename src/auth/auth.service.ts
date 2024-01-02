import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { LoginUserInput } from './login-user.input';
import { RegisterUserInput } from './register-user.input';
import { User } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async validateUser(user: LoginUserInput) {
    const foundUser = await this.prismaService.user.findUnique({
      where: {
        email: user.email,
      },
    });
    const { password, ...retUser } = foundUser;

    if (!user || !(await compare(user.password, password))) {
      throw new UnauthorizedException('Incorrect username or password');
    }
    return retUser;
  }

  async registerUser(user: RegisterUserInput): Promise<Omit<User, 'password'>> {
    const { confirmationPassword, password, email } = user;

    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      throw new BadRequestException('User remail must be unique');
    }

    if (password !== confirmationPassword) {
      throw new BadRequestException(
        'Password and Confirmation Password must match',
      );
    }

    const u = await this.prismaService.user.create({
      data: {
        email: email,
        password: await hash(password, 12),
        isAdmin: false,
      },
    });

    return {
      id: u.id,
      email: u.email,
      isAdmin: u.isAdmin,
    };
  }

  async findById(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new BadRequestException(`No user found with id ${id}`);
    }
    return {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  }
}
