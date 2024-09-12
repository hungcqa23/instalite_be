import { MyGateway } from '~/gateway/gateway';

import { Module } from '@nestjs/common';

@Module({
  imports: [MyGateway]
})
export class GatewayModule {}
