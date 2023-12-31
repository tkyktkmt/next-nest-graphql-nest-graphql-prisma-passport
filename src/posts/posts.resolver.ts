import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostModel } from './posts.model';
import { PrismaService } from '../prisma.service';
import { CreatePostInput } from './create-post.input';

@Resolver(() => PostModel)
export class PostsResolver {
  constructor(private readonly prismaService: PrismaService) {}

  @Query(() => [PostModel], { name: 'posts', nullable: true })
  async getPosts() {
    return this.prismaService.post.findMany();
  }

  @Mutation(() => PostModel)
  async createPost(@Args('input') input: CreatePostInput) {
    return this.prismaService.post.create({
      data: {
        title: input.title,
      },
    });
  }
}
