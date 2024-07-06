import { Module } from '@nestjs/common';
import { MyGateway } from 'src/gateway/gateway';

@Module({
  imports: [MyGateway]
})
export class GatewayModule {}
