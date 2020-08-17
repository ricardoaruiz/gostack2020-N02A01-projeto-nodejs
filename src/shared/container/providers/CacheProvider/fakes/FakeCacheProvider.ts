import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

export default class FakeCacheProvider implements ICacheProvider {
  private cache: Map<string, string> = new Map();

  public async save(key: string, value: string): Promise<void> {
    this.cache.set(key, value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = this.cache.get(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data) as T;
  }

  public async invalidate(key: string): Promise<void> {
    this.cache.delete(key);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    Object.keys(this.cache).forEach(key => {
      if (key.includes(prefix)) {
        this.cache.delete(key);
      }
    });
  }
}
