import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

export default class FakeCacheProvider implements ICacheProvider {
  private cache: Map<string, string> = new Map();

  public async save(key: string, value: string): Promise<void> {
    this.cache.set(key, value);
  }

  public async recover(key: string): Promise<string | null> {
    const data = this.cache.get(key);

    return data || null;
  }

  public async invalidate(key: string): Promise<void> {
    this.cache.delete(key);
  }
}
