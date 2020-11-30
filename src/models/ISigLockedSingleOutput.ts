import { IEd25519Address } from "./IEd25519Address";
import { ITypeBase } from "./ITypeBase";

/**
 * The global type for the sig locked single output.
 */
export const SIG_LOCKED_SINGLE_OUTPUT_TYPE: number = 0;

/**
 * Signature locked single output.
 */
export interface ISigLockedSingleOutput extends ITypeBase<0> {
    /**
     * The address.
     */
    address: IEd25519Address;

    /**
     * The amount of the output.
     */
    amount: number;
}
