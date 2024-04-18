import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from 'src/posts/post.schema';
import { PostsService } from './posts.service';
import { FilesModule } from 'src/files/files.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]), FilesModule, UsersModule],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
