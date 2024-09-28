import { ConfigModule, DatabaseModule, LoggerModule } from '@app/common';
import { redisStore } from 'cache-manager-redis-store';

import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';
import { FilesModule } from './files/files.module';
import { GoogleAuthModule } from './google-auth/google-auth.module';
import { LikesModule } from './likes/likes.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PostsModule } from './posts/posts.module';
import { SearchModule } from './search/search.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
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
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: Number(configService.get('REDIS_PORT'))
        }
      }),
      inject: [ConfigService]
    }),
    LoggerModule,
    AuthModule,
    GoogleAuthModule,
    EmailModule,
    FilesModule,
    SearchModule,
    UsersModule,
    PostsModule,
    LikesModule,
    BookmarksModule,
    NotificationsModule,
    ConfigModule
    // GatewayModule
  ],
  providers: [EmailService, Logger]
})
export class AppModule {}
