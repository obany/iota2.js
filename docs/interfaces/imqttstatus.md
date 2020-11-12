**[@iota/iota2.js](../README.md)**

> [Globals](../README.md) / IMqttStatus

# Interface: IMqttStatus

Status message for MQTT Clients.

## Hierarchy

* **IMqttStatus**

## Index

### Properties

* [error](imqttstatus.md#error)
* [isConnected](imqttstatus.md#isconnected)
* [message](imqttstatus.md#message)
* [type](imqttstatus.md#type)

## Properties

### error

• `Optional` **error**: Error

Any errors.

___

### isConnected

•  **isConnected**: boolean

The connection status.

___

### message

•  **message**: string

Additional information about the status.

___

### type

•  **type**: \"connect\" \| \"disconnect\" \| \"error\" \| \"subscription-add\" \| \"subscription-remove\"

The type of message.
