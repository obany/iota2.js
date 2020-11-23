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
exports.MessageHelper = void 0;
var input_1 = require("../binary/input");
var output_1 = require("../binary/output");
var transaction_1 = require("../binary/transaction");
var ed25519_1 = require("../crypto/ed25519");
var ed25519Address_1 = require("../crypto/ed25519Address");
var converter_1 = require("./converter");
var writeStream_1 = require("./writeStream");
/**
 * Helper methods for messages.
 */
var MessageHelper = /** @class */ (function () {
    function MessageHelper() {
    }
    /**
     * Validate a transaction the message.
     * @param client The client for making API calls.
     * @param message The message to validate.
     * @returns The reasons why to message is not valid.
     */
    MessageHelper.validateTransaction = function (client, message) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var invalid, txsForAddresses, i, sigUnlockBlock, address, outputs, _i, _c, outputId, output, inputCount, inputTotal, _d, _e, input, unlockBlockCount, outputTotal, _f, _g, output, serializedInputs, _h, _j, input, writeStream, sortedInputs, inputsAreSorted, i, serializedOutputs, _k, _l, output, writeStream, sortedOutputs, outputsAreSorted, i, binaryEssence, essenceFinal, unlockBlocksFull, i, refUnlockBlock, i, sigUnlockBlock, verified, _m;
            return __generator(this, function (_o) {
                switch (_o.label) {
                    case 0:
                        invalid = [];
                        _o.label = 1;
                    case 1:
                        _o.trys.push([1, 15, , 16]);
                        if (!!message) return [3 /*break*/, 2];
                        invalid.push("The message is empty.");
                        return [3 /*break*/, 14];
                    case 2:
                        if (!!message.payload) return [3 /*break*/, 3];
                        invalid.push("There is no payload.");
                        return [3 /*break*/, 14];
                    case 3:
                        if (!(message.payload.type !== 0)) return [3 /*break*/, 4];
                        invalid.push("The payload type is not a transaction, it is " + message.payload.type + ".");
                        return [3 /*break*/, 14];
                    case 4:
                        if (!!message.payload.essence) return [3 /*break*/, 5];
                        invalid.push("There is no payload essence.");
                        return [3 /*break*/, 14];
                    case 5:
                        if (!(message.payload.essence.type !== 0)) return [3 /*break*/, 6];
                        invalid.push("The payload essence is of a type not supported. " + message.payload.essence.type + ".");
                        return [3 /*break*/, 14];
                    case 6:
                        if (!message.payload.essence.inputs || message.payload.essence.inputs.length === 0) {
                            invalid.push("There are no inputs.");
                        }
                        if (!message.payload.essence.outputs || message.payload.essence.outputs.length === 0) {
                            invalid.push("There are no outputs.");
                        }
                        if (!message.payload.unlockBlocks || message.payload.unlockBlocks.length === 0) {
                            invalid.push("There are no unlock blocks.");
                        }
                        txsForAddresses = {};
                        if (!message.payload.unlockBlocks) return [3 /*break*/, 13];
                        i = 0;
                        _o.label = 7;
                    case 7:
                        if (!(i < message.payload.unlockBlocks.length)) return [3 /*break*/, 13];
                        if (!(message.payload.unlockBlocks[i].type === 0)) return [3 /*break*/, 12];
                        sigUnlockBlock = message.payload.unlockBlocks[i];
                        address = ed25519Address_1.Ed25519Address.publicKeyToAddress(converter_1.Converter.hexToBytes(sigUnlockBlock.signature.publicKey));
                        return [4 /*yield*/, client.addressOutputs(converter_1.Converter.bytesToHex(address))];
                    case 8:
                        outputs = _o.sent();
                        _i = 0, _c = outputs.outputIds;
                        _o.label = 9;
                    case 9:
                        if (!(_i < _c.length)) return [3 /*break*/, 12];
                        outputId = _c[_i];
                        return [4 /*yield*/, client.output(outputId)];
                    case 10:
                        output = _o.sent();
                        txsForAddresses[output.transactionId] = {
                            isSpent: output.isSpent,
                            amount: output.output.amount
                        };
                        _o.label = 11;
                    case 11:
                        _i++;
                        return [3 /*break*/, 9];
                    case 12:
                        i++;
                        return [3 /*break*/, 7];
                    case 13:
                        inputCount = 0;
                        inputTotal = 0;
                        if (message.payload.essence.inputs) {
                            inputCount = message.payload.essence.inputs.length;
                            for (_d = 0, _e = message.payload.essence.inputs; _d < _e.length; _d++) {
                                input = _e[_d];
                                if (!txsForAddresses[input.transactionId]) {
                                    invalid.push("Missing transaction " + input.transactionId + " from source address.");
                                }
                                else if (txsForAddresses[input.transactionId].isSpent) {
                                    invalid.push("Transaction " + input.transactionId + " is already spent.");
                                }
                                else {
                                    inputTotal += txsForAddresses[input.transactionId].amount;
                                }
                            }
                        }
                        unlockBlockCount = (_b = (_a = message.payload.unlockBlocks) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
                        if (inputCount !== unlockBlockCount) {
                            invalid.push("The number of unlock blocks " + unlockBlockCount + ", does not equal the number of inputs " + inputCount + ".");
                        }
                        outputTotal = 0;
                        if (message.payload.essence.outputs) {
                            for (_f = 0, _g = message.payload.essence.outputs; _f < _g.length; _f++) {
                                output = _g[_f];
                                outputTotal += output.amount;
                            }
                        }
                        if (outputTotal !== inputTotal) {
                            invalid.push("The input total " + inputTotal + " does not equal the output total " + outputTotal + ".");
                        }
                        serializedInputs = [];
                        for (_h = 0, _j = message.payload.essence.inputs; _h < _j.length; _h++) {
                            input = _j[_h];
                            writeStream = new writeStream_1.WriteStream();
                            input_1.serializeInput(writeStream, input);
                            serializedInputs.push({
                                input: input,
                                serialized: writeStream.finalHex(),
                                index: serializedInputs.length
                            });
                        }
                        sortedInputs = serializedInputs.sort(function (a, b) { return a.serialized.localeCompare(b.serialized); });
                        inputsAreSorted = true;
                        for (i = 0; i < sortedInputs.length; i++) {
                            if (i !== sortedInputs[i].index) {
                                inputsAreSorted = false;
                                break;
                            }
                        }
                        if (!inputsAreSorted) {
                            invalid.push("The inputs are not lexigraphically sorted.");
                        }
                        serializedOutputs = [];
                        for (_k = 0, _l = message.payload.essence.outputs; _k < _l.length; _k++) {
                            output = _l[_k];
                            writeStream = new writeStream_1.WriteStream();
                            output_1.serializeOutput(writeStream, output);
                            serializedOutputs.push({
                                output: output,
                                serialized: writeStream.finalHex(),
                                index: serializedOutputs.length
                            });
                        }
                        sortedOutputs = serializedOutputs.sort(function (a, b) { return a.serialized.localeCompare(b.serialized); });
                        outputsAreSorted = true;
                        for (i = 0; i < sortedOutputs.length; i++) {
                            if (i !== sortedOutputs[i].index) {
                                outputsAreSorted = false;
                                break;
                            }
                        }
                        if (!outputsAreSorted) {
                            invalid.push("The outputs are not lexigraphically sorted.");
                        }
                        if (inputsAreSorted && outputsAreSorted && inputCount === unlockBlockCount) {
                            binaryEssence = new writeStream_1.WriteStream();
                            transaction_1.serializeTransactionEssence(binaryEssence, message.payload.essence);
                            essenceFinal = binaryEssence.finalBytes();
                            unlockBlocksFull = [];
                            for (i = 0; i < message.payload.unlockBlocks.length; i++) {
                                if (message.payload.unlockBlocks[i].type === 0) {
                                    unlockBlocksFull.push(message.payload.unlockBlocks[i]);
                                }
                                else if (message.payload.unlockBlocks[i].type === 1) {
                                    refUnlockBlock = message.payload.unlockBlocks[i];
                                    if (refUnlockBlock.reference < 0 ||
                                        refUnlockBlock.reference > message.payload.unlockBlocks.length - 1) {
                                        invalid.push("Unlock Block " + i + " references index " + refUnlockBlock.reference + " which is out of range.");
                                    }
                                    else if (refUnlockBlock.reference === i) {
                                        invalid.push("Unlock Block " + i + " references itself.");
                                    }
                                    else if (message.payload.unlockBlocks[refUnlockBlock.reference].type === 1) {
                                        invalid.push("Unlock Block " + i + " references another reference.");
                                    }
                                    else {
                                        unlockBlocksFull.push(message.payload.unlockBlocks[refUnlockBlock.reference]);
                                    }
                                }
                            }
                            for (i = 0; i < sortedInputs.length; i++) {
                                sigUnlockBlock = unlockBlocksFull[i];
                                verified = ed25519_1.Ed25519.verify(converter_1.Converter.hexToBytes(sigUnlockBlock.signature.publicKey), essenceFinal, converter_1.Converter.hexToBytes(sigUnlockBlock.signature.signature));
                                if (!verified) {
                                    invalid.push("Signature for unlock block " + i + " is incorrect.");
                                }
                            }
                        }
                        _o.label = 14;
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        _m = _o.sent();
                        return [3 /*break*/, 16];
                    case 16: return [2 /*return*/, invalid];
                }
            });
        });
    };
    return MessageHelper;
}());
exports.MessageHelper = MessageHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZUhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9tZXNzYWdlSGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUFpRDtBQUNqRCwyQ0FBbUQ7QUFDbkQscURBQW9FO0FBQ3BFLDZDQUE0QztBQUM1QywyREFBMEQ7QUFPMUQseUNBQXdDO0FBQ3hDLDZDQUE0QztBQUU1Qzs7R0FFRztBQUNIO0lBQUE7SUF5TUEsQ0FBQztJQXhNRzs7Ozs7T0FLRztJQUNpQixpQ0FBbUIsR0FBdkMsVUFBd0MsTUFBZSxFQUFFLE9BQWlCOzs7Ozs7O3dCQUNoRSxPQUFPLEdBQUcsRUFBRSxDQUFDOzs7OzZCQUdYLENBQUMsT0FBTyxFQUFSLHdCQUFRO3dCQUNSLE9BQU8sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQzs7OzZCQUMvQixDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQWhCLHdCQUFnQjt3QkFDdkIsT0FBTyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDOzs7NkJBQzlCLENBQUEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFBLEVBQTFCLHdCQUEwQjt3QkFDakMsT0FBTyxDQUFDLElBQUksQ0FBQyxrREFBZ0QsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQUcsQ0FBQyxDQUFDOzs7NkJBQy9FLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQXhCLHdCQUF3Qjt3QkFDL0IsT0FBTyxDQUFDLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDOzs7NkJBQ3RDLENBQUEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQSxFQUFsQyx3QkFBa0M7d0JBQ3pDLE9BQU8sQ0FBQyxJQUFJLENBQUMscURBQW1ELE9BQU8sQ0FBQyxPQUFPLENB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