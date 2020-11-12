**[@iota/iota2.js](../README.md)**

> [Globals](../README.md) / IPowProvider

# Interface: IPowProvider

Perform the POW on a message.

## Hierarchy

* **IPowProvider**

## Implemented by

* [ZeroPowProvider](../classes/zeropowprovider.md)

## Index

### Methods

* [doPow](ipowprovider.md#dopow)

## Methods

### doPow

▸ **doPow**(`message`: Uint8Array): Promise\<bigint>

Perform pow on the message and return the nonce.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`message` | Uint8Array | The message to process. |

**Returns:** Promise\<bigint>

The nonce.
