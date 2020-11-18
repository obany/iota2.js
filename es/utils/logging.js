"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logUnlockBlock = exports.logOutput = exports.logInput = exports.logSignature = exports.logAddress = exports.logPayload = exports.logMessage = exports.setLogger = void 0;
var converter_1 = require("./converter");
/**
 * The logger used by the log methods.
 * @param message The message to output.
 * @param data The data to output.
 * @returns Nothing.
 */
var logger = function (message, data) {
    return (data !== undefined ? console.log(message, data) : console.log(message));
};
/**
 * Set the logger for output.
 * @param log The logger.
 */
function setLogger(log) {
    logger = log;
}
exports.setLogger = setLogger;
/**
 * Log a message to the console.
 * @param prefix The prefix for the output.
 * @param message The message to log.
 */
function logMessage(prefix, message) {
    logger(prefix + "\tNetwork Id:", message.networkId);
    logger(prefix + "\tParent 1 Message Id:", message.parent1MessageId);
    logger(prefix + "\tParent 2 Message Id:", message.parent2MessageId);
    logPayload(prefix + "\t", message.payload);
    if (message.nonce !== undefined) {
        logger(prefix + "\tNonce:", message.nonce);
    }
}
exports.logMessage = logMessage;
/**
 * Log a message to the console.
 * @param prefix The prefix for the output.
 * @param unknownPayload The payload.
 */
function logPayload(prefix, unknownPayload) {
    if (unknownPayload) {
        if (unknownPayload.type === 0) {
            var payload = unknownPayload;
            logger(prefix + "Transaction Payload");
            if (payload.essence.type === 0) {
                if (payload.essence.inputs) {
                    logger(prefix + "\tInputs:", payload.essence.inputs.length);
                    for (var _i = 0, _a = payload.essence.inputs; _i < _a.length; _i++) {
                        var input = _a[_i];
                        logInput(prefix + "\t\t", input);
                    }
                }
                if (payload.essence.outputs) {
                    logger(prefix + "\tOutputs:", payload.essence.outputs.length);
                    for (var _b = 0, _c = payload.essence.outputs; _b < _c.length; _b++) {
                        var output = _c[_b];
                        logOutput(prefix + "\t\t", output);
                    }
                }
                logPayload(prefix + "\t", payload.essence.payload);
            }
            if (payload.unlockBlocks) {
                logger(prefix + "\tUnlock Blocks:", payload.unlockBlocks.length);
                for (var _d = 0, _e = payload.unlockBlocks; _d < _e.length; _d++) {
                    var unlockBlock = _e[_d];
                    logUnlockBlock(prefix + "\t\t", unlockBlock);
                }
            }
        }
        else if (unknownPayload.type === 1) {
            var payload = unknownPayload;
            logger(prefix + "Milestone Payload");
            logger(prefix + "\tIndex:", payload.index);
            logger(prefix + "\tTimestamp:", payload.timestamp);
            logger(prefix + "\tInclusion Merkle Proof:", payload.inclusionMerkleProof);
            logger(prefix + "\tSignatures:", payload.signatures);
        }
        else if (unknownPayload.type === 2) {
            var payload = unknownPayload;
            logger(prefix + "Indexation Payload");
            logger(prefix + "\tIndex:", payload.index);
            logger(prefix + "\tData:", converter_1.Converter.hexToAscii(payload.data));
        }
    }
}
exports.logPayload = logPayload;
/**
 * Log an address to the console.
 * @param prefix The prefix for the output.
 * @param unknownAddress The address to log.
 */
function logAddress(prefix, unknownAddress) {
    if (unknownAddress) {
        if (unknownAddress.type === 1) {
            var address = unknownAddress;
            logger(prefix + "Ed25519 Address");
            logger(prefix + "\tAddress:", address.address);
        }
    }
}
exports.logAddress = logAddress;
/**
 * Log signature to the console.
 * @param prefix The prefix for the output.
 * @param unknownSignature The signature to log.
 */
function logSignature(prefix, unknownSignature) {
    if (unknownSignature) {
        if (unknownSignature.type === 1) {
            var signature = unknownSignature;
            logger(prefix + "Ed25519 Signature");
            logger(prefix + "\tPublic Key:", signature.publicKey);
            logger(prefix + "\tSignature:", signature.signature);
        }
    }
}
exports.logSignature = logSignature;
/**
 * Log input to the console.
 * @param prefix The prefix for the output.
 * @param unknownInput The input to log.
 */
function logInput(prefix, unknownInput) {
    if (unknownInput) {
        if (unknownInput.type === 0) {
            var input = unknownInput;
            logger(prefix + "UTXO Input");
            logger(prefix + "\tTransaction Id:", input.transactionId);
            logger(prefix + "\tTransaction Output Index:", input.transactionOutputIndex);
        }
    }
}
exports.logInput = logInput;
/**
 * Log output to the console.
 * @param prefix The prefix for the output.
 * @param unknownOutput The output to log.
 */
function logOutput(prefix, unknownOutput) {
    if (unknownOutput) {
        if (unknownOutput.type === 0) {
            var output = unknownOutput;
            logger(prefix + "Signature Locked Single Output");
            logAddress(prefix + "\t\t", output.address);
            logger(prefix + "\t\tAmount:", output.amount);
        }
    }
}
exports.logOutput = logOutput;
/**
 * Log unlock block to the console.
 * @param prefix The prefix for the output.
 * @param unknownUnlockBlock The unlock block to log.
 */
function logUnlockBlock(prefix, unknownUnlockBlock) {
    if (unknownUnlockBlock) {
        if (unknownUnlockBlock.type === 0) {
            var unlockBlock = unknownUnlockBlock;
            logger(prefix + "\tSignature Unlock Block");
            logSignature(prefix + "\t\t\t", unlockBlock.signature);
        }
        else if (unknownUnlockBlock.type === 1) {
            var unlockBlock = unknownUnlockBlock;
            logger(prefix + "\tReference Unlock Block");
            logger(prefix + "\t\tReference:", unlockBlock.reference);
        }
    }
}
exports.logUnlockBlock = logUnlockBlock;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2luZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9sb2dnaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQVdBLHlDQUF3QztBQUV4Qzs7Ozs7R0FLRztBQUNILElBQUksTUFBTSxHQUE4QyxVQUFDLE9BQWUsRUFBRSxJQUFhO0lBQ25GLE9BQUEsQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUF4RSxDQUF3RSxDQUFDO0FBRTdFOzs7R0FHRztBQUNILFNBQWdCLFNBQVMsQ0FBQyxHQUE4QztJQUNwRSxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQ2pCLENBQUM7QUFGRCw4QkFFQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQixVQUFVLENBQUMsTUFBYyxFQUFFLE9BQWlCO0lBQ3hELE1BQU0sQ0FBSSxNQUFNLGtCQUFlLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3BELE1BQU0sQ0FBSSxNQUFNLDJCQUF3QixFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3BFLE1BQU0sQ0FBSSxNQUFNLDJCQUF3QixFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3BFLFVBQVUsQ0FBSSxNQUFNLE9BQUksRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDM0MsSUFBSSxPQUFPLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRTtRQUM3QixNQUFNLENBQUksTUFBTSxhQUFVLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzlDO0FBQ0wsQ0FBQztBQVJELGdDQVFDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLFVBQVUsQ0FBQyxNQUFjLEVBQUUsY0FBbUM7SUFDMUUsSUFBSSxjQUFjLEVB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