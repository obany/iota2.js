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
exports.LocalPowProvider = void 0;
var blake2b_1 = require("../crypto/blake2b");
var curl_1 = require("../crypto/curl");
var b1t6_1 = require("../encoding/b1t6");
var powHelper_1 = require("../utils/powHelper");
/**
 * Local POW Provider.
 * WARNING - This is really slow.
 */
var LocalPowProvider = /** @class */ (function () {
    function LocalPowProvider() {
        /**
         * LN3 Const see https://oeis.org/A002391
         * @internal
         */
        this.LN3 = 1.098612288668109691395245236922525704647490557822749451734694333;
    }
    /**
     * Perform pow on the message and return the nonce of at least targetScore.
     * @param message The message to process.
     * @param targetScore the target score.
     * @returns The nonce.
     */
    LocalPowProvider.prototype.pow = function (message, targetScore) {
        return __awaiter(this, void 0, void 0, function () {
            var powRelevantData, powDigest, targetZeros;
            return __generator(this, function (_a) {
                powRelevantData = message.slice(0, -8);
                powDigest = blake2b_1.Blake2b.sum256(powRelevantData);
                targetZeros = Math.ceil(Math.log((powRelevantData.length + 8) * targetScore) / this.LN3);
                return [2 /*return*/, this.worker(powDigest, targetZeros)];
            });
        });
    };
    /**
     * Perform the hash on the data until we reach target number of zeros.
     * @param powDigest The pow digest.
     * @param target The target number of zeros.
     * @returns The nonce.
     * @internal
     */
    LocalPowProvider.prototype.worker = function (powDigest, target) {
        var curl = new curl_1.Curl();
        var hash = new Int8Array(curl_1.Curl.HASH_LENGTH);
        var buf = new Int8Array(curl_1.Curl.HASH_LENGTH);
        b1t6_1.B1T6.encode(buf, 0, powDigest);
        var digestTritsLen = b1t6_1.B1T6.encodedLen(powDigest);
        var nonce = BigInt(0);
        var returnNonce;
        do {
            powHelper_1.PowHelper.encodeNonce(buf, digestTritsLen, nonce);
            curl.reset();
            curl.absorb(buf, 0, curl_1.Curl.HASH_LENGTH);
            curl.squeeze(hash, 0, curl_1.Curl.HASH_LENGTH);
            if (powHelper_1.PowHelper.trinaryTrailingZeros(hash) >= target) {
                returnNonce = nonce;
            }
            nonce++;
        } while (returnNonce === undefined);
        return returnNonce !== null && returnNonce !== void 0 ? returnNonce : BigInt(0);
    };
    return LocalPowProvider;
}());
exports.LocalPowProvider = LocalPowProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxQb3dQcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wb3cvbG9jYWxQb3dQcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBNEM7QUFDNUMsdUNBQXNDO0FBQ3RDLHlDQUF3QztBQUV4QyxnREFBK0M7QUFFL0M7OztHQUdHO0FBQ0g7SUFBQTtRQUNJOzs7V0FHRztRQUNjLFFBQUcsR0FBVyxpRUFBaUUsQ0FBQztJQXFEckcsQ0FBQztJQW5ERzs7Ozs7T0FLRztJQUNVLDhCQUFHLEdBQWhCLFVBQWlCLE9BQW1CLEVBQUUsV0FBbUI7Ozs7Z0JBQy9DLGVBQWUsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUV2QyxTQUFTLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBRTVDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFFL0Ysc0JBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLEVBQUM7OztLQUM5QztJQUVEOzs7Ozs7T0FNRztJQUNLLGlDQUFNLEdBQWQsVUFBZSxTQUFxQixFQUFFLE1BQWM7UUFDaEQsSUFBTSxJQUFJLEdBQUcsSUFBSSxXQUFJLEVBQUUsQ0FBQztRQUV4QixJQUFNLElBQUksR0FBYyxJQUFJLFNBQVMsQ0FBQyxXQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFeEQsSUFBTSxHQUFHLEdBQWMsSUFBSSxTQUFTLENBQUMsV0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZELFdBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUUvQixJQUFNLGNBQWMsR0FBRyxXQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRWxELElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFJLFdBQVcsQ0FBQztRQUVoQixHQUFHO1lBQ0MscUJBQVMsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVsRCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsV0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxXQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFeEMsSUFBSSxxQkFBUyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sRUFBRTtnQkFDaEQsV0FBVyxHQUFHLEtBQUssQ0FBQzthQUN2QjtZQUNELEtBQUssRUFBRSxDQUFDO1NBQ1gsUUFBUSxXQUFXLEtBQUssU0FBUyxFQUFFO1FBRXBDLE9BQU8sV0FBVyxhQUFYLFdBQVcsY0FBWCxXQUFXLEdBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFDTCx1QkFBQztBQUFELENBQUMsQUExREQsSUEwREM7QUExRFksNENBQWdCIn0=