import {
  Inject,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import * as RedisStore from 'connect-redis';
import * as session from 'express-session';
import * as passport from 'passport';
import { RedisClient } from 'redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import * as path from 'path';
import { RedisModule } from './redis/redis.module';
import { REDIS } from './redis/redis.constants';
import { PrismaService } from './prisma.service';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  controllers: [AppController],
  providers: [AppService, Logger, PrismaService],
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    PostsModule,
    UsersModule,
    RedisModule,
  ],
})
export class AppModule implements NestModule {
  constructor(@Inject(REDIS) private readonly redis: RedisClient) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          store: new (RedisStore(session))({
            client: this.redis,
            logErrors: true,
          }),
          saveUninitialized: false,
          secret: 'secret',
          resave: false,
          cookie: {
            sameSite: 'lax',
            httpOnly: false,
            maxAge: 60000,
            secure: false,
            domain: 'localhost',
          },
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
