import { IPowProvider } from "../models/IPowProvider";

/**
 * Zero POW Provider which does nothing.
 */
export class ZeroPowProvider implements IPowProvider {
    /**
     * Perform pow on the message and return the nonce.
     * @param message The message to process.
     * @returns The nonce.
     */
    public async doPow(message: Uint8Array): Promise<bigint> {
        return BigInt(0);
    }
}
