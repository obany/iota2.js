"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttClient = void 0;
var mqtt = __importStar(require("mqtt"));
var message_1 = require("../binary/message");
var converter_1 = require("../utils/converter");
var randomHelper_1 = require("../utils/randomHelper");
var readStream_1 = require("../utils/readStream");
/**
 * MQTT Client implementation for pub/sub communication.
 */
var MqttClient = /** @class */ (function () {
    /**
     * Create a new instace of MqttClient.
     * @param endpoint The endpoint to connect to.
     * @param keepAliveTimeoutSeconds Timeout to reconnect if no messages received.
     */
    function MqttClient(endpoint, keepAliveTimeoutSeconds) {
        if (keepAliveTimeoutSeconds === void 0) { keepAliveTimeoutSeconds = 30; }
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
    MqttClient.prototype.milestonesLatest = function (callback) {
        return this.internalSubscribe("milestones/latest", true, callback);
    };
    /**
     * Subscribe to the latest solid milestone updates.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    MqttClient.prototype.milestonesSolid = function (callback) {
        return this.internalSubscribe("milestones/solid", true, callback);
    };
    /**
     * Subscribe to metadata updates for a specific message.
     * @param messageId The message to monitor.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    MqttClient.prototype.messageMetadata = function (messageId, callback) {
        return this.internalSubscribe("messages/" + messageId + "/metadata", true, callback);
    };
    /**
     * Subscribe to updates for a specific output.
     * @param outputId The output to monitor.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    MqttClient.prototype.output = function (outputId, callback) {
        return this.internalSubscribe("outputs/" + outputId, true, callback);
    };
    /**
     * Subscribe to the address for output updates.
     * @param addressBech32 The address to monitor.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    MqttClient.prototype.addressOutputs = function (addressBech32, callback) {
        return this.internalSubscribe("addresses/" + addressBech32 + "/outputs", true, callback);
    };
    /**
     * Subscribe to the ed25519 address for output updates.
     * @param addressEd25519 The address to monitor.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    MqttClient.prototype.addressEd25519Outputs = function (addressEd25519, callback) {
        return this.internalSubscribe("addresses/ed25519/" + addressEd25519 + "/outputs", true, callback);
    };
    /**
     * Subscribe to get all messages in binary form.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    MqttClient.prototype.messagesRaw = function (callback) {
        return this.internalSubscribe("messages", false, function (topic, raw) {
            callback(topic, raw);
        });
    };
    /**
     * Subscribe to get all messages in object form.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    MqttClient.prototype.messages = function (callback) {
        return this.internalSubscribe("messages", false, function (topic, raw) {
            callback(topic, message_1.deserializeMessage(new readStream_1.ReadStream(raw)), raw);
        });
    };
    /**
     * Subscribe to get all messages for the specified index in binary form.
     * @param index The index to monitor.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    MqttClient.prototype.indexRaw = function (index, callback) {
        return this.internalSubscribe("messages/indexation/" + index, false, function (topic, raw) {
            callback(topic, raw);
        });
    };
    /**
     * Subscribe to get all messages for the specified index in object form.
     * @param index The index to monitor.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    MqttClient.prototype.index = function (index, callback) {
        return this.internalSubscribe("messages/indexation/" + index, false, function (topic, raw) {
            callback(topic, message_1.deserializeMessage(new readStream_1.ReadStream(raw)), raw);
        });
    };
    /**
     * Subscribe to get the metadata for all the messages.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    MqttClient.prototype.messagesMetadata = function (callback) {
        return this.internalSubscribe("messages/referenced", true, callback);
    };
    /**
     * Subscribe to another type of message as raw data.
     * @param customTopic The topic to subscribe to.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    MqttClient.prototype.subscribeRaw = function (customTopic, callback) {
        return this.internalSubscribe(customTopic, false, callback);
    };
    /**
     * Subscribe to another type of message as json.
     * @param customTopic The topic to subscribe to.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    MqttClient.prototype.subscribeJson = function (customTopic, callback) {
        return this.internalSubscribe(customTopic, true, callback);
    };
    /**
     * Remove a subscription.
     * @param subscriptionId The subscription to remove.
     */
    MqttClient.prototype.unsubscribe = function (subscriptionId) {
        this.triggerStatusCallbacks({
            type: "subscription-remove",
            message: subscriptionId,
            isConnected: this._client !== undefined
        });
        if (this._statusSubscriptions[subscriptionId]) {
            delete this._statusSubscriptions[subscriptionId];
        }
        else {
            var topics = Object.keys(this._subscriptions);
            for (var i = 0; i < topics.length; i++) {
                var topic = topics[i];
                for (var j = 0; j < this._subscriptions[topic].subscriptionCallbacks.length; j++) {
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
    };
    /**
     * Subscribe to changes in the client state.
     * @param callback Callback called when the state has changed.
     * @returns A subscription Id which can be used to unsubscribe.
     */
    MqttClient.prototype.statusChanged = function (callback) {
        var subscriptionId = converter_1.Converter.bytesToHex(randomHelper_1.RandomHelper.generate(32));
        this._statusSubscriptions[subscriptionId] = callback;
        return subscriptionId;
    };
    /**
     * Subscribe to another type of message.
     * @param customTopic The topic to subscribe to.
     * @param isJson Should we deserialize the data as JSON.
     * @param callback The callback which is called when new data arrives.
     * @returns A subscription Id which can be used to unsubscribe.
     * @internal
     */
    MqttClient.prototype.internalSubscribe = function (customTopic, isJson, callback) {
        var isNewTopic = false;
        if (!this._subscriptions[customTopic]) {
            this._subscriptions[customTopic] = {
                isJson: isJson,
                subscriptionCallbacks: []
            };
            isNewTopic = true;
        }
        var subscriptionId = converter_1.Converter.bytesToHex(randomHelper_1.RandomHelper.generate(32));
        this._subscriptions[customTopic].subscriptionCallbacks.push({
            subscriptionId: subscriptionId,
            callback: callback
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
    };
    /**
     * Subscribe to a new topic on the client.
     * @param topic The topic to subscribe to.
     * @internal
     */
    MqttClient.prototype.mqttSubscribe = function (topic) {
        if (!this._client) {
            // There is no client so we need to connect,
            // the new topic is already in the subscriptions so
            // it will automatically get subscribed to.
            this.mqttConnect();
        }
        else {
            // There is already a client so just subscribe to the new topic.
            try {
                this._client.subscribe(topic);
            }
            catch (err) {
                this.triggerStatusCallbacks({
                    type: "error",
                    message: "Subscribe to topic " + topic + " failed on " + this._endpoint,
                    isConnected: this._client !== undefined,
                    error: err
                });
            }
        }
    };
    /**
     * Unsubscribe from a topic on the client.
     * @param topic The topic to unsubscribe from.
     * @internal
     */
    MqttClient.prototype.mqttUnsubscribe = function (topic) {
        if (this._client) {
            try {
                this._client.unsubscribe(topic);
            }
            catch (err) {
                this.triggerStatusCallbacks({
                    type: "error",
                    message: "Unsubscribe from topic " + topic + " failed on " + this._endpoint,
                    isConnected: this._client !== undefined,
                    error: err
                });
            }
        }
    };
    /**
     * Connect the client.
     * @internal
     */
    MqttClient.prototype.mqttConnect = function () {
        var _this = this;
        if (!this._client) {
            try {
                this._client = mqtt.connect(this._endpoint, {
                    keepalive: 0,
                    reconnectPeriod: this._keepAliveTimeoutSeconds * 1000
                });
                this._client.on("connect", function () {
                    // On a successful connection we want to subscribe to
                    // all the subscription topics.
                    try {
                        if (_this._client) {
                            _this._client.subscribe(Object.keys(_this._subscriptions));
                            _this.startKeepAlive();
                            _this.triggerStatusCallbacks({
                                type: "connect",
                                message: "Connection complete " + _this._endpoint,
                                isConnected: true
                            });
                        }
                    }
                    catch (err) {
                        _this.triggerStatusCallbacks({
                            type: "error",
                            message: "Subscribe to topics failed on " + _this._endpoint,
                            isConnected: _this._client !== undefined,
                            error: err
                        });
                    }
                });
                this._client.on("message", function (topic, message) {
                    _this._lastMessageTime = Date.now();
                    _this.triggerCallbacks(topic, message);
                });
                this._client.on("error", function (err) {
                    _this.triggerStatusCallbacks({
                        type: "error",
                        message: "Error on " + _this._endpoint,
                        isConnected: _this._client !== undefined,
                        error: err
                    });
                });
            }
            catch (err) {
                this.triggerStatusCallbacks({
                    type: "connect",
                    message: "Connection failed to " + this._endpoint,
                    isConnected: false,
                    error: err
                });
            }
        }
    };
    /**
     * Disconnect the client.
     * @internal
     */
    MqttClient.prototype.mqttDisconnect = function () {
        this.stopKeepAlive();
        if (this._client) {
            var localClient = this._client;
            this._client = undefined;
            try {
                localClient.unsubscribe(Object.keys(this._subscriptions));
                localClient.end();
            }
            catch (_a) { }
            this.triggerStatusCallbacks({
                type: "disconnect",
                message: "Disconnect complete " + this._endpoint,
                isConnected: true
            });
        }
    };
    /**
     * Trigger the callbacks for the specified topic.
     * @param topic The topic to call the callbacks for.
     * @param data The data to send to the callbacks.
     * @internal
     */
    MqttClient.prototype.triggerCallbacks = function (topic, data) {
        if (this._subscriptions[topic]) {
            var decodedData = data;
            if (this._subscriptions[topic].isJson) {
                try {
                    decodedData = JSON.parse(data.toString());
                }
                catch (err) {
                    this.triggerStatusCallbacks({
                        type: "error",
                        message: "Error decoding JSON for topic " + topic,
                        isConnected: this._client !== undefined,
                        error: err
                    });
                }
            }
            for (var i = 0; i < this._subscriptions[topic].subscriptionCallbacks.length; i++) {
                try {
                    this._subscriptions[topic].subscriptionCallbacks[i].callback(topic, decodedData);
                }
                catch (err) {
                    this.triggerStatusCallbacks({
                        type: "error",
                        message: "Triggering callback failed for topic " + topic + " on subscription " + this._subscriptions[topic].subscriptionCallbacks[i].subscriptionId,
                        isConnected: this._client !== undefined,
                        error: err
                    });
                }
            }
        }
    };
    /**
     * Trigger the callbacks for the status.
     * @param status The status to send to the callbacks.
     * @internal
     */
    MqttClient.prototype.triggerStatusCallbacks = function (status) {
        var subscriptionIds = Object.keys(this._statusSubscriptions);
        for (var i = 0; i < subscriptionIds.length; i++) {
            this._statusSubscriptions[subscriptionIds[i]](status);
        }
    };
    /**
     * Start the keep alive timer.
     * @internal
     */
    MqttClient.prototype.startKeepAlive = function () {
        var _this = this;
        this.stopKeepAlive();
        this._lastMessageTime = Date.now();
        this._timerId = setInterval(function () { return _this.keepAlive(); }, ((this._keepAliveTimeoutSeconds / 2) * 1000));
    };
    /**
     * Stop the keep alive timer.
     * @internal
     */
    MqttClient.prototype.stopKeepAlive = function () {
        if (this._timerId !== undefined) {
            clearInterval(this._timerId);
            this._timerId = undefined;
        }
    };
    /**
     * Keep the connection alive.
     * @internal
     */
    MqttClient.prototype.keepAlive = function () {
        if (Date.now() - this._lastMessageTime > (this._keepAliveTimeoutSeconds * 1000)) {
            this.mqttDisconnect();
            this.mqttConnect();
        }
    };
    return MqttClient;
}());
exports.MqttClient = MqttClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXF0dENsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnRzL21xdHRDbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUE2QjtBQUM3Qiw2Q0FBdUQ7QUFPdkQsZ0RBQStDO0FBQy9DLHNEQUFxRDtBQUNyRCxrREFBaUQ7QUFFakQ7O0dBRUc7QUFDSDtJQW1FSTs7OztPQUlHO0lBQ0gsb0JBQVksUUFBZ0IsRUFBRSx1QkFBb0M7UUFBcEMsd0NBQUEsRUFBQSw0QkFBb0M7UUFDOUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDM0IsSUFBSSxDQUFDLHdCQUF3QixHQUFHLHVCQUF1QixDQUFDO0lBQzVELENBQUM7SUFFRDs7OztPQUlHO0lBQ0kscUNBQWdCLEdBQXZCLFVBQ0ksUUFBMkQ7UUFDM0QsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksb0NBQWUsR0FBdEIsVUFDSSxRQUEyRDtRQUMzRCxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksb0NBQWUsR0FBdEIsVUFBdUIsU0FBaUIsRUFDcEMsUUFBeUQ7UUFDekQsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsY0FBWSxTQUFTLGNBQVcsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDcEYsQ0FBQztJQUVEOzs7OztPQUtHO0lB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