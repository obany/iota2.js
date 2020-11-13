import { IAddressOutputs } from "../models/api/IAddressOutputs";
import { IMessageMetadata } from "../models/api/IMessageMetadata";
import { IMilestone } from "../models/api/IMilestone";
import { IOutput } from "../models/api/IOutput";
import { IMessage } from "../models/IMessage";
import { IMqttClient } from "../models/IMqttClient";
import { IMqttStatus } from "../models/IMqttStatus";
/**
 * MQTT Client implementation for pub/sub communication.
 */
export declare class MqttClient implements IMqttClient {
    /**
     * What is the endpoint for the client.
     */
    private readonly _endpoint;
    /**
     * Timeout to reconnect if no messages received.
     */
    private readonly _keepAliveTimeoutSeconds;
    /**
     * The communication client.
     */
    private _client?;
    /**
     * The last time a message was received.
     */
    private _lastMessageTime;
    /**
     * The keep alive timer.
     */
    private _timerId?;
    /**
     * The callback for different events.
     */
    private readonly _subscriptions;
    /**
     * The callbacks for status.
     */
    private readonly _statusSubscriptions;
    /**
     * Create a new instace of MqttClient.
     * @param endpoint The endpoint to connect to.
     * @param keepAliveTimeoutSeconds Timeout to reconnect if no messages received.
     */
    constructor(endpoint: string, keepAliveTimeoutSeconds?: number);
    /**
     * Subscribe to the latest milestone updates.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    milestonesLatest(callback: (topic: string, data: IMilestone) => void): string;
    /**
     * Subscribe to the latest solid milestone updates.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    milestonesSolid(callback: (topic: string, data: IMilestone) => void): string;
    /**
     * Subscribe to metadata updates for a specific message.
     * @param messageId The message to monitor.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    messageMetadata(messageId: string, callback: (topic: string, data: IMessageMetadata) => void): string;
    /**
     * Subscribe to updates for a specific output.
     * @param outputId The output to monitor.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    output(outputId: string, callback: (topic: string, data: IOutput) => void): string;
    /**
     * Subscribe to the address for output updates.
     * @param address The address to monitor.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    addressOutputs(address: string, callback: (topic: string, data: IAddressOutputs) => void): string;
    /**
     * Subscribe to get all messages in binary form.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    messagesRaw(callback: (topic: string, data: Uint8Array) => void): string;
    /**
     * Subscribe to get all messages in object form.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    messages(callback: (topic: string, data: IMessage, raw: Uint8Array) => void): string;
    /**
     * Subscribe to get all messages for the specified index in binary form.
     * @param index The index to monitor.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    indexRaw(index: string, callback: (topic: string, data: Uint8Array) => void): string;
    /**
     * Subscribe to get all messages for the specified index in object form.
     * @param index The index to monitor.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    index(index: string, callback: (topic: string, data: IMessage, raw: Uint8Array) => void): string;
    /**
     * Subscribe to get the metadata for all the messages.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    messagesMetadata(callback: (topic: string, data: IMessageMetadata) => void): string;
    /**
     * Subscribe to another type of message as raw data.
     * @param customTopic The topic to subscribe to.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    subscribeRaw(customTopic: string, callback: (topic: string, data: Uint8Array) => void): string;
    /**
     * Subscribe to another type of message as json.
     * @param customTopic The topic to subscribe to.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    subscribeJson<T>(customTopic: string, callback: (topic: string, data: T) => void): string;
    /**
     * Remove a subscription.
     * @param subscriptionId The subscription to remove.
     */
    unsubscribe(subscriptionId: string): void;
    /**
     * Subscribe to changes in the client state.
     * @param callback Callback called when the state has changed.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    statusChanged(callback: (data: IMqttStatus) => void): string;
    /**
     * Subscribe to another type of message.
     * @param customTopic The topic to subscribe to.
     * @param isJson Should we deserialize the data as JSON.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     * @private
     */
    private internalSubscribe;
    /**
     * Subscribe to a new topic on the client.
     * @param topic The topic to subscribe to.
     * @private
     */
    private mqttSubscribe;
    /**
     * Unsubscribe from a topic on the client.
     * @param topic The topic to unsubscribe from.
     * @private
     */
    private mqttUnsubscribe;
    /**
     * Connect the client.
     * @private
     */
    private mqttConnect;
    /**
     * Disconnect the client.
     * @private
     */
    private mqttDisconnect;
    /**
     * Trigger the callbacks for the specified topic.
     * @param topic The topic to call the callbacks for.
     * @param data The data to send to the callbacks.
     * @private
     */
    private triggerCallbacks;
    /**
     * Trigger the callbacks for the status.
     * @param status The status to send to the callbacks.
     * @private
     */
    private triggerStatusCallbacks;
    /**
     * Start the keep alive timer.
     * @private
     */
    private startKeepAlive;
    /**
     * Stop the keep alive timer.
     * @private
     */
    private stopKeepAlive;
    /**
     * Keep the connection alive.
     * @private
     */
    private keepAlive;
}
