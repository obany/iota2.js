/**
 * Perform the POW on a message.
 */
export interface IPowProvider {
    doPow(message: Uint8Array): Promise<bigint>;
}
