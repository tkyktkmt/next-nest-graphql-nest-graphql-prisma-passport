import { Module } from '@nestjs/common';
import { createClient } from 'redis';

import { REDIS } from './redis.constants';

@Module({
  providers: [
    {
      provide: REDIS,
      useValue: createClient({ port: 16379, host: 'localhost' }),
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
