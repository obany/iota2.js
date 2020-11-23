import { Blake2b } from "../crypto/blake2b";
import { Curl } from "../crypto/curl";
import { B1T6 } from "../encoding/b1t6";
import { IPowProvider } from "../models/IPowProvider";
import { PowHelper } from "../utils/powHelper";

/**
 * Local POW Provider.
 * WARNING - This is really slow.
 */
export class LocalPowProvider implements IPowProvider {
    /**
     * LN3 Const see https://oeis.org/A002391
     */
    private readonly LN3: number = 1.098612288668109691395245236922525704647490557822749451734694333;

    /**
     * Perform pow on the message and return the nonce of at least targetScore.
     * @param message The message to process.
     * @param targetScore the target score.
     * @returns The nonce.
     */
    public async pow(message: Uint8Array, targetScore: number): Promise<bigint> {
        const powRelevantData = message.slice(0, -8);

        const powDigest = Blake2b.sum256(powRelevantData);

        const targetZeros = Math.ceil(Math.log((powRelevantData.length + 8) * targetScore) / this.LN3);

        return this.worker(powDigest, targetZeros);
    }

    /**
     * Perform the hash on the data until we reach target number of zeros.
     * @param powDigest The pow digest.
     * @param target The target number of zeros.
     * @returns The nonce.
     * @internal
     */
    private worker(powDigest: Uint8Array, target: number): bigint {
        const curl = new Curl();

        const hash: Int8Array = new Int8Array(Curl.HASH_LENGTH);

        const buf: Int8Array = new Int8Array(Curl.HASH_LENGTH);
        B1T6.encode(buf, 0, powDigest);

        const digestTritsLen = B1T6.encodedLen(powDigest);

        let nonce = BigInt(0);
        let returnNonce;

        do {
            PowHelper.encodeNonce(buf, digestTritsLen, nonce);

            curl.reset();
            curl.absorb(buf, 0, Curl.HASH_LENGTH);
            curl.squeeze(hash, 0, Curl.HASH_LENGTH);

            if (PowHelper.trinaryTrailingZeros(hash) >= target) {
                returnNonce = nonce;
            }
            nonce++;
        } while (returnNonce === undefined);

        return returnNonce ?? BigInt(0);
    }
}
