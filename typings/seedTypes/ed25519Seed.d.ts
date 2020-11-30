import { Bip32Path } from "../crypto/bip32Path";
import { IKeyPair } from "../models/IKeyPair";
import { ISeed } from "../models/ISeed";
/**
 * The global type for the seed.
 */
export declare const ED25519_SEED_TYPE: number;
/**
 * Class to help with seeds.
 */
export declare class Ed25519Seed implements ISeed {
    /**
     * Create a new instance of Ed25519Seed.
     * @param secretKeyBytes The bytes.
     */
    constructor(secretKeyBytes?: Uint8Array);
    /**
     * Get the key pair from the seed.
     * @returns The key pair.
     */
    keyPair(): IKeyPair;
    /**
     * Generate a new seed from the path.
     * @param path The path to generate the seed for.
     * @returns The generated seed.
     */
    generateSeedFromPath(path: Bip32Path): ISeed;
    /**
     * Return the key as bytes.
     * @returns The key as bytes.
     */
    toBytes(): Uint8Array;
}
