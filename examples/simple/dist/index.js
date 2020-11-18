"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const iota2_js_1 = require("@iota/iota2.js");
const API_ENDPOINT = "http://localhost:14265";
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new iota2_js_1.SingleNodeClient(API_ENDPOINT);
        const health = yield client.health();
        console.log("Is the node healthy", health ? "Yes" : "No");
        console.log();
        const info = yield client.info();
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
        const tips = yield client.tips();
        console.log("Tips");
        console.log("\tTip 1 Message Id:", tips.tip1MessageId);
        console.log("\tTip 2 Message Id:", tips.tip2MessageId);
        console.log();
        const submitMessage = {
            parent1MessageId: tips.tip1MessageId,
            parent2MessageId: tips.tip2MessageId,
            payload: {
                type: 2,
                index: "Foo",
                data: iota2_js_1.Converter.asciiToHex("Bar")
            }
        };
        const messageId = yield client.messageSubmit(submitMessage);
        console.log("Submit Message:");
        console.log("\tMessage Id", messageId);
        console.log();
        const message = yield client.message(messageId);
        console.log("Get Message");
        iota2_js_1.logMessage("", message);
        console.log();
        const messageMetadata = yield client.messageMetadata(messageId);
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
        const messageRaw = yield client.messageRaw(messageId);
        console.log("Message Raw");
        console.log("\tRaw:", iota2_js_1.Converter.bytesToHex(messageRaw));
        console.log();
        const decoded = iota2_js_1.deserializeMessage(new iota2_js_1.ReadStream(messageRaw));
        console.log("Message Decoded");
        iota2_js_1.logMessage("", decoded);
        console.log();
        const messages = yield client.messagesFind("Foo");
        console.log("Messages");
        console.log("\tIndex:", messages.index);
        console.log("\tMax Results:", messages.maxResults);
        console.log("\tCount:", messages.count);
        console.log("\tMessage Ids:", messages.messageIds);
        console.log();
        const children = yield client.messageChildren(tips.tip1MessageId);
        console.log("Children");
        console.log("\tMessage Id:", children.messageId);
        console.log("\tMax Results:", children.maxResults);
        console.log("\tCount:", children.count);
        console.log("\tChildren Message Ids:", children.childrenMessageIds);
        console.log();
        const milestone = yield client.milestone(info.latestMilestoneIndex);
        console.log("Milestone");
        console.log("\tMilestone Index:", milestone.milestoneIndex);
        console.log("\tMessage Id:", milestone.messageId);
        console.log("\tTimestamp:", milestone.timestamp);
        console.log();
        const output = yield client.output("00000000000000000000000000000000000000000000000000000000000000000000");
        console.log("Output");
        console.log("\tMessage Id:", output.messageId);
        console.log("\tTransaction Id:", output.transactionId);
        console.log("\tOutput Index:", output.outputIndex);
        console.log("\tIs Spent:", output.isSpent);
        iota2_js_1.logOutput("\t", output.output);
        console.log();
        const address = yield client.address(output.output.address.address);
        console.log("Address");
        console.log("\tAddress:", address.address);
        console.log("\tMax Results:", address.maxResults);
        console.log("\tCount:", address.count);
        console.log("\tBalance:", address.balance);
        console.log();
        const addressOutputs = yield client.addressOutputs(output.output.address.address);
        console.log("Address Outputs");
        console.log("\tAddress:", addressOutputs.address);
        console.log("\tMax Results:", addressOutputs.maxResults);
        console.log("\tCount:", addressOutputs.count);
        console.log("\tOutput Ids:", addressOutputs.outputIds);
        console.log();
    });
}
run()
    .then(() => console.log("Done"))
    .catch((err) => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBOEg7QUFFOUgsTUFBTSxZQUFZLEdBQUcsd0JBQXdCLENBQUM7QUFFOUMsU0FBZSxHQUFHOztRQUNkLE1BQU0sTUFBTSxHQUFHLElBQUksMkJBQWdCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFbEQsTUFBTSxNQUFNLEdBQUcsTUFBTSxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUQsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRWQsTUFBTSxJQUFJLEdBQUcsTUFBTSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM3QyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDN0MsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUNwRSxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2xFLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ25ELE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFZCxNQUFNLElBQUksR0FBRyxNQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3ZELE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3ZELE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUVkLE1BQU0sYUFBYSxHQUFhO1lBQzVCLGdCQUFnQixFQUFFLElBQUksQ0FBQyxhQUFhO1lBQ3BDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxhQUFhO1lBQ3BDLE9BQU8sRUFBRTtnQkFDTCxJQUFJLEVBQUUsQ0FBQztnQkFDUCxLQUFLLEVBQUUsS0FBSztnQkFDWixJQUFJLEVBQUUsb0JBQVMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO2FBQ3BDO1NBQ0osQ0FBQztRQUVGLE1BQU0sU0FBUyxHQUFHLE1BQU0sTUFBTSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM1RCxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDdkMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRWQsTUFBTSxPQUFPLEdBQUcsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hELE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDM0IscUJBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDeEIsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRWQsTUFBTSxlQUFlLEdBQUcsTUFBTSxNQUFNLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hFLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUN4RSxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3hFLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwRCxPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxFQUFFLGVBQWUsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1FBQzVGLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEVBQUUsZUFBZSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDL0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxlQUFlLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDaEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDbEUsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRWQsTUFBTSxVQUFVLEdBQUcsTUFBTSxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RELE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsb0JBQVMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUN4RCxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDZCxNQUFNLE9BQU8sR0FBRyw2QkFBa0IsQ0FBQyxJQUFJLHFCQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUMvRCxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDL0IscUJBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDeEIsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRWQsTUFBTSxRQUFRLEdBQUcsTUFBTSxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xELE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ25ELE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNuRCxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFZCxNQUFNLFFBQVEsR0FBRyxNQUFNLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2xFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pELE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ25ELE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixFQUFFLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3BFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUVkLE1BQU0sU0FBUyxHQUFHLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUNwRSxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVELE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNsRCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakQsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRWQsTUFBTSxNQUFNLEdBQUcsTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLHNFQUFzRSxDQUFDLENBQUM7UUFDM0csT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDL0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLG9CQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQixPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFZCxNQUFNLE9BQU8sR0FBRyxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFZCxNQUFNLGNBQWMsR0FBRyxNQUFNLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsRCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN6RCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZELE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNsQixDQUFDO0NBQUE7QUFFRCxHQUFHLEVBQUU7S0FDQSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUMvQixLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyJ9