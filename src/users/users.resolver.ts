import { Query, Resolver } from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/guard/admin.guard';
import { LoggedInGuard } from 'src/guard/logged-in.guard';
import { PrismaService } from 'src/prisma.service';
import { UserModel } from './users.model';

@Resolver(() => UserModel)
export class UsersResolver {
  constructor(private readonly prismaService: PrismaService) {}

  // NOTE:ログイン済みのユーザーのみが実行できる
  @UseGuards(LoggedInGuard)
  @Query(() => [UserModel], { name: 'users', nullable: true })
  async getUsers() {
    return this.prismaService.user.findMany({
      where: {
        isAdmin: false,
      },
    });
  }

  // NOTE: Adminロールを持ったユーザーのみが実行できる
  @UseGuards(AdminGuard)
  @Query(() => [UserModel], { name: 'allUsers', nullable: true })
  async getAllUsers() {
    return this.prismaService.user.findMany();
  }
}
