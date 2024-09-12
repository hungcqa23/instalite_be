import { MyGateway } from 'src/gateway/gateway';

import { Module } from '@nestjs/common';

@Module({
  imports: [MyGateway]
})
export class GatewayModule {}
