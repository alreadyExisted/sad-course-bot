import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'

export interface CacheManager<T> {
  store: T
  get(key: string): Promise<T>
  set(key: string, value: T, options?: { ttl: number }): Promise<T>
}

@Injectable()
export class CacheService<T> {
  constructor(
    @Inject(CACHE_MANAGER)
    private cache: CacheManager<T>
  ) {}

  public get(key: string) {
    return this.cache.get(key)
  }

  public set(key: string, value: T, options?: { ttl: number }) {
    return this.cache.set(key, value, options)
  }
}
