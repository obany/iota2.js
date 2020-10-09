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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const cross_fetch_1 = require("cross-fetch");
const clientError_1 = require("./clientError");
/**
 * Client for API communication.
 */
class Client {
    /**
     * Create a new instance of client.
     * @param endpoint The endpoint.
     */
    constructor(endpoint) {
        if (!/^https?:\/\/\w+(\.\w+)*(:\d+)?(\/.*)?$/.test(endpoint)) {
            throw new Error("The endpoint is not in the correct format");
        }
        this._endpoint = endpoint.replace(/\/+$/, "");
    }
    /**
     * Get the health of the node.
     * @returns True if the node is healthy.
     */
    health() {
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield this.fetchStatus("/health");
            if (status === 200) {
                return true;
            }
            else if (status === 503) {
                return false;
            }
            throw new clientError_1.ClientError("Unexpected response code", "/health", status);
        });
    }
    /**
     * Get the info about the node.
     * @returns The node information.
     */
    info() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.fetchJson("get", "/api/v1/info");
        });
    }
    /**
     * Get the tips from the node.
     * @returns The tips.
     */
    tips() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.fetchJson("get", "/api/v1/tips");
        });
    }
    /**
     * Get the message metadata by id.
     * @param messageId The message to get the metadata for.
     * @returns The message metadata.
     */
    messageMetadata(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.fetchJson("get", `/api/v1/messages/${messageId}`);
        });
    }
    /**
     * Get the message data by id.
     * @param messageId The message to get the data for.
     * @returns The message data.
     */
    message(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.fetchJson("get", `/api/v1/messages/${messageId}/data`);
        });
    }
    /**
     * Get the message raw data by id.
     * @param messageId The message to get the data for.
     * @returns The message raw data.
     */
    messageRaw(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.fetchBinary(`/api/v1/messages/${messageId}/raw`);
        });
    }
    /**
     * Submit message.
     * @param message The message to submit.
     * @returns The messageId.
     */
    messageSubmit(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.fetchJson("post", "/api/v1/messages", message);
            return response.messageId;
        });
    }
    /**
     * Find messages by index.
     * @param index The index value.
     * @returns The messageId.
     */
    messagesFind(index) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.fetchJson("get", `/api/v1/messages?index=${encodeURIComponent(index)}`);
        });
    }
    /**
     * Get the children of a message.
     * @param messageId The id of the message to get the children for.
     * @returns The messages children.
     */
    messageChildren(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.fetchJson("get", `/api/v1/messages/${messageId}/children`);
        });
    }
    /**
     * Find an output by its identifier.
     * @param outputId The id of the output to get.
     * @returns The output details.
     */
    output(outputId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.fetchJson("get", `/api/v1/outputs/${outputId}`);
        });
    }
    /**
     * Get the address details.
     * @param address The address to get the details for.
     * @returns The address details.
     */
    address(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.fetchJson("get", `/api/v1/addresses/${address}`);
        });
    }
    /**
     * Get the address outputs.
     * @param address The address to get the outputs for.
     * @returns The address outputs.
     */
    addressOutputs(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.fetchJson("get", `/api/v1/addresses/${address}/outputs`);
        });
    }
    /**
     * Get the requested milestone.
     * @param index The index of the milestone to get.
     * @returns The milestone details.
     */
    milestone(index) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.fetchJson("get", `/api/v1/milestones/${index}`);
        });
    }
    /**
     * Perform a request and just return the status.
     * @param route The route of the request.
     * @returns The response.
     * @private
     */
    fetchStatus(route) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield cross_fetch_1.default(`${this._endpoint}${route}`, {
                method: "get"
            });
            return response.status;
        });
    }
    /**
     * Perform a request in json format.
     * @param method The http method.
     * @param route The route of the request.
     * @param requestData Request to send to the endpoint.
     * @returns The response.
     * @private
     */
    fetchJson(method, route, requestData) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield cross_fetch_1.default(`${this._endpoint}${route}`, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: requestData ? JSON.stringify(requestData) : undefined
            });
            const responseData = yield response.json();
            if (response.ok && !responseData.error) {
                return responseData.data;
            }
            throw new clientError_1.ClientError((_b = (_a = responseData.error) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : response.statusText, route, response.status, (_c = responseData.error) === null || _c === void 0 ? void 0 : _c.code);
        });
    }
    /**
     * Perform a request for binary data.
     * @param route The route of the request.
     * @returns The response.
     * @private
     */
    fetchBinary(route) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield cross_fetch_1.default(`${this._endpoint}${route}`, {
                method: "get",
                headers: {
                    "Content-Type": "application/octet-stream"
                }
            });
            if (response.ok) {
                return Buffer.from(yield response.arrayBuffer());
            }
            const responseData = yield response.json();
            throw new clientError_1.ClientError((_b = (_a = responseData.error) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : response.statusText, route, response.status, (_c = responseData.error) === null || _c === void 0 ? void 0 : _c.code);
        });
    }
}
exports.Client = Client;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwaS9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQWdDO0FBQ2hDLCtDQUE0QztBQWE1Qzs7R0FFRztBQUNILE1BQWEsTUFBTTtJQU1mOzs7T0FHRztJQUNILFlBQVksUUFBZ0I7UUFDeEIsSUFBSSxDQUFDLHdDQUF3QyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUMxRCxNQUFNLElBQUksS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7U0FDaEU7UUFDRCxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRDs7O09BR0c7SUFDVSxNQUFNOztZQUNmLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUVqRCxJQUFJLE1BQU0sS0FBSyxHQUFHLEVBQUU7Z0JBQ2hCLE9BQU8sSUFBSSxDQUFDO2FBQ2Y7aUJBQU0sSUFBSSxNQUFNLEtBQUssR0FBRyxFQUFFO2dCQUN2QixPQUFPLEtBQUssQ0FBQzthQUNoQjtZQUVELE1BQU0sSUFBSSx5QkFBVyxDQUFDLDBCQUEwQixFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN6RSxDQUFDO0tBQUE7SUFFRDs7O09BR0c7SUFDVSxJQUFJOztZQUNiLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBZSxLQUFLLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDL0QsQ0FBQztLQUFBO0lBRUQ7OztPQUdHO0lBQ1UsSUFBSTs7WUFDYixPQUFPLElBQUksQ0FBQyxTQUFTLENBQWUsS0FBSyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQy9ELENBQUM7S0FBQTtJQUVEOzs7O09BSUc7SUFDVSxlQUFlLENBQUMsU0FBaUI7O1lBQzFDLE9BQU8sSUFB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