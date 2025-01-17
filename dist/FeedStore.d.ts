/// <reference types="node" />
import { Readable, Writable } from 'stream';
import { KeyPair } from './Keys';
import { Feed } from './hypercore';
import { BaseId, DiscoveryId } from './Misc';
export declare type Feed = Feed<Block>;
export declare type FeedId = BaseId & {
    feedId: true;
};
export declare type Block = Uint8Array;
export interface ReplicateOptions {
    stream(): void;
}
interface FeedStorageFn {
    (feedId: FeedId): (filename: string) => unknown;
}
/**
 * Note:
 * FeedId should really be the discovery key. The public key should be
 * PublicId. Reading and writing to existing hypercores does not require the
 * public key; it's saved to disk. In a future refactor, we plan to remove the
 * reliance on public keys, and instead only provide the public key when
 * creating a new hypercore, or opening an unknown hypercore. The ledger keeps
 * track of which hypercores have already been opened.
 */
export default class FeedStore {
    private storage;
    private feeds;
    constructor(storageFn: FeedStorageFn);
    /**
     * Create a brand-new writable feed using the given key pair.
     * Promises the FeedId.
     */
    create(keys: Required<KeyPair>): Promise<FeedId>;
    append(feedId: FeedId, ...blocks: Block[]): Promise<number>;
    appendStream(feedId: FeedId): Promise<Writable>;
    read(feedId: FeedId, seq: number): Promise<any>;
    stream(feedId: FeedId, start?: number, end?: number): Promise<Readable>;
    close(feedId: FeedId): Promise<FeedId>;
    destroy(feedId: FeedId): Promise<FeedId>;
    getFeed(feedId: FeedId): Promise<Feed<Block>>;
    private open;
    private openOrCreateFeed;
}
export declare function discoveryId(id: FeedId): DiscoveryId;
export {};
