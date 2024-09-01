import { Post } from 'src/posts/post.schema';

import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class PostSearchService {
  private index = 'posts';
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async searchPosts(post: Post) {
    // return this.elasticsearchService.index<Post>({
    //   index: this.index,
    //   body: {
    //     id: post.id
    //   }
    // });
  }
}
