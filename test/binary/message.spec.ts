/* eslint-disable max-len */
import { deserializeMessage, serializeMessage } from "../../src/binary/message";
import { IIndexationPayload } from "../../src/models/IIndexationPayload";
import { IMilestonePayload } from "../../src/models/IMilestonePayload";
import { ISignatureUnlockBlock } from "../../src/models/ISignatureUnlockBlock";
import { ITransactionPayload } from "../../src/models/ITransactionPayload";
import { Converter } from "../../src/utils/converter";
import { ReadStream } from "../../src/utils/readStream";
import { WriteStream } from "../../src/utils/writeStream";

describe("Binary Message", () => {
    test("Can fail with underflow min", () => {
        const bytes = Uint8Array.from([]);
        expect(() => deserializeMessage(new ReadStream(bytes))).toThrow("is less");
    });

    test("Can fail with underflow max", () => {
        const bytes = new Uint8Array(76);
        expect(() => deserializeMessage(new ReadStream(bytes))).toThrow("is less");
    });

    test("Can fail with invalid version number", () => {
        const bytes = new Uint8Array(77);
        bytes[0] = 0;
        expect(() => deserializeMessage(new ReadStream(bytes))).toThrow("Unsupported message version number");
    });

    test("Can succeed with valid data", () => {
        const buffer = Buffer.alloc(87);
        buffer.writeUInt8(1, 0);
        buffer.write("4594267ca0446739d5e4c6dcf060d640aafb68ab929aa2bb8c2bcdce8b3bc89e", 1, "hex");
        buffer.write("6901c7b37adbddfc3fc170773632489f263af4decc9ed5813c849a07319ecd73", 33, "hex");
        buffer.writeUInt32LE(8, 65); // Payload length
        buffer.writeUInt32LE(2, 69); // Payload type
        buffer.writeUInt16LE(0, 73); // Indexation index length
        buffer.writeUInt32LE(0, 75); // Indexation data length
        buffer.writeBigUInt64LE(BigInt(0), 79); // Nonce
        const message = deserializeMessage(new ReadStream(buffer));
        expect(message.version).toEqual(1);
        expect(message.parent1MessageId).toEqual("4594267ca0446739d5e4c6dcf060d640aafb68ab929aa2bb8c2bcdce8b3bc89e");
        expect(message.parent2MessageId).toEqual("6901c7b37adbddfc3fc170773632489f263af4decc9ed5813c849a07319ecd73");
        expect(message.nonce).toEqual("0");
    });

    test("Can fail with additional data", () => {
        const buffer = Buffer.alloc(88);
        buffer.writeUInt8(1, 0);
        buffer.write("4594267ca0446739d5e4c6dcf060d640aafb68ab929aa2bb8c2bcdce8b3bc89e", 1, "hex");
        buffer.write("6901c7b37adbddfc3fc170773632489f263af4decc9ed5813c849a07319ecd73", 33, "hex");
        buffer.writeUInt32LE(8, 65); // Payload length
        buffer.writeUInt32LE(2, 69); // Payload type
        buffer.writeUInt16LE(0, 73); // Indexation index length
        buffer.writeUInt32LE(0, 75); // Indexation data length
        buffer.writeBigUInt64LE(BigInt(0), 79); // Nonce
        expect(() => deserializeMessage(new ReadStream(buffer))).toThrow("unused data");
    });

    test("Can succeed with milestone data", () => {
        const hex = "013e2a4764f6bcc8af3c2dcea641d8cc59c7cb86a94aafa36d47e3a9542428e04b10cb6c461f01aa2da31b1f67ec6519ae5e39f8713191d7cf75a2e362d8f407f69400000001000000dc05000000000000dc41845f00000000786a02f742015903c6c6fd852552d272912f4740e15847618a86e217f71f5419d25e1031afee585313896444934eb04b903a685b1448b755d56f701afe9be2ce012c59d43952bda7ca60d3c2288ebc00703b4b60c928d277382cad5f57b02a90825f2d3a8509d6594498e0488f086d8fa3f13d9636d20e759eb5806ffe663bac0d0000000000000000";
        const message = deserializeMessage(new ReadStream(Converter.hexToBytes(hex)));
        expect(message.version).toEqual(1);
        expect(message.parent1MessageId).toEqual("3e2a4764f6bcc8af3c2dcea641d8cc59c7cb86a94aafa36d47e3a9542428e04b");
        expect(message.parent2MessageId).toEqual("10cb6c461f01aa2da31b1f67ec6519ae5e39f8713191d7cf75a2e362d8f407f6");
        const payload = message.payload as IMilestonePayload;
        expect(payload.type).toEqual(1);
        expect(payload.index).toEqual(1500);
        expect(payload.timestamp).toEqual(1602503132);
        expect(payload.inclusionMerkleProof).toEqual("786a02f742015903c6c6fd852552d272912f4740e15847618a86e217f71f5419d25e1031afee585313896444934eb04b903a685b1448b755d56f701afe9be2ce");
        expect(payload.signatures.length).toEqual(1);
        expect(payload.signatures[0]).toEqual("2c59d43952bda7ca60d3c2288ebc00703b4b60c928d277382cad5f57b02a90825f2d3a8509d6594498e0488f086d8fa3f13d9636d20e759eb5806ffe663bac0d");
        expect(message.nonce).toEqual("0");
    });

    test("Can succeed with indexation data", () => {
        const hex = "019eca185fb38d44471b0c396c6c147c3a2a4c590dc5dac6431b698c58dcce449a26b9c0077037bf198b35306408e4a9b50430bdf0ea54f722cc4e7ce4f7ffba5e10000000020000000300466f6f030000004261720000000000000000";
        const message = deserializeMessage(new ReadStream(Converter.hexToBytes(hex)));
        expect(message.version).toEqual(1);
        expect(message.parent1MessageId).toEqual("9eca185fb38d44471b0c396c6c147c3a2a4c590dc5dac6431b698c58dcce449a");
        expect(message.parent2MessageId).toEqual("26b9c0077037bf198b35306408e4a9b50430bdf0ea54f722cc4e7ce4f7ffba5e");
        const payload = message.payload as IIndexationPayload;
        expect(payload.type).toEqual(2);
        expect(payload.index).toEqual("Foo");
        expect(Converter.hexToAscii(payload.data)).toEqual("Bar");
        expect(message.nonce).toEqual("0");
    });

    test("Can succeed with actual milestone data", () => {
        const hex = "013e2a4764f6bcc8af3c2dcea641d8cc59c7cb86a94aafa36d47e3a9542428e04b10cb6c461f01aa2da31b1f67ec6519ae5e39f8713191d7cf75a2e362d8f407f69500000001000000dc05000000000000dc41845f00000000786a02f742015903c6c6fd852552d272912f4740e15847618a86e217f71f5419d25e1031afee585313896444934eb04b903a685b1448b755d56f701afe9be2ce012c59d43952bda7ca60d3c2288ebc00703b4b60c928d277382cad5f57b02a90825f2d3a8509d6594498e0488f086d8fa3f13d9636d20e759eb5806ffe663bac0d0000000000000000";
        const message = deserializeMessage(new ReadStream(Converter.hexToBytes(hex)));
        const writeStream = new WriteStream();
        serializeMessage(writeStream, message);

        const finalHex = writeStream.finalHex();
        expect(hex).toEqual(finalHex);
    });

    test("Can succeed with actual indexation data", () => {
        const hex = "019eca185fb38d44471b0c396c6c147c3a2a4c590dc5dac6431b698c58dcce449a26b9c0077037bf198b35306408e4a9b50430bdf0ea54f722cc4e7ce4f7ffba5e10000000020000000300466f6f030000004261720000000000000000";
        const message = deserializeMessage(new ReadStream(Converter.hexToBytes(hex)));
        expect(message.version).toEqual(1);
        expect(message.parent1MessageId).toEqual("9eca185fb38d44471b0c396c6c147c3a2a4c590dc5dac6431b698c58dcce449a");
        expect(message.parent2MessageId).toEqual("26b9c0077037bf198b35306408e4a9b50430bdf0ea54f722cc4e7ce4f7ffba5e");
        const payload = message.payload as IIndexationPayload;
        expect(payload.type).toEqual(2);
        expect(payload.index).toEqual("Foo");
        expect(Converter.hexToAscii(payload.data)).toEqual("Bar");
        expect(message.nonce).toEqual("0");
    });

    test("Can succeed with actual transaction data", () => {
        const hex = "014ccb0843016072b0d0d1c4265bc808ef8a80ae4ad70e10d6016e248e4e047235aac2a777c07473522122629124d7df647b2ea712386707e3687dd3a47cbdfa55f800000000000000000100002367ec318426c9f5d1115a6ac96f6c3cd2e53443713e0b63f0c266cbda7444740100020000013eb1ed78d420c8318972b8b0839420f502b25356270a48a430cb55a5e323f72364000000000000000001625d17d4a4b21cd5edeb57544b9d2d66ce22985fb61f17d1d7cae958d0068618f95c2dd3f7df090010000000020000000300666f6f030000006261720100000114fe414a9eccf9589b38c7c89a2fa5921b4b170ebefc04b6a812b3d02068cfd73163a90017ed5fe9530f52fb0d30836a453a37204f4d59e03012d82e0a946f31c930ac54f4a35aef9578b9dec9c12887404be353c5f7ebd88bcbefcc78e29c050000000000000000";
        const message = deserializeMessage(new ReadStream(Converter.hexToBytes(hex)));
        expect(message.version).toEqual(1);
        expect(message.parent1MessageId).toEqual("4ccb0843016072b0d0d1c4265bc808ef8a80ae4ad70e10d6016e248e4e047235");
        expect(message.parent2MessageId).toEqual("aac2a777c07473522122629124d7df647b2ea712386707e3687dd3a47cbdfa55");
        const payload = message.payload as ITransactionPayload;
        expect(payload.type).toEqual(0);
        expect(payload.essence.type).toEqual(0);
        expect(payload.essence.inputs.length).toEqual(1);
        expect(payload.essence.inputs[0].type).toEqual(0);
        expect(payload.essence.inputs[0].transactionId).toEqual("2367ec318426c9f5d1115a6ac96f6c3cd2e53443713e0b63f0c266cbda744474");
        expect(payload.essence.inputs[0].transactionOutputIndex).toEqual(1);
        expect(payload.essence.outputs.length).toEqual(2);
        expect(payload.essence.outputs[0].type).toEqual(0);
        expect(payload.essence.outputs[0].address.type).toEqual(1);
        expect(payload.essence.outputs[0].address.address).toEqual("3eb1ed78d420c8318972b8b0839420f502b25356270a48a430cb55a5e323f723");
        expect(payload.essence.outputs[0].amount).toEqual(100);
        expect(payload.essence.outputs[1].type).toEqual(0);
        expect(payload.essence.outputs[1].address.type).toEqual(1);
        expect(payload.essence.outputs[1].address.address).toEqual("625d17d4a4b21cd5edeb57544b9d2d66ce22985fb61f17d1d7cae958d0068618");
        expect(payload.essence.outputs[1].amount).toEqual(2779530283277561);
        expect(payload.unlockBlocks.length).toEqual(1);
        expect(payload.unlockBlocks[0].type).toEqual(0);
        const unlockBlock = payload.unlockBlocks[0] as ISignatureUnlockBlock;
        expect(unlockBlock.signature.publicKey).toEqual("14fe414a9eccf9589b38c7c89a2fa5921b4b170ebefc04b6a812b3d02068cfd7");
        expect(unlockBlock.signature.signature).toEqual("3163a90017ed5fe9530f52fb0d30836a453a37204f4d59e03012d82e0a946f31c930ac54f4a35aef9578b9dec9c12887404be353c5f7ebd88bcbefcc78e29c05");
        expect(message.nonce).toEqual("0");
    });
});
