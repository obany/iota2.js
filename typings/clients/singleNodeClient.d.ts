import { IAddress } from "../models/api/IAddress";
import { IAddressOutputs } from "../models/api/IAddressOutputs";
import { IChildren } from "../models/api/IChildren";
import { IInfo } from "../models/api/IInfo";
import { IMessageMetadata } from "../models/api/IMessageMetadata";
import { IMessages } from "../models/api/IMessages";
import { IMilestone } from "../models/api/IMilestone";
import { IOutput } from "../models/api/IOutput";
import { IPeer } from "../models/api/IPeer";
import { ITips } from "../models/api/ITips";
import { IClient } from "../models/IClient";
import { IMessage } from "../models/IMessage";
import { IPowProvider } from "../models/IPowProvider";
/**
 * Client for API communication.
 */
export declare class SingleNodeClient implements IClient {
    /**
     * Create a new instance of client.
     * @param endpoint The endpoint.
     * @param powProvider Optional local POW provider.
     */
    constructor(endpoint: string, powProvider?: IPowProvider);
    /**
     * Get the health of the node.
     * @returns True if the node is healthy.
     */
    health(): Promise<boolean>;
    /**
     * Get the info about the node.
     * @returns The node information.
     */
    info(): Promise<IInfo>;
    /**
     * Get the tips from the node.
     * @returns The tips.
     */
    tips(): Promise<ITips>;
    /**
     * Get the message data by id.
     * @param messageId The message to get the data for.
     * @returns The message data.
     */
    message(messageId: string): Promise<IMessage>;
    /**
     * Get the message metadata by id.
     * @param messageId The message to get the metadata for.
     * @returns The message metadata.
     */
    messageMetadata(messageId: string): Promise<IMessageMetadata>;
    /**
     * Get the message raw data by id.
     * @param messageId The message to get the data for.
     * @returns The message raw data.
     */
    messageRaw(messageId: string): Promise<Uint8Array>;
    /**
     * Submit message.
     * @param message The message to submit.
     * @returns The messageId.
     */
    messageSubmit(message: IMessage): Promise<string>;
    /**
     * Submit message in raw format.
     * @param message The message to submit.
     * @returns The messageId.
     */
    messageSubmitRaw(message: Uint8Array): Promise<string>;
    /**
     * Find messages by index.
     * @param indexationKey The index value.
     * @returns The messageId.
     */
    messagesFind(indexationKey: string): Promise<IMessages>;
    /**
     * Get the children of a message.
     * @param messageId The id of the message to get the children for.
     * @returns The messages children.
     */
    messageChildren(messageId: string): Promise<IChildren>;
    /**
     * Find an output by its identifier.
     * @param outputId The id of the output to get.
     * @returns The output details.
     */
    output(outputId: string): Promise<IOutput>;
    /**
     * Get the address details.
     * @param address The address to get the details for.
     * @returns The address details.
     */
    address(address: string): Promise<IAddress>;
    /**
     * Get the address outputs.
     * @param address The address to get the outputs for.
     * @returns The address outputs.
     */
    addressOutputs(address: string): Promise<IAddressOutputs>;
    /**
     * Get the requested milestone.
     * @param index The index of the milestone to get.
     * @returns The milestone details.
     */
    milestone(index: number): Promise<IMilestone>;
    /**
     * Get the list of peers.
     * @returns The list of peers.
     */
    peers(): Promise<IPeer[]>;
    /**
     * Add a new peer.
     * @param multiAddress The address of the peer to add.
     * @param alias An optional alias for the peer.
     * @returns The details for the created peer.
     */
    peerAdd(multiAddress: string, alias?: string): Promise<IPeer>;
    /**
     * Delete a peer.
     * @param peerId The peer to delete.
     * @returns Nothing.
     */
    peerDelete(peerId: string): Promise<void>;
    /**
     * Get a peer.
     * @param peerId The peer to delete.
     * @returns The details for the created peer.
     */
    peer(peerId: string): Promise<IPeer>;
}
