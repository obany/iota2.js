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
exports.buildTransactionPayload = exports.sendAdvanced = void 0;
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
        var transactionPayload, tips, message, messageId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transactionPayload = buildTransactionPayload(inputsAndSignatureKeyPairs, outputs, indexationKey, indexationData);
                    return [4 /*yield*/, client.tips()];
                case 1:
                    tips = _a.sent();
                    message = {
                        parent1MessageId: tips.tip1MessageId,
                        parent2MessageId: tips.tip2MessageId,
                        payload: transactionPayload
                    };
                    return [4 /*yield*/, client.messageSubmit(message)];
                case 2:
                    messageId = _a.sent();
                    return [2 /*return*/, {
                            messageId: messageId,
                            message: message
                        }];
            }
        });
    });
}
exports.sendAdvanced = sendAdvanced;
/**
 * Build a transaction payload.
 * @param inputsAndSignatureKeyPairs The inputs with the signature key pairs needed to sign transfers.
 * @param outputs The outputs to send.
 * @param indexationKey Optional indexation key.
 * @param indexationData Optional index data.
 * @returns The transaction payload.
 */
function buildTransactionPayload(inputsAndSignatureKeyPairs, outputs, indexationKey, indexationData) {
    if (!inputsAndSignatureKeyPairs || inputsAndSignatureKeyPairs.length === 0) {
        throw new Error("You must specify some inputs");
    }
    if (!outputs || outputs.length === 0) {
        throw new Error("You must specify some outputs");
    }
    var outputsWithSerialization = [];
    for (var _i = 0, outputs_1 = outputs; _i < outputs_1.length; _i++) {
        var output = outputs_1[_i];
        var sigLockedOutput = {
            type: 0,
            address: {
                type: 1,
                address: output.address
            },
            amount: output.amount
        };
        var writeStream = new writeStream_1.WriteStream();
        output_1.serializeOutput(writeStream, sigLockedOutput);
        outputsWithSerialization.push({
            output: sigLockedOutput,
            serialized: writeStream.finalHex()
        });
    }
    var inputsAndSignatureKeyPairsSerialized = inputsAndSignatureKeyPairs.map(function (i) {
        var writeStream = new writeStream_1.WriteStream();
        input_1.serializeInput(writeStream, i.input);
        return __assign(__assign({}, i), { serialized: writeStream.finalHex() });
    });
    // Lexigraphically sort the inputs and outputs
    var sortedInputs = inputsAndSignatureKeyPairsSerialized.sort(function (a, b) { return a.serialized.localeCompare(b.serialized); });
    var sortedOutputs = outputsWithSerialization.sort(function (a, b) { return a.serialized.localeCompare(b.serialized); });
    var transactionEssence = {
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
    var binaryEssence = new writeStream_1.WriteStream();
    transaction_1.serializeTransactionEssence(binaryEssence, transactionEssence);
    var essenceFinal = binaryEssence.finalBytes();
    // Create the unlock blocks
    var unlockBlocks = [];
    var addressToUnlockBlock = {};
    for (var _a = 0, sortedInputs_1 = sortedInputs; _a < sortedInputs_1.length; _a++) {
        var input = sortedInputs_1[_a];
        var hexInputAddressPublic = converter_1.Converter.bytesToHex(input.addressKeyPair.publicKey);
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
    var transactionPayload = {
        type: 0,
        essence: transactionEssence,
        unlockBlocks: unlockBlocks
    };
    return transactionPayload;
}
exports.buildTransactionPayload = buildTransactionPayload;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZEFkdmFuY2VkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2hpZ2hMZXZlbC9zZW5kQWR2YW5jZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBaUQ7QUFDakQsMkNBQW1EO0FBQ25ELHFEQUFvRTtBQUNwRSw2Q0FBNEM7QUFVNUMsZ0RBQStDO0FBQy9DLG9EQUFtRDtBQUVuRDs7Ozs7Ozs7R0FRRztBQUNILFNBQXNCLFlBQVksQ0FDOUIsTUFBZSxFQUNmLDBCQUdHLEVBQ0gsT0FBOEMsRUFDOUMsYUFBc0IsRUFDdEIsY0FBMkI7Ozs7OztvQkFJckIsa0JBQWtCLEdBQUcsdUJBQXVCLENBQzlDLDBCQUEwQixFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsY0FBYyxDQUFDLENBQUM7b0JBRTNELHFCQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBQTs7b0JBQTFCLElBQUksR0FBRyxTQUFtQjtvQkFFMUIsT0FBTyxHQUFhO3dCQUN0QixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsYUFBYTt3QkFDcEMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGFBQWE7d0JBQ3BDLE9BQU8sRUFBRSxrQkFBa0I7cUJBQzlCLENBQUM7b0JBRWdCLHFCQUFNLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEVBQUE7O29CQUEvQyxTQUFTLEdBQUcsU0FBbUM7b0JBRXJELHNCQUFPOzRCQUNILFNBQVMsV0FBQTs0QkFDVCxPQUFPLFNBQUE7eUJBQ1YsRUFBQzs7OztDQUNMO0FBN0JELG9DQTZCQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCxTQUFnQix1QkFBdUIsQ0FDbkMsMEJBR0csRUFDSCxPQUE4QyxFQUM5QyxhQUFzQixFQUN0QixjQUEyQjtJQUMzQixJQUFJLENBQUMsMEJBQTBCLElBQUksMEJBQTBCLENBQUMsTUFBTSxLQUFLLENBQUMsRUFB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