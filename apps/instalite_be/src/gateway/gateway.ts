import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway
} from '@nestjs/websockets';

@WebSocketGateway(80)
export class MyGateway {
  @SubscribeMessage('new-message')
  onNewMessage(
    @MessageBody()
    body: any
  ) {
    console.log(body);
    console.log('Hello World!');
  }

  @SubscribeMessage('like-post')
  likePost(
    @MessageBody()
    body: any
  ) {
    console.log(body);
    console.log('Hello World!');
  }
}
