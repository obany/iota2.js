"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeMessage = exports.deserializeMessage = void 0;
var common_1 = require("./common");
var payload_1 = require("./payload");
var MIN_MESSAGE_LENGTH = common_1.BYTE_SIZE +
    (2 * common_1.MESSAGE_ID_LENGTH) +
    payload_1.MIN_PAYLOAD_LENGTH +
    common_1.UINT64_SIZE;
var EMPTY_MESSAGE_ID_HEX = "0".repeat(common_1.MESSAGE_ID_LENGTH * 2);
/**
 * Deserialize the message from binary.
 * @param readStream The message to deserialize.
 * @returns The deserialized message.
 */
function deserializeMessage(readStream) {
    if (!readStream.hasRemaining(MIN_MESSAGE_LENGTH)) {
        throw new Error("Message data is " + readStream.length() + " in length which is less than the minimimum size required of " + MIN_MESSAGE_LENGTH);
    }
    var version = readStream.readByte("message.version");
    if (version !== 1) {
        throw new Error("Unsupported message version number: " + version);
    }
    var parent1MessageId = readStream.readFixedHex("message.parent1MessageId", common_1.MESSAGE_ID_LENGTH);
    var parent2MessageId = readStream.readFixedHex("message.parent2MessageId", common_1.MESSAGE_ID_LENGTH);
    var payload = payload_1.deserializePayload(readStream);
    var nonce = readStream.readUInt64("message.nonce");
    var unused = readStream.unused();
    if (unused !== 0) {
        throw new Error("Message data length " + readStream.length() + " has unused data " + unused);
    }
    return {
        version: version,
        payload: payload,
        parent1MessageId: parent1MessageId,
        parent2MessageId: parent2MessageId,
        nonce: nonce.toString(10)
    };
}
exports.deserializeMessage = deserializeMessage;
/**
 * Serialize the message essence to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
function serializeMessage(writeStream, object) {
    var _a, _b, _c;
    writeStream.writeByte("message.version", object.version);
    writeStream.writeFixedHex("message.parent1MessageId", common_1.MESSAGE_ID_LENGTH, (_a = object.parent1MessageId) !== null && _a !== void 0 ? _a : EMPTY_MESSAGE_ID_HEX);
    writeStream.writeFixedHex("message.parent2MessageId", common_1.MESSAGE_ID_LENGTH, (_b = object.parent2MessageId) !== null && _b !== void 0 ? _b : EMPTY_MESSAGE_ID_HEX);
    payload_1.serializePayload(writeStream, object.payload);
    writeStream.writeUInt64("message.nonce", BigInt((_c = object.nonce) !== null && _c !== void 0 ? _c : 0));
}
exports.serializeMessage = serializeMessage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iaW5hcnkvbWVzc2FnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQSxtQ0FBcUU7QUFDckUscUNBQXFGO0FBRXJGLElBQU0sa0JBQWtCLEdBQVcsa0JBQVM7SUFDeEMsQ0FBQyxDQUFDLEdBQUcsMEJBQWlCLENBQUM7SUFDdkIsNEJBQWtCO0lBQ2xCLG9CQUFXLENBQUM7QUFFaEIsSUFBTSxvQkFBb0IsR0FBVyxHQUFHLENBQUMsTUFBTSxDQUFDLDBCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDO0FBRXZFOzs7O0dBSUc7QUFDSCxTQUFnQixrQkFBa0IsQ0FBQyxVQUFzQjtJQUNyRCxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFO1FBQzlDLE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQW1CLFVBQVUsQ0FBQyxNQUFNLEVBQUUscUVBQ2Msa0JBQW9CLENBQUMsQ0FBQztLQUM3RjtJQUVELElBQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUN2RCxJQUFJLE9BQU8sS0FBSyxDQUFDLEVBQUU7UUFDZixNQUFNLElBQUksS0FBSyxDQUFDLHlDQUF1QyxPQUFTLENBQUMsQ0FBQztLQUNyRTtJQUVELElBQU0sZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQywwQkFBMEIsRUFBRSwwQkFBaUIsQ0FBQyxDQUFDO0lBQ2hHLElBQU0sZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQywwQkFBMEIsRUFBRSwwQkFBaUIsQ0FBQyxDQUFDO0lBRWhHLElBQU0sT0FBTyxHQUFHLDRCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRS9DLElBQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUM7SUFFckQsSUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ25DLElBQUksTUFBTSxLQUFLLENBQUMsRUFBRTtRQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXVCLFVBQVUsQ0FBQyxNQUFNLEVBQUUseUJBQW9CLE1BQVEsQ0FBQyxDQUFDO0tBQzNGO0lBRUQsT0FBTztRQUNILE9BQU8sU0FBQTtRQUNQLE9BQU8sU0FBQTtRQUNQLGdCQUFnQixrQkFBQTtRQUNoQixnQkFBZ0Isa0JBQUE7UUFDaEIsS0FBSyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO0tBQzVCLENBQUM7QUFDTixDQUFDO0FBOUJELGdEQThCQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQixnQkFBZ0IsQ0FBQyxXQUF3QixFQUFFLE1BQWdCOztJQUN2RSxXQUFXLENBQUMsU0FBUyxDQUFDLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUV6RCxXQUFXLENBQUMsYUFBYSxDQUFDLDBCQUEwQixFQUNoRCwwQkFBaUIsUUFBRSxNQUFNLENBQUMsZ0JBQWdCLG1DQUFJLG9CQUFvQixDQUFDLENBQUM7SUFDeEUsV0FBVyxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsRUFDaEQsMEJBQWlCLFFBQUUsTUFBTSxDQUFDLGdCQUFnQixtQ0FBSSxvQkFBb0IsQ0FBQyxDQUFDO0lBRXhFLDBCQUFnQixDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFOUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxlQUFlLEVBQUUsTUFBTSxPQUFDLE1BQU0sQ0FBQyxLQUFLLG1DQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEUsQ0FBQztBQVhELDRDQVdDIn0=