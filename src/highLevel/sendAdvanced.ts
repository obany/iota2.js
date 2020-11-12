import { serializeInput } from "../binary/input";
import { serializeOutput } from "../binary/output";
import { serializeTransactionEssence } from "../binary/transaction";
import { Ed25519 } from "../crypto/ed25519";
import { IClient } from "../models/IClient";
import { IKeyPair } from "../models/IKeyPair";
import { IMessage } from "../models/IMessage";
import { IReferenceUnlockBlock } from "../models/IReferenceUnlockBlock";
import { ISigLockedSingleOutput } from "../models/ISigLockedSingleOutput";
import { ISignatureUnlockBlock } from "../models/ISignatureUnlockBlock";
import { ITransactionEssence } from "../models/ITransactionEssence";
import { ITransactionPayload } from "../models/ITransactionPayload";
import { IUTXOInput } from "../models/IUTXOInput";
import { Converter } from "../utils/converter";
import { WriteStream } from "../utils/writeStream";

/**
 * Send a transfer from the balance on the seed.
 * @param client The client to send the transfer with.
 * @param inputsAndSignatureKeyPairs The inputs with the signature key pairs needed to sign transfers.
 * @param outputs The outputs to send.
 * @param indexationKey Optional indexation key.
 * @param indexationData Optional index data.
 * @returns The id of the message created and the remainder address if one was needed.
 */
export async function sendAdvanced(
    client: IClient,
    inputsAndSignatureKeyPairs: {
        input: IUTXOInput;
        addressKeyPair: IKeyPair;
    }[],
    outputs: { address: string; amount: number }[],
    indexationKey?: string,
    indexationData?: Uint8Array): Promise<{
        messageId: string;
        message: IMessage;
    }> {
    if (!inputsAndSignatureKeyPairs || inputsAndSignatureKeyPairs.length === 0) {
        throw new Error("You must specify some inputs");
    }
    if (!outputs || outputs.length === 0) {
        throw new Error("You must specify some outputs");
    }

    const outputsWithSerialization: {
        output: ISigLockedSingleOutput;
        serialized: string;
    }[] = [];

    for (const output of outputs) {
        const sigLockedOutput: ISigLockedSingleOutput = {
            type: 0,
            address: {
                type: 1,
                address: output.address
            },
            amount: output.amount
        };
        const writeStream = new WriteStream();
        serializeOutput(writeStream, sigLockedOutput);
        outputsWithSerialization.push({
            output: sigLockedOutput,
            serialized: writeStream.finalHex()
        });
    }

    const inputsAndSignatureKeyPairsSerialized: {
        input: IUTXOInput;
        addressKeyPair: IKeyPair;
        serialized: string;
    }[] = inputsAndSignatureKeyPairs.map(i => {
        const writeStream = new WriteStream();
        serializeInput(writeStream, i.input);
        return {
            ...i,
            serialized: writeStream.finalHex()
        };
    });

    // Lexigraphically sort the inputs and outputs
    const sortedInputs = inputsAndSignatureKeyPairsSerialized.sort((a, b) => a.serialized.localeCompare(b.serialized));
    const sortedOutputs = outputsWithSerialization.sort((a, b) => a.serialized.localeCompare(b.serialized));

    const transactionEssence: ITransactionEssence = {
        type: 0,
        inputs: sortedInputs.map(i => i.input),
        outputs: sortedOutputs.map(o => o.output),
        payload: indexationKey && indexationData
            ? {
                type: 2,
                index: indexationKey,
                data: Converter.bytesToHex(indexationData)
            }
            : undefined
    };

    const binaryEssence = new WriteStream();
    serializeTransactionEssence(binaryEssence, transactionEssence);
    const essenceFinal = binaryEssence.finalBytes();

    // Create the unlock blocks
    const unlockBlocks: (ISignatureUnlockBlock | IReferenceUnlockBlock)[] = [];
    const addressToUnlockBlock: {
        [address: string]: {
            keyPair: IKeyPair;
            unlockIndex: number;
        };
    } = {};

    for (const input of sortedInputs) {
        const hexInputAddressPublic = Converter.bytesToHex(input.addressKeyPair.publicKey);
        if (addressToUnlockBlock[hexInputAddressPublic]) {
            unlockBlocks.push({
                type: 1,
                reference: addressToUnlockBlock[hexInputAddressPublic].unlockIndex
            });
        } else {
            unlockBlocks.push({
                type: 0,
                signature: {
                    type: 1,
                    publicKey: hexInputAddressPublic,
                    signature: Converter.bytesToHex(
                        Ed25519.sign(input.addressKeyPair.privateKey, essenceFinal)
                    )
                }
            });
            addressToUnlockBlock[hexInputAddressPublic] = {
                keyPair: input.addressKeyPair,
                unlockIndex: unlockBlocks.length - 1
            };
        }
    }

    const transactionPayload: ITransactionPayload = {
        type: 0,
        essence: transactionEssence,
        unlockBlocks
    };

    const tips = await client.tips();

    const message: IMessage = {
        version: 1,
        parent1MessageId: tips.tip1MessageId,
        parent2MessageId: tips.tip2MessageId,
        payload: transactionPayload
    };

    const messageId = await client.messageSubmit(message);

    return {
        messageId,
        message
    };
}
