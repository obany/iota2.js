**[@iota/iota2.js](../README.md)**

> [Globals](../README.md) / IMqttClient

# Interface: IMqttClient

Client interface definition for API communication.

## Hierarchy

* **IMqttClient**

## Implemented by

* [MqttClient](../classes/mqttclient.md)

## Index

### Methods

* [addressOutputs](imqttclient.md#addressoutputs)
* [index](imqttclient.md#index)
* [indexRaw](imqttclient.md#indexraw)
* [messageMetadata](imqttclient.md#messagemetadata)
* [messages](imqttclient.md#messages)
* [messagesMetadata](imqttclient.md#messagesmetadata)
* [messagesRaw](imqttclient.md#messagesraw)
* [milestonesLatest](imqttclient.md#milestoneslatest)
* [milestonesSolid](imqttclient.md#milestonessolid)
* [output](imqttclient.md#output)
* [statusChanged](imqttclient.md#statuschanged)
* [subscribeJson](imqttclient.md#subscribejson)
* [subscribeRaw](imqttclient.md#subscriberaw)
* [unsubscribe](imqttclient.md#unsubscribe)

## Methods

### addressOutputs

▸ **addressOutputs**(`address`: string, `callback`: (topic: string, data: [IAddressOutputs](iaddressoutputs.md)) => void): string

Subscribe to the address for output updates.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`address` | string | The address to monitor. |
`callback` | (topic: string, data: [IAddressOutputs](iaddressoutputs.md)) => void | The callback which is called when new data arrives. |

**Returns:** string

A subscription Id which can be used to unsubscribe.

___

### index

▸ **index**(`index`: string, `callback`: (topic: string, data: [IMessage](imessage.md), raw: Uint8Array) => void): string

Subscribe to get all messages for the specified index in object form.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`index` | string | The index to monitor. |
`callback` | (topic: string, data: [IMessage](imessage.md), raw: Uint8Array) => void | The callback which is called when new data arrives. |

**Returns:** string

A subscription Id which can be used to unsubscribe.

___

### indexRaw

▸ **indexRaw**(`index`: string, `callback`: (topic: string, data: Uint8Array) => void): string

Subscribe to get all messages for the specified index in binary form.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`index` | string | The index to monitor. |
`callback` | (topic: string, data: Uint8Array) => void | The callback which is called when new data arrives. |

**Returns:** string

A subscription Id which can be used to unsubscribe.

___

### messageMetadata

▸ **messageMetadata**(`messageId`: string, `callback`: (topic: string, data: [IMessageMetadata](imessagemetadata.md)) => void): string

Subscribe to metadata updates for a specific message.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`messageId` | string | The message to monitor. |
`callback` | (topic: string, data: [IMessageMetadata](imessagemetadata.md)) => void | The callback which is called when new data arrives. |

**Returns:** string

A subscription Id which can be used to unsubscribe.

___

### messages

▸ **messages**(`callback`: (topic: string, data: [IMessage](imessage.md), raw: Uint8Array) => void): string

Subscribe to get all messages in object form.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`callback` | (topic: string, data: [IMessage](imessage.md), raw: Uint8Array) => void | The callback which is called when new data arrives. |

**Returns:** string

A subscription Id which can be used to unsubscribe.

___

### messagesMetadata

▸ **messagesMetadata**(`callback`: (topic: string, data: [IMessageMetadata](imessagemetadata.md)) => void): string

Subscribe to get the metadata for all the messages.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`callback` | (topic: string, data: [IMessageMetadata](imessagemetadata.md)) => void | The callback which is called when new data arrives. |

**Returns:** string

A subscription Id which can be used to unsubscribe.

___

### messagesRaw

▸ **messagesRaw**(`callback`: (topic: string, data: Uint8Array) => void): string

Subscribe to get all messages in binary form.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`callback` | (topic: string, data: Uint8Array) => void | The callback which is called when new data arrives. |

**Returns:** string

A subscription Id which can be used to unsubscribe.

___

### milestonesLatest

▸ **milestonesLatest**(`callback`: (topic: string, data: [IMilestone](imilestone.md)) => void): string

Subscribe to the latest milestone updates.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`callback` | (topic: string, data: [IMilestone](imilestone.md)) => void | The callback which is called when new data arrives. |

**Returns:** string

A subscription Id which can be used to unsubscribe.

___

### milestonesSolid

▸ **milestonesSolid**(`callback`: (topic: string, data: [IMilestone](imilestone.md)) => void): string

Subscribe to the latest solid milestone updates.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`callback` | (topic: string, data: [IMilestone](imilestone.md)) => void | The callback which is called when new data arrives. |

**Returns:** string

A subscription Id which can be used to unsubscribe.

___

### output

▸ **output**(`outputId`: string, `callback`: (topic: string, data: [IOutput](ioutput.md)) => void): string

Subscribe to updates for a specific output.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`outputId` | string | The output to monitor. |
`callback` | (topic: string, data: [IOutput](ioutput.md)) => void | The callback which is called when new data arrives. |

**Returns:** string

A subscription Id which can be used to unsubscribe.

___

### statusChanged

▸ **statusChanged**(`callback`: (status: [IMqttStatus](imqttstatus.md)) => void): string

Subscribe to changes in the client state.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`callback` | (status: [IMqttStatus](imqttstatus.md)) => void | Callback called when the state has changed. |

**Returns:** string

A subscription Id which can be used to unsubscribe.

___

### subscribeJson

▸ **subscribeJson**\<T>(`customTopic`: string, `callback`: (topic: string, data: T) => void): string

Subscribe to another type of message as json.

#### Type parameters:

Name |
------ |
`T` |

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`customTopic` | string | The topic to subscribe to. |
`callback` | (topic: string, data: T) => void | The callback which is called when new data arrives. |

**Returns:** string

A subscription Id which can be used to unsubscribe.

___

### subscribeRaw

▸ **subscribeRaw**(`customTopic`: string, `callback`: (topic: string, data: Uint8Array) => void): string

Subscribe to another type of message as raw data.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`customTopic` | string | The topic to subscribe to. |
`callback` | (topic: string, data: Uint8Array) => void | The callback which is called when new data arrives. |

**Returns:** string

A subscription Id which can be used to unsubscribe.

___

### unsubscribe

▸ **unsubscribe**(`subscriptionId`: string): void

Remove a subscription.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`subscriptionId` | string | The subscription to remove.  |

**Returns:** void
