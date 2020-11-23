/**
 * Class implements the b1t6 encoding encoding which uses a group of 6 trits to encode each byte.
 */
export declare class B1T6 {
    /**
     * Minimum tryte value.
     */
    private static readonly MIN_TRYTE_VALUE;
    /**
     * Radix for trytes.
     */
    private static readonly TRYTE_RADIX;
    /**
     * Galf radix for trytes to save recalculating.
     */
    private static readonly TRYTE_RADIX_HALF;
    /**
     * Trites per tryte.
     */
    private static readonly TRITS_PER_TRYTE;
    /**
     * The encoded length of the data.
     * @param data The data.
     * @returns The encoded length.
     */
    static encodedLen(data: Uint8Array): number;
    /**
     * Encode a byte array into trits.
     * @param dst The destination array.
     * @param startIndex The start index to write in the array.
     * @param src The source data.
     * @returns The length of the encode.
     */
    static encode(dst: Int8Array, startIndex: number, src: Uint8Array): number;
    /**
     * Encode a group to trits.
     * @param b The value to encode.
     * @returns The trit groups.
     */
    private static encodeGroup;
    /**
     * Store the trits in the dest array.
     * @param trits The trits array.
     * @param startIndex The start index in the array to write.
     * @param value The value to write.
     */
    private static storeTrits;
}
