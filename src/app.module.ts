import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { LikesModule } from './likes/likes.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { GoogleAuthModule } from './google-auth/google-auth.module';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { FilesModule } from './files/files.module';
import { SearchModule } from './search/search.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as Joi from 'joi';
import { redisStore } from 'cache-manager-redis-store';
// import { GraphQLModule } from '@nestjs/graphql';
// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        DB_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_BUCKET_NAME: Joi.string().required(),
        SES_FROM_ADDRESS: Joi.string().required(),
        PORT: Joi.number().required(),
        UPLOAD_DIR: Joi.string().required(),
        REDIS_URI: Joi.string().required(),
        CACHE_TTL: Joi.number().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required()
      })
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      imports: [ConfigModule],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          ttl: configService.get<number>('CACHE_TTL'),
          socket: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT')
          },
          url: configService.get<string>('REDIS_URI')
        })
      })
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI')
      })
    }),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   playground: true,
    //   autoSchemaFile: true
    // }),
    AuthModule,
    GoogleAuthModule,
    EmailModule,
    FilesModule,
    SearchModule,
    UsersModule,
    PostsModule,
    LikesModule,
    BookmarksModule,
    NotificationsModule
  ],
  providers: [EmailService]
})
export class AppModule {}
