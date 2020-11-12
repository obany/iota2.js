**[@iota/iota2.js](../README.md)**

> [Globals](../README.md) / ZeroPowProvider

# Class: ZeroPowProvider

Zero POW Provider which does nothing.

## Hierarchy

* **ZeroPowProvider**

## Implements

* [IPowProvider](../interfaces/ipowprovider.md)

## Index

### Methods

* [doPow](zeropowprovider.md#dopow)

## Methods

### doPow

▸ **doPow**(`message`: Uint8Array): Promise\<bigint>

*Implementation of [IPowProvider](../interfaces/ipowprovider.md)*

Perform pow on the message and return the nonce.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`message` | Uint8Array | The message to process. |

**Returns:** Promise\<bigint>

The nonce.
