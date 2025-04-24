import NodeCache from 'node-cache';
import { Logger } from '../config/logger';

interface CacheOptions {
  ttl?: number;          // time to live in seconds
  checkPeriod?: number;  // seconds between check for expired keys
}

class CacheManager {
  private cache: NodeCache;
  private defaultTTL: number;

  constructor(options: CacheOptions = {}) {
    const ttl = options.ttl || 60; // default 60 seconds
    const checkPeriod = options.checkPeriod || 120; // default 120 seconds
    
    this.defaultTTL = ttl;
    this.cache = new NodeCache({
      stdTTL: ttl,
      checkperiod: checkPeriod,
      useClones: false, // For better performance
    });

    // Log cache stats periodically
    setInterval(() => {
      const stats = this.getStats();
      Logger.debug(`Cache stats: ${JSON.stringify(stats)}`);
    }, 300000); // Every 5 minutes
  }

  /**
   * Set a value in the cache
   * @param key Cache key
   * @param value Value to cache
   * @param ttl Optional custom TTL in seconds
   * @returns Success boolean
   */
  public set<T>(key: string, value: T, ttl: number = this.defaultTTL): boolean {
    try {
      return this.cache.set(key, value, ttl);
    } catch (error) {
      // Handle error without passing it to Logger.error
      Logger.error(`Error setting cache key ${key}`);
      return false;
    }
  }

  /**
   * Get a value from the cache
   * @param key Cache key
   * @returns The cached value or undefined if not found
   */
  public get<T>(key: string): T | undefined {
    try {
      return this.cache.get<T>(key);
    } catch (error) {
      // Handle error without passing it to Logger.error
      Logger.error(`Error getting cache key ${key}`);
      return undefined;
    }
  }

  /**
   * Get a value from cache or compute it if not present
   * @param key Cache key
   * @param producer Function to produce the value if not in cache
   * @param ttl Optional custom TTL in seconds
   * @returns The cached or computed value
   */
  public async getOrSet<T>(
    key: string, 
    producer: () => Promise<T>, 
    ttl: number = this.defaultTTL
  ): Promise<T> {
    const cachedValue = this.get<T>(key);
    
    if (cachedValue !== undefined) {
      return cachedValue;
    }
    
    const value = await producer();
    this.set(key, value, ttl);
    return value;
  }

  /**
   * Remove a specific key from the cache
   * @param key Cache key to remove
   * @returns True if the key was deleted, false otherwise
   */
  public delete(key: string): boolean {
    return this.cache.del(key) > 0;
  }

  /**
   * Remove multiple keys from the cache
   * @param keys Array of cache keys to remove
   */
  public deleteMany(keys: string[]): void {
    this.cache.del(keys);
  }

  /**
   * Remove all keys with a specific prefix
   * @param prefix Key prefix to match
   * @returns Number of keys deleted
   */
  public deleteByPrefix(prefix: string): number {
    const keys = this.cache.keys().filter(key => key.startsWith(prefix));
    return this.cache.del(keys);
  }

  /**
   * Clear the entire cache
   */
  public clear(): void {
    this.cache.flushAll();
  }

  /**
   * Get cache statistics
   */
  public getStats() {
    return {
      keys: this.cache.keys().length,
      hits: this.cache.getStats().hits,
      misses: this.cache.getStats().misses,
      ksize: this.cache.getStats().ksize,
      vsize: this.cache.getStats().vsize,
    };
  }
}

// Export a singleton instance with default options
export const cacheManager = new CacheManager();

// Export the class for custom instances
export default CacheManager; 