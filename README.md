# IOTA2.js

Experimental client library for Chrysalis Part 2 and beyond. Implemeted in TypeScript to strongly type the objects sent and received from the API.

## Installation

```shell
npm install obany/iota2.js
```

## Example

```js
const { SingleNodeClient } = require("@iota/iota2.js");

async function run() {
    const client = new SingleNodeClient("http://localhost:14265");

    const info = await client.info();
    console.log("Node Info");
    console.log("\tName:", info.name);
    console.log("\tVersion:", info.version);
    console.log("\tIs Healthy:", info.isHealthy);
    console.log("\tNetwork Id:", info.networkId);
    console.log("\tCoordinator Public Key:", info.coordinatorPublicKey);
    console.log("\tLatest Milestone Message Id:", info.latestMilestoneMessageId);
    console.log("\tLatest Milestone Index:", info.latestMilestoneIndex);
    console.log("\tSolid Milestone Message Id:", info.solidMilestoneMessageId);
    console.log("\tSolid Milestone Index:", info.solidMilestoneIndex);
    console.log("\tPruning Index:", info.pruningIndex);
    console.log("\tFeatures:", info.features);
}

run()
    .then(() => console.log("Done"))
    .catch((err) => console.error(err));
```

## API Endpoints

These methods are implemented on the API client.

* health()
* info()
* tips()
* message(messageId)
* messageMetadata(messageId)
* messageRaw(messageId)
* messageSubmit(message)
* messageSubmitRaw(message)
* messageChildren(messageId)
* messagesFind(index)
* output(outputId)
* address(address)
* addressOutputs(address)
* milestone(index)
* peers()
* peerAdd()
* peerDelete()
* peer()

## High level operations

There are also high level operations which make use of the API level methods:

* getBalance - Given a seed, path calculate the total balance available on it's addresses.
* getUnspentAddress - Given a seed, path, and start index find the next unspent address.
* getUnspentAddresses - Given a seed, path, and start index find all the unspent addresses.
* retrieveData - Given a message id return the index and data from it.
* send - Given a seed, path, destination address and amount, make a single transfer.
* sendAdvanced - Given a set of inputs with keypairs seed, path, list of destinations make multiple transfers, can also include index data.
* sendData - Given index and data create a new data message.

## MQTT Operations

You can create a MQTT client which once connected can stream the following feeds.

* milestonesLatest
* milestonesSolid
* messageMetadata - Metadata updates for a specified messageId
* output - Output updates for a specified outputId
* addressOutputs - Address output updates for a specified address
* messagesRaw - All messages in binary form
* messages - All messaged decoded to objects
* indexRaw - All messages for a specified indexation key in binary form
* index - All messages for a specified indexation key in object form
* messagesData - All metadata updates

## Models

You can see the model definitions for all the objects in the [typings](./typings/models) folder.

## More Examples

Please find other examples in the [./examples](./examples) folder.
* Simple - Performs basic API operations.
* Transaction - Demonstrates how to send a transaction and call some of the other higher level functions.
* Data - Storing and retrieving data on the tangle.
* Browser - Demonstrates direct inclusion and use of the library in an html page.
* Peers - Demonstrates peer management.
* Mqtt - Using mqtt to read streaming messages.

## Notes

We are using Seed + Bip32 indexing for addresses, so the default address for a seed is calculated from path `m/0`, this is different from the default genesis balance address in Hornet, so it will not currently work when trying to transfer funds away from the genesis seed.

To remedy this in Hornet modify the `create_snapshot_alphanet.sh` script and change `6920b176f613ec7be59e68fc68f597eb3393af80f74c7c3db78198147d5f1f92` to `625d17d4a4b21cd5edeb57544b9d2d66ce22985fb61f17d1d7cae958d0068618`, you will then need to clean the DB and bootstrap the hornet node again. The Genesis tokens will now be stored on the new address and can be transferred using the seed/keys demonstrated in the examples.