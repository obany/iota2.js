import { ITypeBase } from "./ITypeBase";
/**
 * The global type for the unlock block.
 */
export declare const REFERENCE_UNLOCK_BLOCK_TYPE: number;
/**
 * Reference unlock block.
 */
export interface IReferenceUnlockBlock extends ITypeBase<1> {
    /**
     * The reference.
     */
    reference: number;
}
