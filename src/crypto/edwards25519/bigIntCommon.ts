/* eslint-disable no-bitwise */
/**
 * This is a port of the Go code from https://github.com/hdevalence/ed25519consensus
 * which is an extension of https://github.com/golang/crypto/tree/master/ed25519
 * which in a port of the “ref10” implementation of ed25519 from SUPERCOP
 */

/* @internal */
export const BIG_1_SHIFTL_20: bigint = BigInt(1) << BigInt(20);
/* @internal */
export const BIG_1_SHIFTL_24: bigint = BigInt(1) << BigInt(24);
/* @internal */
export const BIG_1_SHIFTL_25: bigint = BigInt(1) << BigInt(25);

/* @internal */
export const BIG_ARR: bigint[] = [
    BigInt(0), BigInt(1), BigInt(2), BigInt(3), BigInt(4), BigInt(5),
    BigInt(6), BigInt(7), BigInt(8), BigInt(9), BigInt(10), BigInt(11),
    BigInt(12), BigInt(13), BigInt(14), BigInt(15), BigInt(16), BigInt(17),
    BigInt(18), BigInt(19), BigInt(20), BigInt(21), BigInt(22), BigInt(23),
    BigInt(24), BigInt(25), BigInt(26)
];

/* @internal */
export const BIG_38: bigint = BigInt(38);

/* @internal */
export const BIG_666643: bigint = BigInt(666643);
/* @internal */
export const BIG_470296: bigint = BigInt(470296);
/* @internal */
export const BIG_654183: bigint = BigInt(654183);
/* @internal */
export const BIG_997805: bigint = BigInt(997805);
/* @internal */
export const BIG_136657: bigint = BigInt(136657);
/* @internal */
export const BIG_683901: bigint = BigInt(683901);
/* @internal */
export const BIG_2097151: bigint = BigInt(2097151);
/* @internal */
export const BIG_8388607: bigint = BigInt(8388607);

