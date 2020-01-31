import { CacheModule as NestCacheModule, Global, Module } from '@nestjs/common'
import { CacheService } from './cache.service'

@Global()
@Module({
  imports: [NestCacheModule.register()],
  providers: [CacheService],
  exports: [CacheService]
})
export class CacheModule {}
