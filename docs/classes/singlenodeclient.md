**[@iota/iota2.js](../README.md)**

> [Globals](../README.md) / SingleNodeClient

# Class: SingleNodeClient

Client for API communication.

## Hierarchy

* **SingleNodeClient**

## Implements

* [IClient](../interfaces/iclient.md)

## Index

### Constructors

* [constructor](singlenodeclient.md#constructor)

### Methods

* [address](singlenodeclient.md#address)
* [addressOutputs](singlenodeclient.md#addressoutputs)
* [health](singlenodeclient.md#health)
* [info](singlenodeclient.md#info)
* [message](singlenodeclient.md#message)
* [messageChildren](singlenodeclient.md#messagechildren)
* [messageMetadata](singlenodeclient.md#messagemetadata)
* [messageRaw](singlenodeclient.md#messageraw)
* [messageSubmit](singlenodeclient.md#messagesubmit)
* [messageSubmitRaw](singlenodeclient.md#messagesubmitraw)
* [messagesFind](singlenodeclient.md#messagesfind)
* [milestone](singlenodeclient.md#milestone)
* [output](singlenodeclient.md#output)
* [peer](singlenodeclient.md#peer)
* [peerAdd](singlenodeclient.md#peeradd)
* [peerDelete](singlenodeclient.md#peerdelete)
* [peers](singlenodeclient.md#peers)
* [tips](singlenodeclient.md#tips)

## Constructors

### constructor

\+ **new SingleNodeClient**(`endpoint`: string, `powProvider?`: [IPowProvider](../interfaces/ipowprovider.md)): [SingleNodeClient](singlenodeclient.md)

Create a new instance of client.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`endpoint` | string | The endpoint. |
`powProvider?` | [IPowProvider](../interfaces/ipowprovider.md) | Optional local POW provider.  |

**Returns:** [SingleNodeClient](singlenodeclient.md)

## Methods

### address

▸ **address**(`address`: string): Promise\<[IAddress](../interfaces/iaddress.md)>

*Implementation of [IClient](../interfaces/iclient.md)*

Get the address details.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`address` | string | The address to get the details for. |

**Returns:** Promise\<[IAddress](../interfaces/iaddress.md)>

The address details.

___

### addressOutputs

▸ **addressOutputs**(`address`: string): Promise\<[IAddressOutputs](../interfaces/iaddressoutputs.md)>

*Implementation of [IClient](../interfaces/iclient.md)*

Get the address outputs.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`address` | string | The address to get the outputs for. |

**Returns:** Promise\<[IAddressOutputs](../interfaces/iaddressoutputs.md)>

The address outputs.

___

### health

▸ **health**(): Promise\<boolean>

*Implementation of [IClient](../interfaces/iclient.md)*

Get the health of the node.

**Returns:** Promise\<boolean>

True if the node is healthy.

___

### info

▸ **info**(): Promise\<[IInfo](../interfaces/iinfo.md)>

*Implementation of [IClient](../interfaces/iclient.md)*

Get the info about the node.

**Returns:** Promise\<[IInfo](../interfaces/iinfo.md)>

The node information.

___

### message

▸ **message**(`messageId`: string): Promise\<[IMessage](../interfaces/imessage.md)>

*Implementation of [IClient](../interfaces/iclient.md)*

Get the message data by id.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`messageId` | string | The message to get the data for. |

**Returns:** Promise\<[IMessage](../interfaces/imessage.md)>

The message data.

___

### messageChildren

▸ **messageChildren**(`messageId`: string): Promise\<[IChildren](../interfaces/ichildren.md)>

*Implementation of [IClient](../interfaces/iclient.md)*

Get the children of a message.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`messageId` | string | The id of the message to get the children for. |

**Returns:** Promise\<[IChildren](../interfaces/ichildren.md)>

The messages children.

___

### messageMetadata

▸ **messageMetadata**(`messageId`: string): Promise\<[IMessageMetadata](../interfaces/imessagemetadata.md)>

*Implementation of [IClient](../interfaces/iclient.md)*

Get the message metadata by id.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`messageId` | string | The message to get the metadata for. |

**Returns:** Promise\<[IMessageMetadata](../interfaces/imessagemetadata.md)>

The message metadata.

___

### messageRaw

▸ **messageRaw**(`messageId`: string): Promise\<Uint8Array>

*Implementation of [IClient](../interfaces/iclient.md)*

Get the message raw data by id.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`messageId` | string | The message to get the data for. |

**Returns:** Promise\<Uint8Array>

The message raw data.

___

### messageSubmit

▸ **messageSubmit**(`message`: [IMessage](../interfaces/imessage.md)): Promise\<string>

*Implementation of [IClient](../interfaces/iclient.md)*

Submit message.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`message` | [IMessage](../interfaces/imessage.md) | The message to submit. |

**Returns:** Promise\<string>

The messageId.

___

### messageSubmitRaw

▸ **messageSubmitRaw**(`message`: Uint8Array): Promise\<string>

*Implementation of [IClient](../interfaces/iclient.md)*

Submit message in raw format.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`message` | Uint8Array | The message to submit. |

**Returns:** Promise\<string>

The messageId.

___

### messagesFind

▸ **messagesFind**(`indexationKey`: string): Promise\<[IMessages](../interfaces/imessages.md)>

*Implementation of [IClient](../interfaces/iclient.md)*

Find messages by index.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`indexationKey` | string | The index value. |

**Returns:** Promise\<[IMessages](../interfaces/imessages.md)>

The messageId.

___

### milestone

▸ **milestone**(`index`: number): Promise\<[IMilestone](../interfaces/imilestone.md)>

*Implementation of [IClient](../interfaces/iclient.md)*

Get the requested milestone.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`index` | number | The index of the milestone to get. |

**Returns:** Promise\<[IMilestone](../interfaces/imilestone.md)>

The milestone details.

___

### output

▸ **output**(`outputId`: string): Promise\<[IOutput](../interfaces/ioutput.md)>

*Implementation of [IClient](../interfaces/iclient.md)*

Find an output by its identifier.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`outputId` | string | The id of the output to get. |

**Returns:** Promise\<[IOutput](../interfaces/ioutput.md)>

The output details.

___

### peer

▸ **peer**(`peerId`: string): Promise\<[IPeer](../interfaces/ipeer.md)>

*Implementation of [IClient](../interfaces/iclient.md)*

Get a peer.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`peerId` | string | The peer to delete. |

**Returns:** Promise\<[IPeer](../interfaces/ipeer.md)>

The details for the created peer.

___

### peerAdd

▸ **peerAdd**(`multiAddress`: string, `alias?`: undefined \| string): Promise\<[IPeer](../interfaces/ipeer.md)>

*Implementation of [IClient](../interfaces/iclient.md)*

Add a new peer.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`multiAddress` | string | The address of the peer to add. |
`alias?` | undefined \| string | An optional alias for the peer. |

**Returns:** Promise\<[IPeer](../interfaces/ipeer.md)>

The details for the created peer.

___

### peerDelete

▸ **peerDelete**(`peerId`: string): Promise\<void>

*Implementation of [IClient](../interfaces/iclient.md)*

Delete a peer.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`peerId` | string | The peer to delete. |

**Returns:** Promise\<void>

Nothing.

___

### peers

▸ **peers**(): Promise\<[IPeer](../interfaces/ipeer.md)[]>

*Implementation of [IClient](../interfaces/iclient.md)*

Get the list of peers.

**Returns:** Promise\<[IPeer](../interfaces/ipeer.md)[]>

The list of peers.

___

### tips

▸ **tips**(): Promise\<[ITips](../interfaces/itips.md)>

*Implementation of [IClient](../interfaces/iclient.md)*

Get the tips from the node.

**Returns:** Promise\<[ITips](../interfaces/itips.md)>

The tips.
