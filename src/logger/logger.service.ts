import { Logger } from 'winston';
import instanceLogger from '~/logger/wiston-config.logger';

import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private readonly logger: Logger;

  constructor() {
    this.logger = instanceLogger;
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(message, trace);
  }

  warn(message: string) {
    this.logger.warn(message);
  }
}
