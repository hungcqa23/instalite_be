import { Module } from '@nestjs/common';

import { MyGateway } from './gateway';

@Module({
  imports: [MyGateway]
})
export class GatewayModule {}
