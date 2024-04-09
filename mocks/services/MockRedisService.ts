import { injectable } from "inversify";
import { RedisClient } from "redis";
import {IRedisService} from "../../src/services/RedisService";
import {currentUnixTimestamp} from "spg-common/compiled/src/apis/spg/util/currentUnixTimestamp";

interface IMockRedisItem {
  expiry: null | number;
  jsonItem: string;
}

@injectable()
export class MockRedisService implements IRedisService {
  public prefix: string = "";
  private localData = new Map<string, IMockRedisItem>();
  private localSetData = new Map<string, Set<string>>();

  public redisClient: RedisClient = null;

  public async getItem(key: string): Promise<any | null> {
    const localItem = this.localData.get(key);

    if (!localItem) {
      return null; // item does not exist
    }

    if (localItem.expiry && localItem.expiry <= currentUnixTimestamp()) {
      // item has expired, remove from local data
      this.localData.delete(key);
      return null;
    }

    return JSON.parse(localItem.jsonItem);
  }

  public async getItemTtl(key: string): Promise<number> {
    return 30;
  }

  public async setItem(key: string, value: any, ttl?: number): Promise<void> {
    const localItem: IMockRedisItem = {
      expiry: ttl ? currentUnixTimestamp() + ttl : null,
      jsonItem: JSON.stringify(value)
    };

    this.localData.set(key, localItem);
  }

  public async deleteItem(key: string): Promise<number> {
    this.localData.delete(key);
    return 1;
  }

  private ensureSetExists(key: string) {
    if (this.localSetData.has(key)) {
      return;
    }

    this.localSetData.set(key, new Set());
  }
  public async setAddItem(key: string, value: string): Promise<number> {
    this.ensureSetExists(key);

    this.localSetData.get(key).add(value);

    return 1;
  }

  public async setRemoveItem(key: string, value: string): Promise<number> {
    this.ensureSetExists(key);

    this.localSetData.get(key).delete(value);

    return 1;
  }

  public async setListItems(key: string): Promise<string[]> {
    this.ensureSetExists(key);

    console.log(`get ${key}`, this.localSetData.get(key));
    return [...this.localSetData.get(key)];
  }

  public async getKeysStartingWith(prefix: string): Promise<string[]> {
    return [];
  }

  public async purge(): Promise<string> {
    this.localData = new Map<string, IMockRedisItem>();
    return "";
  }

  public async evalLua(script: string, args: string[]): Promise<any> {
    throw new Error("Cannot execute evalLua under MockRedisService");
  }
}
