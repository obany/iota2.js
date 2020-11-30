import { ITypeBase } from "./ITypeBase";

/**
 * The global type for the input.
 */
export const UTXO_INPUT_TYPE: number = 0;

/**
 * UTXO Transaction Input.
 */
export interface IUTXOInput extends ITypeBase<0> {
    /**
     * The transaction Id.
     */
    transactionId: string;

    /**
     * The output index.
     */
    transactionOutputIndex: number;
}
