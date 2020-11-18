import { IEd25519Address } from "../models/IEd25519Address";
import { IEd25519Signature } from "../models/IEd25519Signature";
import { IIndexationPayload } from "../models/IIndexationPayload";
import { IMessage } from "../models/IMessage";
import { IMilestonePayload } from "../models/IMilestonePayload";
import { IReferenceUnlockBlock } from "../models/IReferenceUnlockBlock";
import { ISigLockedSingleOutput } from "../models/ISigLockedSingleOutput";
import { ISignatureUnlockBlock } from "../models/ISignatureUnlockBlock";
import { ITransactionPayload } from "../models/ITransactionPayload";
import { ITypeBase } from "../models/ITypeBase";
import { IUTXOInput } from "../models/IUTXOInput";
import { Converter } from "./converter";

/**
 * The logger used by the log methods.
 * @param message The message to output.
 * @param data The data to output.
 * @returns Nothing.
 */
let logger: (message: string, data?: unknown) => void = (message: string, data: unknown) =>
    (data !== undefined ? console.log(message, data) : console.log(message));

/**
 * Set the logger for output.
 * @param log The logger.
 */
export function setLogger(log: (message: string, data?: unknown) => void): void {
    logger = log;
}

/**
 * Log a message to the console.
 * @param prefix The prefix for the output.
 * @param message The message to log.
 */
export function logMessage(prefix: string, message: IMessage): void {
    logger(`${prefix}\tNetwork Id:`, message.networkId);
    logger(`${prefix}\tParent 1 Message Id:`, message.parent1MessageId);
    logger(`${prefix}\tParent 2 Message Id:`, message.parent2MessageId);
    logPayload(`${prefix}\t`, message.payload);
    if (message.nonce !== undefined) {
        logger(`${prefix}\tNonce:`, message.nonce);
    }
}

/**
 * Log a message to the console.
 * @param prefix The prefix for the output.
 * @param unknownPayload The payload.
 */
export function logPayload(prefix: string, unknownPayload?: ITypeBase<unknown>): void {
    if (unknownPayload) {
        if (unknownPayload.type === 0) {
            const payload = unknownPayload as ITransactionPayload;
            logger(`${prefix}Transaction Payload`);
            if (payload.essence.type === 0) {
                if (payload.essence.inputs) {
                    logger(`${prefix}\tInputs:`, payload.essence.inputs.length);
                    for (const input of payload.essence.inputs) {
                        logInput(`${prefix}\t\t`, input);
                    }
                }
                if (payload.essence.outputs) {
                    logger(`${prefix}\tOutputs:`, payload.essence.outputs.length);
                    for (const output of payload.essence.outputs) {
                        logOutput(`${prefix}\t\t`, output);
                    }
                }
                logPayload(`${prefix}\t`, payload.essence.payload);
            }
            if (payload.unlockBlocks) {
                logger(`${prefix}\tUnlock Blocks:`, payload.unlockBlocks.length);
                for (const unlockBlock of payload.unlockBlocks) {
                    logUnlockBlock(`${prefix}\t\t`, unlockBlock);
                }
            }
        } else if (unknownPayload.type === 1) {
            const payload = unknownPayload as IMilestonePayload;
            logger(`${prefix}Milestone Payload`);
            logger(`${prefix}\tIndex:`, payload.index);
            logger(`${prefix}\tTimestamp:`, payload.timestamp);
            logger(`${prefix}\tInclusion Merkle Proof:`, payload.inclusionMerkleProof);
            logger(`${prefix}\tSignatures:`, payload.signatures);
        } else if (unknownPayload.type === 2) {
            const payload = unknownPayload as IIndexationPayload;
            logger(`${prefix}Indexation Payload`);
            logger(`${prefix}\tIndex:`, payload.index);
            logger(`${prefix}\tData:`, Converter.hexToAscii(payload.data));
        }
    }
}

/**
 * Log an address to the console.
 * @param prefix The prefix for the output.
 * @param unknownAddress The address to log.
 */
export function logAddress(prefix: string, unknownAddress?: ITypeBase<unknown>): void {
    if (unknownAddress) {
        if (unknownAddress.type === 1) {
            const address = unknownAddress as IEd25519Address;
            logger(`${prefix}Ed25519 Address`);
            logger(`${prefix}\tAddress:`, address.address);
        }
    }
}

/**
 * Log signature to the console.
 * @param prefix The prefix for the output.
 * @param unknownSignature The signature to log.
 */
export function logSignature(prefix: string, unknownSignature?: ITypeBase<unknown>): void {
    if (unknownSignature) {
        if (unknownSignature.type === 1) {
            const signature = unknownSignature as IEd25519Signature;
            logger(`${prefix}Ed25519 Signature`);
            logger(`${prefix}\tPublic Key:`, signature.publicKey);
            logger(`${prefix}\tSignature:`, signature.signature);
        }
    }
}

/**
 * Log input to the console.
 * @param prefix The prefix for the output.
 * @param unknownInput The input to log.
 */
export function logInput(prefix: string, unknownInput?: ITypeBase<unknown>): void {
    if (unknownInput) {
        if (unknownInput.type === 0) {
            const input = unknownInput as IUTXOInput;
            logger(`${prefix}UTXO Input`);
            logger(`${prefix}\tTransaction Id:`, input.transactionId);
            logger(`${prefix}\tTransaction Output Index:`, input.transactionOutputIndex);
        }
    }
}

/**
 * Log output to the console.
 * @param prefix The prefix for the output.
 * @param unknownOutput The output to log.
 */
export function logOutput(prefix: string, unknownOutput?: ITypeBase<unknown>): void {
    if (unknownOutput) {
        if (unknownOutput.type === 0) {
            const output = unknownOutput as ISigLockedSingleOutput;
            logger(`${prefix}Signature Locked Single Output`);
            logAddress(`${prefix}\t\t`, output.address);
            logger(`${prefix}\t\tAmount:`, output.amount);
        }
    }
}

/**
 * Log unlock block to the console.
 * @param prefix The prefix for the output.
 * @param unknownUnlockBlock The unlock block to log.
 */
export function logUnlockBlock(prefix: string, unknownUnlockBlock?: ITypeBase<unknown>): void {
    if (unknownUnlockBlock) {
        if (unknownUnlockBlock.type === 0) {
            const unlockBlock = unknownUnlockBlock as ISignatureUnlockBlock;
            logger(`${prefix}\tSignature Unlock Block`);
            logSignature(`${prefix}\t\t\t`, unlockBlock.signature);
        } else if (unknownUnlockBlock.type === 1) {
            const unlockBlock = unknownUnlockBlock as IReferenceUnlockBlock;
            logger(`${prefix}\tReference Unlock Block`);
            logger(`${prefix}\t\tReference:`, unlockBlock.reference);
        }
    }
}
