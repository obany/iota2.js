/**
 * Perform the POW on a message.
 */
export interface IPowProvider {
    /**
     * Perform pow on the message and return the nonce.
     * @param message The message to process.
     * @returns The nonce.
     */
    doPow(message: Uint8Array): Promise<bigint>;
}
