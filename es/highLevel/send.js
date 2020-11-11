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
exports.calculateInputs = exports.send = void 0;
var ed25519Address_1 = require("../crypto/ed25519Address");
var converter_1 = require("../utils/converter");
var sendAdvanced_1 = require("./sendAdvanced");
/**
 * Send a transfer from the balance on the seed.
 * @param client The client to send the transfer with.
 * @param seed The seed to use for address generation.
 * @param basePath The base path to start looking for addresses.
 * @param address The address to send the funds to.
 * @param amount The amount to send.
 * @param startIndex The start index for the wallet count address, defaults to 0.
 * @returns The id of the message created and the contructed message.
 */
function send(client, seed, basePath, address, amount, startIndex) {
    return __awaiter(this, void 0, void 0, function () {
        var outputs, inputsAndKey, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    outputs = [{ address: address, amount: amount }];
                    return [4 /*yield*/, calculateInputs(client, seed, basePath, outputs, startIndex)];
                case 1:
                    inputsAndKey = _a.sent();
                    return [4 /*yield*/, sendAdvanced_1.sendAdvanced(client, inputsAndKey, outputs)];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/, {
                            messageId: response.messageId,
                            message: response.message
                        }];
            }
        });
    });
}
exports.send = send;
/**
 * Calculate the inputs from the seed and basePath.
 * @param client The client to send the transfer with.
 * @param seed The seed to use for address generation.
 * @param basePath The base path to start looking for addresses.
 * @param outputs The outputs to send.
 * @param startIndex The start index for the wallet count address, defaults to 0.
 * @returns The id of the message created and the contructed message.
 */
function calculateInputs(client, seed, basePath, outputs, startIndex) {
    return __awaiter(this, void 0, void 0, function () {
        var requiredBalance, localStartIndex, consumedBalance, inputsAndSignatureKeyPairs, finished, addressKeyPair, address, addressOutputIds, _i, _a, addressOutputId, addressOutput, input;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    requiredBalance = outputs.reduce(function (total, output) { return total + output.amount; }, 0);
                    localStartIndex = startIndex !== null && startIndex !== void 0 ? startIndex : 0;
                    consumedBalance = 0;
                    inputsAndSignatureKeyPairs = [];
                    finished = false;
                    _b.label = 1;
                case 1:
                    basePath.push(localStartIndex);
                    addressKeyPair = seed.generateSeedFromPath(basePath).keyPair();
                    basePath.pop();
                    address = converter_1.Converter.bytesToHex(ed25519Address_1.Ed25519Address.publicKeyToAddress(addressKeyPair.publicKey));
                    return [4 /*yield*/, client.addressOutputs(address)];
                case 2:
                    addressOutputIds = _b.sent();
                    if (!(addressOutputIds.count === 0)) return [3 /*break*/, 3];
                    finished = true;
                    return [3 /*break*/, 7];
                case 3:
                    _i = 0, _a = addressOutputIds.outputIds;
                    _b.label = 4;
                case 4:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    addressOutputId = _a[_i];
                    return [4 /*yield*/, client.output(addressOutputId)];
                case 5:
                    addressOutput = _b.sent();
                    if (!addressOutput.isSpent &&
                        consumedBalance < requiredBalance) {
                        if (addressOutput.output.amount === 0) {
                            finished = true;
                        }
                        else {
                            consumedBalance += addressOutput.output.amount;
                            input = {
                                type: 0,
                                transactionId: addressOutput.transactionId,
                                transactionOutputIndex: addressOutput.outputIndex
                            };
                            inputsAndSignatureKeyPairs.push({
                                input: input,
                                addressKeyPair: addressKeyPair
                            });
                            if (consumedBalance >= requiredBalance) {
                                // We didn't use all the balance from the last input
                                // so return the rest to the same address.
                                if (consumedBalance - requiredBalance > 0) {
                                    outputs.push({
                                        amount: consumedBalance - requiredBalance,
                                        address: address
                                    });
                                }
                                finished = true;
                            }
                        }
                    }
                    _b.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    localStartIndex++;
                    _b.label = 8;
                case 8:
                    if (!finished) return [3 /*break*/, 1];
                    _b.label = 9;
                case 9:
                    if (consumedBalance < requiredBalance) {
                        throw new Error("There are not enough funds in the inputs for the required balance");
                    }
                    return [2 /*return*/, inputsAndSignatureKeyPairs];
            }
        });
    });
}
exports.calculateInputs = calculateInputs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oaWdoTGV2ZWwvc2VuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSwyREFBMEQ7QUFNMUQsZ0RBQStDO0FBQy9DLCtDQUE4QztBQUU5Qzs7Ozs7Ozs7O0dBU0c7QUFDSCxTQUFzQixJQUFJLENBQ3RCLE1BQWUsRUFDZixJQUFXLEVBQ1gsUUFBbUIsRUFDbkIsT0FBZSxFQUNmLE1BQWMsRUFDZCxVQUFtQjs7Ozs7O29CQUliLE9BQU8sR0FBRyxDQUFDLEVBQUUsT0FBTyxTQUFBLEVBQUUsTUFBTSxRQUFBLEVBQUUsQ0FBQyxDQUFDO29CQUNqQixxQkFBTSxlQUFlLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxFQUFBOztvQkFBakYsWUFBWSxHQUFHLFNBQWtFO29CQUV0RSxxQkFBTSwyQkFBWSxDQUMvQixNQUFNLEVBQ04sWUFBWSxFQUNaLE9BQU8sQ0FBQyxFQUFBOztvQkFITixRQUFRLEdBQUcsU0FHTDtvQkFFWixzQkFBTzs0QkFDSCxTQUFTLEVBQUUsUUFBUSxDQUFDLFNBQVM7NEJBQzdCLE9BQU8sRUFBRSxRQUFRLENBQUMsT0FBTzt5QkFDNUIsRUFBQzs7OztDQUNMO0FBdEJELG9CQXNCQztBQUVEOzs7Ozs7OztHQVFHO0FBQ0gsU0FBc0IsZUFBZSxDQUNqQyxNQUFlLEVBQ2YsSUFBVyxFQUNYLFFBQW1CLEVBQ25CLE9BQThDLEVBQzlDLFVBQW1COzs7Ozs7b0JBSWIsZUFBZSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQyxLQUFLLEVBQUUsTUFBTSxJQUFLLE9BQUEsS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQXJCLENBQXFCLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBRWhGLGVBQWUsR0FBRyxVQUFVLGFBQVYsVUFBVSxjQUFWLFVBQVUsR0FBSSxDQUFDLENBQUM7b0JBQ2xDLGVBQWUsR0FBRyxDQUFDLENBQUM7b0JBQ2xCLDBCQUEwQixHQUcxQixFQUFFLENBQUM7b0JBQ0wsUUFBUSxHQUFHLEtBQUssQ0FBQzs7O29CQUdqQixRQUFRLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO29CQUN6QixjQUFjLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUNyRSxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBRVQsT0FBTyxHQUFHLHFCQUFTLENBQUMsVUFBVSxDQUFDLCtCQUFjLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pFLHFCQUFNLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUE7O29CQUF2RCxnQkFBZ0IsR0FBRyxTQUFvQzt5QkFFekQsQ0FBQSxnQkFBZ0IsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFBLEVBQTVCLHdCQUE0QjtvQkFDNUIsUUFBUSxHQUFHLElBQUksQ0FBQzs7OzBCQUV3QyxFQUExQixLQUFBLGdCQUFnQixDQUFDLFNBQVM7Ozt5QkFBMUIsQ0FBQSxjQUEwQixDQUFBO29CQUE3QyxlQUFlO29CQUNBLHFCQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEVBQUE7O29CQUFwRCxhQUFhLEdBQUcsU0FBb0M7b0JBRTFELElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTzt3QkFDdEIsZUFBZSxHQUFHLGVBQWUsRUFBRTt3QkFDbkMsSUFBSSxhQUFhLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7NEJBQ25DLFFBQVEsR0FBRyxJQUFJLENBQUM7eUJBQ25COzZCQUFNOzRCQUNILGVBQWUsSUFBSSxhQUFhLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQzs0QkFFekMsS0FBSyxHQUFlO2dDQUN0QixJQUFJLEVBQUUsQ0FBQztnQ0FDUCxhQUFhLEVBQUUsYUFBYSxDQUFDLGFBQWE7Z0NBQzFDLHNCQUFzQixFQUFFLGFBQWEsQ0FBQyxXQUFXOzZCQUNwRCxDQUFDOzRCQUVGLDBCQUEwQixDQUFDLElBQUksQ0FBQztnQ0FDNUIsS0FBSyxPQUFBO2dDQUNMLGNBQWMsZ0JBQUE7NkJBQ2pCLENBQUMsQ0FBQzs0QkFFSCxJQUFJLGVBQWUsSUFBSSxlQUFlLEVBQUU7Z0NBQ3BDLG9EQUFvRDtnQ0FDcEQsMENBQTBDO2dDQUMxQyxJQUFJLGVBQWUsR0FBRyxlQUFlLEdBQUcsQ0FBQyxFQUFFO29DQUN2QyxPQUFPLENBQUMsSUFBSSxDQUFDO3dDQUNULE1BQU0sRUFBRSxlQUFlLEdBQUcsZUFBZTt3Q0FDekMsT0FBTyxTQUFBO3FDQUNWLENBQUMsQ0FBQztpQ0FDTjtnQ0FDRCxRQUFRLEdBQUcsSUFBSSxDQUFDOzZCQUNuQjt5QkFDSjtxQkFDSjs7O29CQWpDeUIsSUFBMEIsQ0FBQTs7O29CQXFDNUQsZUFBZSxFQUFFLENBQUM7Ozt3QkFDYixDQUFDLFFBQVE7OztvQkFFbEIsSUFBSSxlQUFlLEdBQUcsZUFBZSxFQUFFO3dCQUNuQyxNQUFNLElBQUksS0FBSyxDQUFDLG1FQUFtRSxDQUFDLENBQUM7cUJBQ3hGO29CQUVELHNCQUFPLDBCQUEwQixFQUFDOzs7O0NBQ3JDO0FBM0VELDBDQTJFQyJ9