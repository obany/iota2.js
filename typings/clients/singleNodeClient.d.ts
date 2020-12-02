import { IAddressOutputsResponse } from "../models/api/IAddressOutputsResponse";
import { IAddressResponse } from "../models/api/IAddressResponse";
import { IChildrenResponse } from "../models/api/IChildrenResponse";
import { IMessagesResponse } from "../models/api/IMessagesResponse";
import { IMilestoneResponse } from "../models/api/IMilestoneResponse";
import { IOutputResponse } from "../models/api/IOutputResponse";
import { ITipsResponse } from "../models/api/ITipsResponse";
import { IClient } from "../models/IClient";
import { IMessage } from "../models/IMessage";
import { IMessageMetadata } from "../models/IMessageMetadata";
import { INodeInfo } from "../models/INodeInfo";
import { IPeer } from "../models/IPeer";
import { IPowProvider } from "../models/IPowProvider";
/**
 * Client for API communication.
 */
export declare class SingleNodeClient implements IClient {
    /**
     * Create a new instance of client.
     * @param endpoint The endpoint.
     * @param basePath for the API defaults to /api/v1/
     * @param powProvider Optional local POW provider.
     */
    constructor(endpoint: string, basePath?: string, powProvider?: IPowProvider);
    /**
     * Get the health of the node.
     * @returns True if the node is healthy.
     */
    health(): Promise<boolean>;
    /**
     * Get the info about the node.
     * @returns The node information.
     */
    info(): Promise<INodeInfo>;
    /**
     * Get the tips from the node.
     * @returns The tips.
     */
    tips(): Promise<ITipsResponse>;
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
    messagesFind(indexationKey: string): Promise<IMessagesResponse>;
    /**
     * Get the children of a message.
     * @param messageId The id of the message to get the children for.
     * @returns The messages children.
     */
    messageChildren(messageId: string): Promise<IChildrenResponse>;
    /**
     * Find an output by its identifier.
     * @param outputId The id of the output to get.
     * @returns The output details.
     */
    output(outputId: string): Promise<IOutputResponse>;
    /**
     * Get the address details.
     * @param addressBech32 The address to get the details for.
     * @returns The address details.
     */
    address(addressBech32: string): Promise<IAddressResponse>;
    /**
     * Get the address outputs.
     * @param addressBech32 The address to get the outputs for.
     * @returns The address outputs.
     */
    addressOutputs(addressBech32: string): Promise<IAddressOutputsResponse>;
    /**
     * Get the address detail using ed25519 address.
     * @param addressEd25519 The address to get the details for.
     * @returns The address details.
     */
    addressEd25519(addressEd25519: string): Promise<IAddressResponse>;
    /**
     * Get the address outputs using ed25519 address.
     * @param addressEd25519 The address to get the outputs for.
     * @returns The address outputs.
     */
    addressEd25519Outputs(addressEd25519: string): Promise<IAddressOutputsResponse>;
    /**
     * Get the requested milestone.
     * @param index The index of the milestone to get.
     * @returns The milestone details.
     */
    milestone(index: number): Promise<IMilestoneResponse>;
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
