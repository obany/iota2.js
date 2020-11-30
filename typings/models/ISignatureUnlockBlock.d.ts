import { IEd25519Signature } from "./IEd25519Signature";
import { ITypeBase } from "./ITypeBase";
/**
 * The global type for the unlock block.
 */
export declare const SIGNATURE_UNLOCK_BLOCK_TYPE: number;
/**
 * Signature unlock block.
 */
export interface ISignatureUnlockBlock extends ITypeBase<0> {
    /**
     * The signature.
     */
    signature: IEd25519Signature;
}
