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
            var invalid, txsForAddresses, i, sigUnlockBlock, address, outputs, _i, _c, outputId, output, inputCount, inputTotal, _d, _e, input, unlockBlockCount, outputTotal, _f, _g, output, serializedInputs, _h, _j, input, writeStream, sortedInputs, inputsAreSorted, i, serializedOutputs, _k, _l, output, writeStream, sortedOutputs, outputsAreSorted, i, binaryEssence, essenceFinal, unlockBlocksFull, i, refUnlockBlock, i, sigUnlockBlock, verified, err_1;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        invalid = [];
                        _m.label = 1;
                    case 1:
                        _m.trys.push([1, 15, , 16]);
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
                        _m.label = 7;
                    case 7:
                        if (!(i < message.payload.unlockBlocks.length)) return [3 /*break*/, 13];
                        if (!(message.payload.unlockBlocks[i].type === 0)) return [3 /*break*/, 12];
                        sigUnlockBlock = message.payload.unlockBlocks[i];
                        address = ed25519Address_1.Ed25519Address.publicKeyToAddress(converter_1.Converter.hexToBytes(sigUnlockBlock.signature.publicKey));
                        return [4 /*yield*/, client.addressOutputs(converter_1.Converter.bytesToHex(address))];
                    case 8:
                        outputs = _m.sent();
                        _i = 0, _c = outputs.outputIds;
                        _m.label = 9;
                    case 9:
                        if (!(_i < _c.length)) return [3 /*break*/, 12];
                        outputId = _c[_i];
                        return [4 /*yield*/, client.output(outputId)];
                    case 10:
                        output = _m.sent();
                        txsForAddresses[output.transactionId] = {
                            isSpent: output.isSpent,
                            amount: output.output.amount
                        };
                        _m.label = 11;
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
                        _m.label = 14;
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        err_1 = _m.sent();
                        invalid.push("The following error occured while validating the transaction");
                        invalid.push(err_1.toString().replace("TypeError: ", ""));
                        return [3 /*break*/, 16];
                    case 16: return [2 /*return*/, invalid];
                }
            });
        });
    };
    return MessageHelper;
}());
exports.MessageHelper = MessageHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZUhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9tZXNzYWdlSGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUFpRDtBQUNqRCwyQ0FBbUQ7QUFDbkQscURBQW9FO0FBQ3BFLDZDQUE0QztBQUM1QywyREFBMEQ7QUFPMUQseUNBQXdDO0FBQ3hDLDZDQUE0QztBQUU1Qzs7R0FFRztBQUNIO0lBQUE7SUEyTUEsQ0FBQztJQTFNRzs7Ozs7T0FLRztJQUNpQixpQ0FBbUIsR0FBdkMsVUFBd0MsTUFBZSxFQUFFLE9BQWlCOzs7Ozs7O3dCQUNoRSxPQUFPLEdBQWEsRUFBRSxDQUFDOzs7OzZCQUdyQixDQUFDLE9BQU8sRUFBUix3QkFBUTt3QkFDUixPQUFPLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7Ozs2QkFDL0IsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFoQix3QkFBZ0I7d0JBQ3ZCLE9BQU8sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQzs7OzZCQUM5QixDQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQSxFQUExQix3QkFBMEI7d0JBQ2pDLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0RBQWdELE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFHLENBQUMsQ0FBQzs7OzZCQUMvRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUF4Qix3QkFBd0I7d0JBQy9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsOEJBQThCLENBQUMsQ0FBQzs7OzZCQUN0QyxDQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUEsRUFBbEMsd0JBQWtDO3dCQUN6QyxPQUFPLENBQUMsSUFBSSxDQUFDLHFEQUFtRCxPQUFPLENBQUMsT0FBTyxD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