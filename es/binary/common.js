"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHex = exports.ARRAY_LENGTH = exports.STRING_LENGTH = exports.SMALL_TYPE_LENGTH = exports.TYPE_LENGTH = exports.MERKLE_PROOF_LENGTH = exports.TRANSACTION_ID_LENGTH = exports.MESSAGE_ID_LENGTH = exports.UINT64_SIZE = exports.UINT32_SIZE = exports.UINT16_SIZE = exports.BYTE_SIZE = void 0;
var blake2b_1 = require("../crypto/blake2b");
exports.BYTE_SIZE = 1;
exports.UINT16_SIZE = 2;
exports.UINT32_SIZE = 4;
exports.UINT64_SIZE = 8;
exports.MESSAGE_ID_LENGTH = blake2b_1.Blake2b.SIZE_256;
exports.TRANSACTION_ID_LENGTH = blake2b_1.Blake2b.SIZE_256;
exports.MERKLE_PROOF_LENGTH = 64;
exports.TYPE_LENGTH = exports.UINT32_SIZE;
exports.SMALL_TYPE_LENGTH = exports.BYTE_SIZE;
exports.STRING_LENGTH = exports.UINT16_SIZE;
exports.ARRAY_LENGTH = exports.UINT16_SIZE;
/**
 * Is the data hex format.
 * @param value The value to test.
 * @returns true if the string is hex.
 */
function isHex(value) {
    if (value.length % 2 === 1) {
        return false;
    }
    return /[\da-f]/gi.test(value);
}
exports.isHex = isHex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2JpbmFyeS9jb21tb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQTRDO0FBRS9CLFFBQUEsU0FBUyxHQUFXLENBQUMsQ0FBQztBQUN0QixRQUFBLFdBQVcsR0FBVyxDQUFDLENBQUM7QUFDeEIsUUFBQSxXQUFXLEdBQVcsQ0FBQyxDQUFDO0FBQ3hCLFFBQUEsV0FBVyxHQUFXLENBQUMsQ0FBQztBQUV4QixRQUFBLGlCQUFpQixHQUFXLGlCQUFPLENBQUMsUUFBUSxDQUFDO0FBQzdDLFFBQUEscUJBQXFCLEdBQVcsaUJBQU8sQ0FBQyxRQUFRLENBQUM7QUFDakQsUUFBQSxtQkFBbUIsR0FBVyxFQUFFLENBQUM7QUFDakMsUUFBQSxXQUFXLEdBQVcsbUJBQVcsQ0FBQztBQUNsQyxRQUFBLGlCQUFpQixHQUFXLGlCQUFTLENBQUM7QUFDdEMsUUFBQSxhQUFhLEdBQVcsbUJBQVcsQ0FBQztBQUNwQyxRQUFBLFlBQVksR0FBVyxtQkFBVyxDQUFDO0FBRWhEOzs7O0dBSUc7QUFDSCxTQUFnQixLQUFLLENBQUMsS0FBYTtJQUMvQixJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN4QixPQUFPLEtBQUssQ0FBQztLQUNoQjtJQUNELE9BQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBTEQsc0JBS0MifQ==