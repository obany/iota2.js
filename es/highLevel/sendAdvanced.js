"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAdvanced = void 0;
var input_1 = require("../binary/input");
var output_1 = require("../binary/output");
var transaction_1 = require("../binary/transaction");
var ed25519_1 = require("../crypto/ed25519");
var converter_1 = require("../utils/converter");
var writeStream_1 = require("../utils/writeStream");
/**
 * Send a transfer from the balance on the seed.
 * @param client The client to send the transfer with.
 * @param inputsAndSignatureKeyPairs The inputs with the signature key pairs needed to sign transfers.
 * @param outputs The outputs to send.
 * @param indexationKey Optional indexation key.
 * @param indexationData Optional index data.
 * @returns The id of the message created and the remainder address if one was needed.
 */
function sendAdvanced(client, inputsAndSignatureKeyPairs, outputs, indexationKey, indexationData) {
    return __awaiter(this, void 0, void 0, function () {
        var outputsWithSerialization, _i, outputs_1, output, sigLockedOutput, writeStream, inputsAndSignatureKeyPairsSerialized, sortedInputs, sortedOutputs, transactionEssence, binaryEssence, essenceFinal, unlockBlocks, addressToUnlockBlock, _a, sortedInputs_1, input, hexInputAddressPublic, transactionPayload, tips, message, messageId;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!inputsAndSignatureKeyPairs || inputsAndSignatureKeyPairs.length === 0) {
                        throw new Error("You must specify some inputs");
                    }
                    if (!outputs || outputs.length === 0) {
                        throw new Error("You must specify some outputs");
                    }
                    outputsWithSerialization = [];
                    for (_i = 0, outputs_1 = outputs; _i < outputs_1.length; _i++) {
                        output = outputs_1[_i];
                        sigLockedOutput = {
                            type: 0,
                            address: {
                                type: 1,
                                address: output.address
                            },
                            amount: output.amount
                        };
                        writeStream = new writeStream_1.WriteStream();
                        output_1.serializeOutput(writeStream, sigLockedOutput);
                        outputsWithSerialization.push({
                            output: sigLockedOutput,
                            serialized: writeStream.finalHex()
                        });
                    }
                    inputsAndSignatureKeyPairsSerialized = inputsAndSignatureKeyPairs.map(function (i) {
                        var writeStream = new writeStream_1.WriteStream();
                        input_1.serializeInput(writeStream, i.input);
                        return __assign(__assign({}, i), { serialized: writeStream.finalHex() });
                    });
                    sortedInputs = inputsAndSignatureKeyPairsSerialized.sort(function (a, b) { return a.serialized.localeCompare(b.serialized); });
                    sortedOutputs = outputsWithSerialization.sort(function (a, b) { return a.serialized.localeCompare(b.serialized); });
                    transactionEssence = {
                        type: 0,
                        inputs: sortedInputs.map(function (i) { return i.input; }),
                        outputs: sortedOutputs.map(function (o) { return o.output; }),
                        payload: indexationKey && indexationData
                            ? {
                                type: 2,
                                index: indexationKey,
                                data: converter_1.Converter.bytesToHex(indexationData)
                            }
                            : undefined
                    };
                    binaryEssence = new writeStream_1.WriteStream();
                    transaction_1.serializeTransactionEssence(binaryEssence, transactionEssence);
                    essenceFinal = binaryEssence.finalBytes();
                    unlockBlocks = [];
                    addressToUnlockBlock = {};
                    for (_a = 0, sortedInputs_1 = sortedInputs; _a < sortedInputs_1.length; _a++) {
                        input = sortedInputs_1[_a];
                        hexInputAddressPublic = converter_1.Converter.bytesToHex(input.addressKeyPair.publicKey);
                        if (addressToUnlockBlock[hexInputAddressPublic]) {
                            unlockBlocks.push({
                                type: 1,
                                reference: addressToUnlockBlock[hexInputAddressPublic].unlockIndex
                            });
                        }
                        else {
                            unlockBlocks.push({
                                type: 0,
                                signature: {
                                    type: 1,
                                    publicKey: hexInputAddressPublic,
                                    signature: converter_1.Converter.bytesToHex(ed25519_1.Ed25519.sign(input.addressKeyPair.privateKey, essenceFinal))
                                }
                            });
                            addressToUnlockBlock[hexInputAddressPublic] = {
                                keyPair: input.addressKeyPair,
                                unlockIndex: unlockBlocks.length - 1
                            };
                        }
                    }
                    transactionPayload = {
                        type: 0,
                        essence: transactionEssence,
                        unlockBlocks: unlockBlocks
                    };
                    return [4 /*yield*/, client.tips()];
                case 1:
                    tips = _b.sent();
                    message = {
                        version: 1,
                        parent1MessageId: tips.tip1MessageId,
                        parent2MessageId: tips.tip2MessageId,
                        payload: transactionPayload,
                        nonce: "0"
                    };
                    return [4 /*yield*/, client.messageSubmit(message)];
                case 2:
                    messageId = _b.sent();
                    return [2 /*return*/, {
                            messageId: messageId,
                            message: message
                        }];
            }
        });
    });
}
exports.sendAdvanced = sendAdvanced;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZEFkdmFuY2VkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2hpZ2hMZXZlbC9zZW5kQWR2YW5jZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBaUQ7QUFDakQsMkNBQW1EO0FBQ25ELHFEQUFvRTtBQUNwRSw2Q0FBNEM7QUFVNUMsZ0RBQStDO0FBQy9DLG9EQUFtRDtBQUVuRDs7Ozs7Ozs7R0FRRztBQUNILFNBQXNCLFlBQVksQ0FDOUIsTUFBZSxFQUNmLDBCQUdHLEVBQ0gsT0FBOEMsRUFDOUMsYUFBc0IsRUFDdEIsY0FBMkI7Ozs7OztvQkFJM0IsSUFBSSxDQUFDLDBCQUEwQixJQUFJLDBCQUEwQixDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7d0JBQ3hFLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztxQkFDbkQ7b0JBQ0QsSUFBSSxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTt3QkFDbEMsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO3FCQUNwRDtvQkFFSyx3QkFBd0IsR0FHeEIsRUFBRSxDQUFDO29CQUVULFdBQTRCLEVBQVAsbUJBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU8sRUFBRTt3QkFBbkIsTUFBTTt3QkFDUCxlQUFlLEdBQTJCOzRCQUM1QyxJQUFJLEVBQUUsQ0FBQzs0QkFDUCxPQUFPLEVBQUU7Z0NBQ0wsSUFBSSxFQUFFLENBQUM7Z0NBQ1AsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPOzZCQUMxQjs0QkFDRCxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07eUJBQ3hCLENBQUM7d0JBQ0ksV0FBVyxHQUFHLElBQUkseUJBQVcsRUFBRSxDQUFDO3dCQUN0Qyx3QkFBZSxDQUFDLFdBQVcsRUFBRSxlQUFlLENBQUMsQ0FBQzt3QkFD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