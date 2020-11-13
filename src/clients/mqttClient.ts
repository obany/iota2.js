import * as mqtt from "mqtt";
import { deserializeMessage } from "../binary/message";
import { IAddressOutputs } from "../models/api/IAddressOutputs";
import { IMessageMetadata } from "../models/api/IMessageMetadata";
import { IMilestone } from "../models/api/IMilestone";
import { IOutput } from "../models/api/IOutput";
import { IMessage } from "../models/IMessage";
import { IMqttClient } from "../models/IMqttClient";
import { IMqttStatus } from "../models/IMqttStatus";
import { Converter } from "../utils/converter";
import { RandomHelper } from "../utils/randomHelper";
import { ReadStream } from "../utils/readStream";

/**
 * MQTT Client implementation for pub/sub communication.
 */
export class MqttClient implements IMqttClient {
    /**
     * What is the endpoint for the client.
     */
    private readonly _endpoint: string;

    /**
     * Timeout to reconnect if no messages received.
     */
    private readonly _keepAliveTimeoutSeconds: number;

    /**
     * The communication client.
     */
    private _client?: mqtt.MqttClient;

    /**
     * The last time a message was received.
     */
    private _lastMessageTime: number;

    /**
     * The keep alive timer.
     */
    private _timerId?: NodeJS.Timeout;

    /**
     * The callback for different events.
     */
    private readonly _subscriptions: {
        [topic: string]: {
            /**
             * Should we deserialize the data as JSON.
             */
            isJson: boolean;

            /**
             * The callback for the subscriptions.
             */
            subscriptionCallbacks: {
                /**
                 * The id of the subscription.
                 */
                subscriptionId: string;

                /**
                 * The callback for the subscription.
                 * @param event The event for the subscription.
                 * @param data The data for the event.
                 */
                callback(event: string, data: unknown): void;
            }[];
        };
    };

    /**
     * The callbacks for status.
     */
    private readonly _statusSubscriptions: { [subscriptionId: string]: (data: IMqttStatus) => void };

    /**
     * Create a new instace of MqttClient.
     * @param endpoint The endpoint to connect to.
     * @param keepAliveTimeoutSeconds Timeout to reconnect if no messages received.
     */
    constructor(endpoint: string, keepAliveTimeoutSeconds: number = 30) {
        this._endpoint = endpoint;
        this._subscriptions = {};
        this._statusSubscriptions = {};
        this._lastMessageTime = -1;
        this._keepAliveTimeoutSeconds = keepAliveTimeoutSeconds;
    }

    /**
     * Subscribe to the latest milestone updates.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    public milestonesLatest(
        callback: (topic: string, data: IMilestone) => void): string {
        return this.internalSubscribe("milestones/latest", true, callback);
    }

    /**
     * Subscribe to the latest solid milestone updates.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    public milestonesSolid(
        callback: (topic: string, data: IMilestone) => void): string {
        return this.internalSubscribe("milestones/solid", true, callback);
    }

    /**
     * Subscribe to metadata updates for a specific message.
     * @param messageId The message to monitor.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    public messageMetadata(messageId: string,
        callback: (topic: string, data: IMessageMetadata) => void): string {
        return this.internalSubscribe(`messages/${messageId}/metadata`, true, callback);
    }

    /**
     * Subscribe to updates for a specific output.
     * @param outputId The output to monitor.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    public output(outputId: string,
        callback: (topic: string, data: IOutput) => void): string {
        return this.internalSubscribe(`outputs/${outputId}`, true, callback);
    }

    /**
     * Subscribe to the address for output updates.
     * @param address The address to monitor.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    public addressOutputs(address: string,
        callback: (topic: string, data: IAddressOutputs) => void): string {
        return this.internalSubscribe(`addresses/${address}/outputs`, true, callback);
    }

    /**
     * Subscribe to get all messages in binary form.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    public messagesRaw(
        callback: (topic: string, data: Uint8Array) => void): string {
        return this.internalSubscribe<Uint8Array>("messages", false,
            (topic, raw) => {
                callback(
                    topic,
                    raw
                );
            });
    }

    /**
     * Subscribe to get all messages in object form.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    public messages(
        callback: (topic: string, data: IMessage, raw: Uint8Array) => void): string {
        return this.internalSubscribe<Uint8Array>("messages", false,
            (topic, raw) => {
                callback(
                    topic,
                    deserializeMessage(new ReadStream(raw)),
                    raw
                );
            });
    }

    /**
     * Subscribe to get all messages for the specified index in binary form.
     * @param index The index to monitor.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    public indexRaw(index: string,
        callback: (topic: string, data: Uint8Array) => void): string {
        return this.internalSubscribe<Uint8Array>(`messages/indexation/${index}`, false,
            (topic, raw) => {
                callback(
                    topic,
                    raw
                );
            });
    }

    /**
     * Subscribe to get all messages for the specified index in object form.
     * @param index The index to monitor.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    public index(index: string,
        callback: (topic: string, data: IMessage, raw: Uint8Array) => void): string {
        return this.internalSubscribe<Uint8Array>(`messages/indexation/${index}`, false,
            (topic, raw) => {
                callback(
                    topic,
                    deserializeMessage(new ReadStream(raw)),
                    raw
                );
            });
    }

    /**
     * Subscribe to get the metadata for all the messages.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    public messagesMetadata(
        callback: (topic: string, data: IMessageMetadata) => void): string {
        return this.internalSubscribe("messages/referenced", true, callback);
    }

    /**
     * Subscribe to another type of message as raw data.
     * @param customTopic The topic to subscribe to.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    public subscribeRaw(customTopic: string,
        callback: (topic: string, data: Uint8Array) => void): string {
        return this.internalSubscribe(customTopic, false, callback);
    }

    /**
     * Subscribe to another type of message as json.
     * @param customTopic The topic to subscribe to.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    public subscribeJson<T>(customTopic: string,
        callback: (topic: string, data: T) => void): string {
        return this.internalSubscribe<T>(customTopic, true, callback);
    }

    /**
     * Remove a subscription.
     * @param subscriptionId The subscription to remove.
     */
    public unsubscribe(subscriptionId: string): void {
        this.triggerStatusCallbacks({
            type: "subscription-remove",
            message: subscriptionId,
            isConnected: this._client !== undefined
        });

        if (this._statusSubscriptions[subscriptionId]) {
            delete this._statusSubscriptions[subscriptionId];
        } else {
            const topics = Object.keys(this._subscriptions);
            for (let i = 0; i < topics.length; i++) {
                const topic = topics[i];
                for (let j = 0; j < this._subscriptions[topic].subscriptionCallbacks.length; j++) {
                    if (this._subscriptions[topic].subscriptionCallbacks[j].subscriptionId === subscriptionId) {
                        this._subscriptions[topic].subscriptionCallbacks.splice(j, 1);
                        if (this._subscriptions[topic].subscriptionCallbacks.length === 0) {
                            delete this._subscriptions[topic];

                            // This is the last subscriber to this topic
                            // so unsubscribe from the actual client.
                            this.mqttUnsubscribe(topic);
                        }
                        return;
                    }
                }
            }
        }
    }

    /**
     * Subscribe to changes in the client state.
     * @param callback Callback called when the state has changed.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    public statusChanged(
        callback: (data: IMqttStatus) => void): string {
        const subscriptionId = Converter.bytesToHex(RandomHelper.generate(32));

        this._statusSubscriptions[subscriptionId] = callback;

        return subscriptionId;
    }

    /**
     * Subscribe to another type of message.
     * @param customTopic The topic to subscribe to.
     * @param isJson Should we deserialize the data as JSON.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     * @private
     */
    private internalSubscribe<T>(customTopic: string,
        isJson: boolean,
        callback: (topic: string, data: T) => void): string {
        let isNewTopic = false;

        if (!this._subscriptions[customTopic]) {
            this._subscriptions[customTopic] = {
                isJson,
                subscriptionCallbacks: []
            };
            isNewTopic = true;
        }

        const subscriptionId = Converter.bytesToHex(RandomHelper.generate(32));

        this._subscriptions[customTopic].subscriptionCallbacks.push({
            subscriptionId,
            callback
        });

        this.triggerStatusCallbacks({
            type: "subscription-add",
            message: subscriptionId,
            isConnected: this._client !== undefined
        });

        if (isNewTopic) {
            this.mqttSubscribe(customTopic);
        }

        return subscriptionId;
    }

    /**
     * Subscribe to a new topic on the client.
     * @param topic The topic to subscribe to.
     * @private
     */
    private mqttSubscribe(topic: string): void {
        if (!this._client) {
            // There is no client so we need to connect,
            // the new topic is already in the subscriptions so
            // it will automatically get subscribed to.
            this.mqttConnect();
        } else {
            // There is already a client so just subscribe to the new topic.
            try {
                this._client.subscribe(topic);
            } catch (err) {
                this.triggerStatusCallbacks({
                    type: "error",
                    message: `Subscribe to topic ${topic} failed on ${this._endpoint}`,
                    isConnected: this._client !== undefined,
                    error: err
                });
            }
        }
    }

    /**
     * Unsubscribe from a topic on the client.
     * @param topic The topic to unsubscribe from.
     * @private
     */
    private mqttUnsubscribe(topic: string): void {
        if (this._client) {
            try {
                this._client.unsubscribe(topic);
            } catch (err) {
                this.triggerStatusCallbacks({
                    type: "error",
                    message: `Unsubscribe from topic ${topic} failed on ${this._endpoint}`,
                    isConnected: this._client !== undefined,
                    error: err
                });
            }
        }
    }

    /**
     * Connect the client.
     * @private
     */
    private mqttConnect(): void {
        if (!this._client) {
            try {
                this._client = mqtt.connect(this._endpoint, {
                    keepalive: this._keepAliveTimeoutSeconds
                });

                this._client.on("connect", () => {
                    // On a successful connection we want to subscribe to
                    // all the subscription topics.
                    try {
                        if (this._client) {
                            this._client.subscribe(Object.keys(this._subscriptions));
                            this.startKeepAlive();
                            this.triggerStatusCallbacks({
                                type: "connect",
                                message: `Connection complete ${this._endpoint}`,
                                isConnected: true
                            });
                        }
                    } catch (err) {
                        this.triggerStatusCallbacks({
                            type: "error",
                            message: `Subscribe to topics failed on ${this._endpoint}`,
                            isConnected: this._client !== undefined,
                            error: err
                        });
                    }
                });

                this._client.on("message", (topic, message) => {
                    this._lastMessageTime = Date.now();
                    this.triggerCallbacks(topic, message);
                });

                this._client.on("error", err => {
                    this.triggerStatusCallbacks({
                        type: "error",
                        message: `Error on ${this._endpoint}`,
                        isConnected: this._client !== undefined,
                        error: err
                    });
                });
            } catch (err) {
                this.triggerStatusCallbacks({
                    type: "connect",
                    message: `Connection failed to ${this._endpoint}`,
                    isConnected: false,
                    error: err
                });
            }
        }
    }

    /**
     * Disconnect the client.
     * @private
     */
    private mqttDisconnect(): void {
        this.stopKeepAlive();
        if (this._client) {
            const localClient = this._client;
            this._client = undefined;

            try {
                localClient.unsubscribe(Object.keys(this._subscriptions));
                localClient.end();
            } catch { }

            this.triggerStatusCallbacks({
                type: "disconnect",
                message: `Disconnect complete ${this._endpoint}`,
                isConnected: true
            });
        }
    }

    /**
     * Trigger the callbacks for the specified topic.
     * @param topic The topic to call the callbacks for.
     * @param data The data to send to the callbacks.
     * @private
     */
    private triggerCallbacks(topic: string, data: Buffer | unknown): void {
        if (this._subscriptions[topic]) {
            let decodedData = data;
            if (this._subscriptions[topic].isJson) {
                try {
                    decodedData = JSON.parse((data as Buffer).toString());
                } catch (err) {
                    this.triggerStatusCallbacks({
                        type: "error",
                        message: `Error decoding JSON for topic ${topic}`,
                        isConnected: this._client !== undefined,
                        error: err
                    });
                }
            }
            for (let i = 0; i < this._subscriptions[topic].subscriptionCallbacks.length; i++) {
                try {
                    this._subscriptions[topic].subscriptionCallbacks[i].callback(topic, decodedData);
                } catch (err) {
                    this.triggerStatusCallbacks({
                        type: "error",
                        message: `Triggering callback failed for topic ${topic
                            } on subscription ${this._subscriptions[topic].subscriptionCallbacks[i].subscriptionId}`,
                        isConnected: this._client !== undefined,
                        error: err
                    });
                }
            }
        }
    }

    /**
     * Trigger the callbacks for the status.
     * @param status The status to send to the callbacks.
     * @private
     */
    private triggerStatusCallbacks(status: IMqttStatus): void {
        const subscriptionIds = Object.keys(this._statusSubscriptions);
        for (let i = 0; i < subscriptionIds.length; i++) {
            this._statusSubscriptions[subscriptionIds[i]](status);
        }
    }

    /**
     * Start the keep alive timer.
     * @private
     */
    private startKeepAlive(): void {
        this.stopKeepAlive();
        this._lastMessageTime = Date.now();
        this._timerId = setInterval(() => this.keepAlive(), ((this._keepAliveTimeoutSeconds / 2) * 1000));
    }

    /**
     * Stop the keep alive timer.
     * @private
     */
    private stopKeepAlive(): void {
        if (this._timerId !== undefined) {
            clearInterval(this._timerId);
            this._timerId = undefined;
        }
    }

    /**
     * Keep the connection alive.
     * @private
     */
    private keepAlive(): void {
        if (Date.now() - this._lastMessageTime > (this._keepAliveTimeoutSeconds * 1000)) {
            this.mqttDisconnect();
            this.mqttConnect();
        }
    }
}
