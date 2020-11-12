"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeIndexationPayload = exports.deserializeIndexationPayload = exports.serializeMilestonePayload = exports.deserializeMilestonePayload = exports.serializeTransactionPayload = exports.deserializeTransactionPayload = exports.serializePayload = exports.deserializePayload = exports.MIN_TRANSACTION_PAYLOAD_LENGTH = exports.MIN_INDEXATION_PAYLOAD_LENGTH = exports.MIN_MILESTONE_PAYLOAD_LENGTH = exports.MIN_PAYLOAD_LENGTH = void 0;
var ed25519_1 = require("../crypto/ed25519");
var common_1 = require("./common");
var transaction_1 = require("./transaction");
var unlockBlock_1 = require("./unlockBlock");
exports.MIN_PAYLOAD_LENGTH = common_1.TYPE_LENGTH;
exports.MIN_MILESTONE_PAYLOAD_LENGTH = exports.MIN_PAYLOAD_LENGTH + common_1.UINT32_SIZE + common_1.UINT64_SIZE +
    common_1.MESSAGE_ID_LENGTH + common_1.MESSAGE_ID_LENGTH + common_1.MERKLE_PROOF_LENGTH +
    common_1.BYTE_SIZE + ed25519_1.Ed25519.PUBLIC_KEY_SIZE +
    common_1.BYTE_SIZE + ed25519_1.Ed25519.SIGNATURE_SIZE;
exports.MIN_INDEXATION_PAYLOAD_LENGTH = exports.MIN_PAYLOAD_LENGTH + common_1.STRING_LENGTH + common_1.STRING_LENGTH;
exports.MIN_TRANSACTION_PAYLOAD_LENGTH = exports.MIN_PAYLOAD_LENGTH + common_1.UINT32_SIZE;
/**
 * Deserialize the payload from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
function deserializePayload(readStream) {
    if (!readStream.hasRemaining(exports.MIN_PAYLOAD_LENGTH)) {
        throw new Error("Payload data is " + readStream.length() + " in length which is less than the minimimum size required of " + exports.MIN_PAYLOAD_LENGTH);
    }
    var payloadLength = readStream.readUInt32("payload.length");
    if (!readStream.hasRemaining(payloadLength)) {
        throw new Error("Payload length " + payloadLength + " exceeds the remaining data " + readStream.unused());
    }
    var payload;
    if (payloadLength > 0) {
        var payloadType = readStream.readUInt32("payload.type", false);
        if (payloadType === 0) {
            payload = deserializeTransactionPayload(readStream);
        }
        else if (payloadType === 1) {
            payload = deserializeMilestonePayload(readStream);
        }
        else if (payloadType === 2) {
            payload = deserializeIndexationPayload(readStream);
        }
        else {
            throw new Error("Unrecognized payload type " + payloadType);
        }
    }
    return payload;
}
exports.deserializePayload = deserializePayload;
/**
 * Serialize the payload essence to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
function serializePayload(writeStream, object) {
    // Store the location for the payload length and write 0
    // we will rewind and fill in once the size of the payload is known
    var payloadLengthWriteIndex = writeStream.getWriteIndex();
    writeStream.writeUInt32("payload.length", 0);
    if (!object) {
        // No other data to write
    }
    else if (object.type === 0) {
        serializeTransactionPayload(writeStream, object);
    }
    else if (object.type === 1) {
        serializeMilestonePayload(writeStream, object);
    }
    else if (object.type === 2) {
        serializeIndexationPayload(writeStream, object);
    }
    else {
        throw new Error("Unrecognized transaction type " + object.type);
    }
    var endOfPayloadWriteIndex = writeStream.getWriteIndex();
    writeStream.setWriteIndex(payloadLengthWriteIndex);
    writeStream.writeUInt32("payload.length", endOfPayloadWriteIndex - payloadLengthWriteIndex - common_1.UINT32_SIZE);
    writeStream.setWriteIndex(endOfPayloadWriteIndex);
}
exports.serializePayload = serializePayload;
/**
 * Deserialize the transaction payload from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
function deserializeTransactionPayload(readStream) {
    if (!readStream.hasRemaining(exports.MIN_TRANSACTION_PAYLOAD_LENGTH)) {
        throw new Error("Transaction Payload data is " + readStream.length() + " in length which is less than the minimimum size required of " + exports.MIN_TRANSACTION_PAYLOAD_LENGTH);
    }
    var type = readStream.readUInt32("payloadTransaction.type");
    if (type !== 0) {
        throw new Error("Type mismatch in payloadTransaction " + type);
    }
    var essenceType = readStream.readByte("payloadTransaction.essenceType", false);
    var essence;
    var unlockBlocks;
    if (essenceType === 0) {
        essence = transaction_1.deserializeTransactionEssence(readStream);
        unlockBlocks = unlockBlock_1.deserializeUnlockBlocks(readStream);
    }
    else {
        throw new Error("Unrecognized transaction essence type " + type);
    }
    return {
        type: type,
        essence: essence,
        unlockBlocks: unlockBlocks
    };
}
exports.deserializeTransactionPayload = deserializeTransactionPayload;
/**
 * Serialize the transaction payload essence to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
function serializeTransactionPayload(writeStream, object) {
    writeStream.writeUInt32("payloadMilestone.type", object.type);
    if (object.type === 0) {
        transaction_1.serializeTransactionEssence(writeStream, object.essence);
        unlockBlock_1.serializeUnlockBlocks(writeStream, object.unlockBlocks);
    }
    else {
        throw new Error("Unrecognized transaction type " + object.type);
    }
}
exports.serializeTransactionPayload = serializeTransactionPayload;
/**
 * Deserialize the milestone payload from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
function deserializeMilestonePayload(readStream) {
    if (!readStream.hasRemaining(exports.MIN_MILESTONE_PAYLOAD_LENGTH)) {
        throw new Error("Milestone Payload data is " + readStream.length() + " in length which is less than the minimimum size required of " + exports.MIN_MILESTONE_PAYLOAD_LENGTH);
    }
    var type = readStream.readUInt32("payloadMilestone.type");
    if (type !== 1) {
        throw new Error("Type mismatch in payloadMilestone " + type);
    }
    var index = readStream.readUInt32("payloadMilestone.index");
    var timestamp = readStream.readUInt64("payloadMilestone.timestamp");
    var parent1 = readStream.readFixedHex("payloadMilestone.parent1", common_1.MESSAGE_ID_LENGTH);
    var parent2 = readStream.readFixedHex("payloadMilestone.parent2", common_1.MESSAGE_ID_LENGTH);
    var inclusionMerkleProof = readStream.readFixedHex("payloadMilestone.inclusionMerkleProof", common_1.MERKLE_PROOF_LENGTH);
    var publicKeysCount = readStream.readByte("payloadMilestone.publicKeysCount");
    var publicKeys = [];
    for (var i = 0; i < publicKeysCount; i++) {
        publicKeys.push(readStream.readFixedHex("payloadMilestone.publicKey", ed25519_1.Ed25519.PUBLIC_KEY_SIZE));
    }
    var signaturesCount = readStream.readByte("payloadMilestone.signaturesCount");
    var signatures = [];
    for (var i = 0; i < signaturesCount; i++) {
        signatures.push(readStream.readFixedHex("payloadMilestone.signature", ed25519_1.Ed25519.SIGNATURE_SIZE));
    }
    return {
        type: type,
        index: index,
        timestamp: Number(timestamp),
        parent1: parent1,
        parent2: parent2,
        inclusionMerkleProof: inclusionMerkleProof,
        publicKeys: publicKeys,
        signatures: signatures
    };
}
exports.deserializeMilestonePayload = deserializeMilestonePayload;
/**
 * Serialize the milestone payload essence to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
function serializeMilestonePayload(writeStream, object) {
    writeStream.writeUInt32("payloadMilestone.type", object.type);
    writeStream.writeUInt32("payloadMilestone.index", object.index);
    writeStream.writeUInt64("payloadMilestone.timestamp", BigInt(object.timestamp));
    writeStream.writeFixedHex("payloadMilestone.parent1", common_1.MESSAGE_ID_LENGTH, object.parent1);
    writeStream.writeFixedHex("payloadMilestone.parent2", common_1.MESSAGE_ID_LENGTH, object.parent2);
    writeStream.writeFixedHex("payloadMilestone.inclusionMerkleProof", common_1.MERKLE_PROOF_LENGTH, object.inclusionMerkleProof);
    writeStream.writeByte("payloadMilestone.publicKeysCount", object.publicKeys.length);
    for (var i = 0; i < object.publicKeys.length; i++) {
        writeStream.writeFixedHex("payloadMilestone.publicKey", ed25519_1.Ed25519.PUBLIC_KEY_SIZE, object.publicKeys[i]);
    }
    writeStream.writeByte("payloadMilestone.signaturesCount", object.signatures.length);
    for (var i = 0; i < object.signatures.length; i++) {
        writeStream.writeFixedHex("payloadMilestone.signature", ed25519_1.Ed25519.SIGNATURE_SIZE, object.signatures[i]);
    }
}
exports.serializeMilestonePayload = serializeMilestonePayload;
/**
 * Deserialize the indexation payload from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
function deserializeIndexationPayload(readStream) {
    if (!readStream.hasRemaining(exports.MIN_INDEXATION_PAYLOAD_LENGTH)) {
        throw new Error("Indexation Payload data is " + readStream.length() + " in length which is less than the minimimum size required of " + exports.MIN_INDEXATION_PAYLOAD_LENGTH);
    }
    var type = readStream.readUInt32("payloadIndexation.type");
    if (type !== 2) {
        throw new Error("Type mismatch in payloadIndexation " + type);
    }
    var index = readStream.readString("payloadIndexation.index");
    var dataLength = readStream.readUInt32("payloadIndexation.dataLength");
    var data = readStream.readFixedHex("payloadIndexation.data", dataLength);
    return {
        type: 2,
        index: index,
        data: data
    };
}
exports.deserializeIndexationPayload = deserializeIndexationPayload;
/**
 * Serialize the indexation payload essence to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
function serializeIndexationPayload(writeStream, object) {
    writeStream.writeUInt32("payloadIndexation.type", object.type);
    writeStream.writeString("payloadIndexation.index", object.index);
    writeStream.writeUInt32("payloadIndexation.dataLength", object.data.length / 2);
    writeStream.writeFixedHex("payloadIndexation.data", object.data.length / 2, object.data);
}
exports.serializeIndexationPayload = serializeIndexationPayload;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF5bG9hZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iaW5hcnkvcGF5bG9hZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBNEM7QUFPNUMsbUNBQW1JO0FBQ25JLDZDQUEyRjtBQUMzRiw2Q0FBK0U7QUFFbEUsUUFBQSxrQkFBa0IsR0FBVyxvQkFBVyxDQUFDO0FBQ3pDLFFBQUEsNEJBQTRCLEdBQVcsMEJBQWtCLEdBQUcsb0JBQVcsR0FBRyxvQkFBVztJQUM5RiwwQkFBaUIsR0FBRywwQkFBaUIsR0FBRyw0QkFBbUI7SUFDM0Qsa0JBQVMsR0FBRyxpQkFBTyxDQUFDLGVBQWU7SUFDbkMsa0JBQVMsR0FBRyxpQkFBTyxDQUFDLGNBQWMsQ0FBQztBQUMxQixRQUFBLDZCQUE2QixHQUFXLDBCQUFrQixHQUFHLHNCQUFhLEdBQUcsc0JBQWEsQ0FBQztBQUMzRixRQUFBLDhCQUE4QixHQUFXLDBCQUFrQixHQUFHLG9CQUFXLENBQUM7QUFFdkY7Ozs7R0FJRztBQUNILFNBQWdCLGtCQUFrQixDQUFDLFVBQXNCO0lBRXJELElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLDBCQUFrQixDQUFDLEVBQUU7UUFDOUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBbUIsVUFBVSxDQUFDLE1BQU0sRUFBRSxxRUFDYywwQkFBb0IsQ0FBQyxDQUFDO0tBQzdGO0lBRUQsSUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBRTlELElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxFQUFFO1FBQ3pDLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQWtCLGFBQWEsb0NBQ1osVUFBVSxDQUFDLE1BQU0sRUFBSSxDQUFDLENBQUM7S0FDN0Q7SUFFRCxJQUFJLE9BQWlGLENBQUM7SUFFdEYsSUFBSSxhQUFhLEdBQUcsQ0FBQyxFQUFFO1FBQ25CLElBQU0sV0FBVyxH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