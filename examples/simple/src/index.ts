import { Converter, deserializeMessage, IMessage, logMessage, logOutput, ReadStream, SingleNodeClient } from "@iota/iota2.js";

const API_ENDPOINT = "http://localhost:14265";

async function run() {
    const client = new SingleNodeClient(API_ENDPOINT);

    const health = await client.health();
    console.log("Is the node healthy", health ? "Yes" : "No");
    console.log();

    const info = await client.info();
    console.log("Node Info");
    console.log("\tName:", info.name);
    console.log("\tVersion:", info.version);
    console.log("\tNetwork Id:", info.networkId);
    console.log("\tIs Healthy:", info.isHealthy);
    console.log("\tLatest Milestone Index:", info.latestMilestoneIndex);
    console.log("\tSolid Milestone Index:", info.solidMilestoneIndex);
    console.log("\tPruning Index:", info.pruningIndex);
    console.log("\tFeatures:", info.features);
    console.log();

    const tips = await client.tips();
    console.log("Tips");
    console.log("\tTip 1 Message Id:", tips.tip1MessageId);
    console.log("\tTip 2 Message Id:", tips.tip2MessageId);
    console.log();

    const submitMessage: IMessage = {
        parent1MessageId: tips.tip1MessageId,
        parent2MessageId: tips.tip2MessageId,
        payload: {
            type: 2,
            index: "Foo",
            data: Converter.asciiToHex("Bar")
        }
    };

    const messageId = await client.messageSubmit(submitMessage);
    console.log("Submit Message:");
    console.log("\tMessage Id", messageId);
    console.log();

    const message = await client.message(messageId);
    console.log("Get Message");
    logMessage("", message);
    console.log();

    const messageMetadata = await client.messageMetadata(messageId);
    console.log("Message Metadata");
    console.log("\tMessage Id:", messageMetadata.messageId);
    console.log("\tParent 1 Message Id:", messageMetadata.parent1MessageId);
    console.log("\tParent 2 Message Id:", messageMetadata.parent2MessageId);
    console.log("\tIs Solid:", messageMetadata.isSolid);
    console.log("\tReferenced By Milestone Index:", messageMetadata.referencedByMilestoneIndex);
    console.log("\tLedger Inclusion State:", messageMetadata.ledgerInclusionState);
    console.log("\tShould Promote:", messageMetadata.shouldPromote);
    console.log("\tShould Reattach:", messageMetadata.shouldReattach);
    console.log();

    const messageRaw = await client.messageRaw(messageId);
    console.log("Message Raw");
    console.log("\tRaw:", Converter.bytesToHex(messageRaw));
    console.log();
    const decoded = deserializeMessage(new ReadStream(messageRaw));
    console.log("Message Decoded");
    logMessage("", decoded);
    console.log();

    const messages = await client.messagesFind("Foo");
    console.log("Messages");
    console.log("\tIndex:", messages.index);
    console.log("\tMax Results:", messages.maxResults);
    console.log("\tCount:", messages.count);
    console.log("\tMessage Ids:", messages.messageIds);
    console.log();

    const children = await client.messageChildren(tips.tip1MessageId);
    console.log("Children");
    console.log("\tMessage Id:", children.messageId);
    console.log("\tMax Results:", children.maxResults);
    console.log("\tCount:", children.count);
    console.log("\tChildren Message Ids:", children.childrenMessageIds);
    console.log();

    const milestone = await client.milestone(info.latestMilestoneIndex);
    console.log("Milestone");
    console.log("\tMilestone Index:", milestone.milestoneIndex);
    console.log("\tMessage Id:", milestone.messageId);
    console.log("\tTimestamp:", milestone.timestamp);
    console.log();

    const output = await client.output("00000000000000000000000000000000000000000000000000000000000000000000");
    console.log("Output");
    console.log("\tMessage Id:", output.messageId);
    console.log("\tTransaction Id:", output.transactionId);
    console.log("\tOutput Index:", output.outputIndex);
    console.log("\tIs Spent:", output.isSpent);
    logOutput("\t", output.output);
    console.log();

    const address = await client.address(output.output.address.address);
    console.log("Address");
    console.log("\tAddress:", address.address);
    console.log("\tMax Results:", address.maxResults);
    console.log("\tCount:", address.count);
    console.log("\tBalance:", address.balance);
    console.log();

    const addressOutputs = await client.addressOutputs(output.output.address.address);
    console.log("Address Outputs");
    console.log("\tAddress:", addressOutputs.address);
    console.log("\tMax Results:", addressOutputs.maxResults);
    console.log("\tCount:", addressOutputs.count);
    console.log("\tOutput Ids:", addressOutputs.outputIds);
    console.log();
}

run()
    .then(() => console.log("Done"))
    .catch((err) => console.error(err));