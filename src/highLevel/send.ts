import { Bip32Path } from "../crypto/bip32Path";
import { Ed25519Address } from "../crypto/ed25519Address";
import { IClient } from "../models/IClient";
import { IKeyPair } from "../models/IKeyPair";
import { IMessage } from "../models/IMessage";
import { ISeed } from "../models/ISeed";
import { IUTXOInput } from "../models/IUTXOInput";
import { Converter } from "../utils/converter";
import { sendAdvanced } from "./sendAdvanced";

/**
 * Send a transfer from the balance on the seed.
 * @param client The client to send the transfer with.
 * @param seed The seed to use for address generation.
 * @param basePath The base path to start looking for addresses.
 * @param address The address to send the funds to.
 * @param amount The amount to send.
 * @param startIndex The start index for the wallet count address, defaults to 0.
 * @returns The id of the message created and the contructed message.
 */
export async function send(
    client: IClient,
    seed: ISeed,
    basePath: Bip32Path,
    address: string,
    amount: number,
    startIndex?: number): Promise<{
        messageId: string;
        message: IMessage;
    }> {
    const outputs = [{ address, amount }];
    const inputsAndKey = await calculateInputs(client, seed, basePath, outputs, startIndex);

    const response = await sendAdvanced(
        client,
        inputsAndKey,
        outputs);

    return {
        messageId: response.messageId,
        message: response.message
    };
}

/**
 * Calculate the inputs from the seed and basePath.
 * @param client The client to send the transfer with.
 * @param seed The seed to use for address generation.
 * @param basePath The base path to start looking for addresses.
 * @param outputs The outputs to send.
 * @param startIndex The start index for the wallet count address, defaults to 0.
 * @returns The id of the message created and the contructed message.
 */
export async function calculateInputs(
    client: IClient,
    seed: ISeed,
    basePath: Bip32Path,
    outputs: { address: string; amount: number }[],
    startIndex?: number): Promise<{
        input: IUTXOInput;
        addressKeyPair: IKeyPair;
    }[]> {
    const requiredBalance = outputs.reduce((total, output) => total + output.amount, 0);

    let localStartIndex = startIndex ?? 0;
    let consumedBalance = 0;
    const inputsAndSignatureKeyPairs: {
        input: IUTXOInput;
        addressKeyPair: IKeyPair;
    }[] = [];
    let finished = false;

    do {
        basePath.push(localStartIndex);
        const addressKeyPair = seed.generateSeedFromPath(basePath).keyPair();
        basePath.pop();

        const address = Converter.bytesToHex(Ed25519Address.publicKeyToAddress(addressKeyPair.publicKey));
        const addressOutputIds = await client.addressOutputs(address);

        if (addressOutputIds.count === 0) {
            finished = true;
        } else {
            for (const addressOutputId of addressOutputIds.outputIds) {
                const addressOutput = await client.output(addressOutputId);

                if (!addressOutput.isSpent &&
                    consumedBalance < requiredBalance) {
                    if (addressOutput.output.amount === 0) {
                        finished = true;
                    } else {
                        consumedBalance += addressOutput.output.amount;

                        const input: IUTXOInput = {
                            type: 0,
                            transactionId: addressOutput.transactionId,
                            transactionOutputIndex: addressOutput.outputIndex
                        };

                        inputsAndSignatureKeyPairs.push({
                            input,
                            addressKeyPair
                        });

                        if (consumedBalance >= requiredBalance) {
                            // We didn't use all the balance from the last input
                            // so return the rest to the same address.
                            if (consumedBalance - requiredBalance > 0) {
                                outputs.push({
                                    amount: consumedBalance - requiredBalance,
                                    address
                                });
                            }
                            finished = true;
                        }
                    }
                }
            }
        }

        localStartIndex++;
    } while (!finished);

    if (consumedBalance < requiredBalance) {
        throw new Error("There are not enough funds in the inputs for the required balance");
    }

    return inputsAndSignatureKeyPairs;
}
