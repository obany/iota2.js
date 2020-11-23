"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Curl = void 0;
/* eslint-disable no-bitwise */
/**
 * Class to implement Curl sponge.
 * @internal
 */
var Curl = /** @class */ (function () {
    /**
     * Create a new instance of Curl.
     * @param rounds The number of rounds to perform.
     */
    function Curl(rounds) {
        if (rounds === void 0) { rounds = Curl.NUMBER_OF_ROUNDS; }
        if (rounds !== 27 && rounds !== 81) {
            throw new Error("Illegal number of rounds. Only `27` and `81` rounds are supported.");
        }
        this._state = new Int8Array(Curl.STATE_LENGTH);
        this._rounds = rounds;
    }
    /**
     * Resets the state
     */
    Curl.prototype.reset = function () {
        this._state = new Int8Array(Curl.STATE_LENGTH);
    };
    /**
     * Get the state of the sponge.
     * @param len The length of the state to get.
     * @returns The state.
     */
    Curl.prototype.rate = function (len) {
        if (len === void 0) { len = Curl.HASH_LENGTH; }
        return this._state.slice(0, len);
    };
    /**
     * Absorbs trits given an offset and length
     * @param trits The trits to absorb.
     * @param offset The offset to start abororbing from the array.
     * @param length The length of trits to absorb.
     */
    Curl.prototype.absorb = function (trits, offset, length) {
        do {
            var limit = length < Curl.HASH_LENGTH ? length : Curl.HASH_LENGTH;
            this._state.set(trits.subarray(offset, offset + limit));
            this.transform();
            length -= Curl.HASH_LENGTH;
            offset += limit;
        } while (length > 0);
    };
    /**
     * Squeezes trits given an offset and length
     * @param trits The trits to squeeze.
     * @param offset The offset to start squeezing from the array.
     * @param length The length of trits to squeeze.
     */
    Curl.prototype.squeeze = function (trits, offset, length) {
        do {
            var limit = length < Curl.HASH_LENGTH ? length : Curl.HASH_LENGTH;
            trits.set(this._state.subarray(0, limit), offset);
            this.transform();
            length -= Curl.HASH_LENGTH;
            offset += limit;
        } while (length > 0);
    };
    /**
     * Sponge transform function
     */
    Curl.prototype.transform = function () {
        var stateCopy;
        var index = 0;
        for (var round = 0; round < this._rounds; round++) {
            stateCopy = this._state.slice();
            for (var i = 0; i < Curl.STATE_LENGTH; i++) {
                this._state[i] =
                    Curl.TRUTH_TABLE[stateCopy[index] + (stateCopy[(index += index < 365 ? 364 : -365)] << 2) + 5];
            }
        }
    };
    /**
     * The Hash Length
     */
    Curl.HASH_LENGTH = 243;
    /**
     * The State Length.
     */
    Curl.STATE_LENGTH = 3 * Curl.HASH_LENGTH;
    /**
     * The default number of rounds.
     */
    Curl.NUMBER_OF_ROUNDS = 81;
    /**
     * Truth Table.
     */
    Curl.TRUTH_TABLE = [1, 0, -1, 2, 1, -1, 0, 2, -1, 1, 0];
    return Curl;
}());
exports.Curl = Curl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VybC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jcnlwdG8vY3VybC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBK0I7QUFDL0I7OztHQUdHO0FBQ0g7SUErQkk7OztPQUdHO0lBQ0gsY0FBWSxNQUFzQztRQUF0Qyx1QkFBQSxFQUFBLFNBQWlCLElBQUksQ0FBQyxnQkFBZ0I7UUFDOUMsSUFBSSxNQUFNLEtBQUssRUFBRSxJQUFJLE1BQU0sS0FBSyxFQUFFLEVBQUU7WUFDaEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxvRUFBb0UsQ0FBQyxDQUFDO1NBQ3pGO1FBRUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFDMUIsQ0FBQztJQUVEOztPQUVHO0lBQ0ksb0JBQUssR0FBWjtRQUNJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksbUJBQUksR0FBWCxVQUFZLEdBQThCO1FBQTlCLG9CQUFBLEVBQUEsTUFBYyxJQUFJLENBQUMsV0FBVztRQUN0QyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxxQkFBTSxHQUFiLFVBQWMsS0FBZ0IsRUFBRSxNQUFjLEVBQUUsTUFBYztRQUMxRCxHQUFHO1lBQ0MsSUFBTSxLQUFLLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUVwRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUV4RCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDakIsTUFBTSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQztTQUNuQixRQUFRLE1BQU0sR0FBRyxDQUFDLEVBQUU7SUFDekIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksc0JBQU8sR0FBZCxVQUFlLEtBQWdCLEVBQUUsTUFBYyxFQUFFLE1BQWM7UUFDM0QsR0FBRztZQUNDLElBQU0sS0FBSyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7WUFFcEUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFbEQsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2pCLE1BQU0sSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUM7U0FDbkIsUUFBUSxNQUFNLEdBQUcsQ0FBQyxFQUFFO0lBQ3pCLENBQUM7SUFFRDs7T0FFRztJQUNLLHdCQUFTLEdBQWpCO1FBQ0ksSUFBSSxTQUFTLENBQUM7UUFDZCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7UUFFZCxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUMvQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUVoQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ1YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDdEc7U0FDSjtJQUNMLENBQUM7SUE5R0Q7O09BRUc7SUFDb0IsZ0JBQVcsR0FBVyxHQUFHLENBQUM7SUFFakQ7O09BRUc7SUFDb0IsaUJBQVksR0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUVuRTs7T0FFRztJQUNxQixxQkFBZ0IsR0FBVyxFQUFFLENBQUM7SUFFdEQ7O09BRUc7SUFDcUIsZ0JBQVcsR0FBYSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQTZGekYsV0FBQztDQUFBLEFBaEhELElBZ0hDO0FBaEhZLG9CQUFJIn0=