"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logUnlockBlock = exports.logOutput = exports.logInput = exports.logSignature = exports.logAddress = exports.logPayload = exports.logMessageMetadata = exports.logMessage = exports.logTips = exports.logInfo = exports.setLogger = void 0;
var IEd25519Address_1 = require("../models/IEd25519Address");
var IEd25519Signature_1 = require("../models/IEd25519Signature");
var IIndexationPayload_1 = require("../models/IIndexationPayload");
var IMilestonePayload_1 = require("../models/IMilestonePayload");
var IReferenceUnlockBlock_1 = require("../models/IReferenceUnlockBlock");
var ISigLockedSingleOutput_1 = require("../models/ISigLockedSingleOutput");
var ISignatureUnlockBlock_1 = require("../models/ISignatureUnlockBlock");
var ITransactionEssence_1 = require("../models/ITransactionEssence");
var ITransactionPayload_1 = require("../models/ITransactionPayload");
var IUTXOInput_1 = require("../models/IUTXOInput");
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
 * Log the node information.
 * @param prefix The prefix for the output.
 * @param info The info to log.
 */
function logInfo(prefix, info) {
    logger(prefix + "\tName:", info.name);
    logger(prefix + "\tVersion:", info.version);
    logger(prefix + "\tNetwork Id:", info.networkId);
    logger(prefix + "\tIs Healthy:", info.isHealthy);
    logger(prefix + "\tLatest Milestone Index:", info.latestMilestoneIndex);
    logger(prefix + "\tSolid Milestone Index:", info.solidMilestoneIndex);
    logger(prefix + "\tPruning Index:", info.pruningIndex);
    logger(prefix + "\tFeatures:", info.features);
}
exports.logInfo = logInfo;
/**
 * Log the tips information.
 * @param prefix The prefix for the output.
 * @param tips The tips to log.
 */
function logTips(prefix, tips) {
    logger(prefix + "\tTip 1 Message Id:", tips.tip1MessageId);
    logger(prefix + "\tTip 2 Message Id:", tips.tip2MessageId);
}
exports.logTips = logTips;
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
 * Log the message metadata to the console.
 * @param prefix The prefix for the output.
 * @param messageMetadata The messageMetadata to log.
 */
function logMessageMetadata(prefix, messageMetadata) {
    console.log(prefix + "\tMessage Id:", messageMetadata.messageId);
    console.log(prefix + "\tParent 1 Message Id:", messageMetadata.parent1MessageId);
    console.log(prefix + "\tParent 2 Message Id:", messageMetadata.parent2MessageId);
    if (messageMetadata.isSolid !== undefined) {
        console.log(prefix + "\tIs Solid:", messageMetadata.isSolid);
    }
    if (messageMetadata.referencedByMilestoneIndex !== undefined) {
        console.log(prefix + "\tReferenced By Milestone Index:", messageMetadata.referencedByMilestoneIndex);
    }
    console.log(prefix + "\tLedger Inclusion State:", messageMetadata.ledgerInclusionState);
    if (messageMetadata.shouldPromote !== undefined) {
        console.log(prefix + "\tShould Promote:", messageMetadata.shouldPromote);
    }
    if (messageMetadata.shouldReattach !== undefined) {
        console.log(prefix + "\tShould Reattach:", messageMetadata.shouldReattach);
    }
}
exports.logMessageMetadata = logMessageMetadata;
/**
 * Log a message to the console.
 * @param prefix The prefix for the output.
 * @param unknownPayload The payload.
 */
function logPayload(prefix, unknownPayload) {
    if (unknownPayload) {
        if (unknownPayload.type === ITransactionPayload_1.TRANSACTION_PAYLOAD_TYPE) {
            var payload = unknownPayload;
            logger(prefix + "Transaction Payload");
            if (payload.essence.type === ITransactionEssence_1.TRANSACTION_ESSENCE_TYPE) {
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
        else if (unknownPayload.type === IMilestonePayload_1.MILESTONE_PAYLOAD_TYPE) {
            var payload = unknownPayload;
            logger(prefix + "Milestone Payload");
            logger(prefix + "\tIndex:", payload.index);
            logger(prefix + "\tTimestamp:", payload.timestamp);
            logger(prefix + "\tInclusion Merkle Proof:", payload.inclusionMerkleProof);
            logger(prefix + "\tSignatures:", payload.signatures);
        }
        else if (unknownPayload.type === IIndexationPayload_1.INDEXATION_PAYLOAD_TYPE) {
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
        if (unknownAddress.type === IEd25519Address_1.ED25519_ADDRESS_TYPE) {
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
        if (unknownSignature.type === IEd25519Signature_1.ED25519_SIGNATURE_TYPE) {
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
        if (unknownInput.type === IUTXOInput_1.UTXO_INPUT_TYPE) {
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
        if (unknownOutput.type === ISigLockedSingleOutput_1.SIG_LOCKED_SINGLE_OUTPUT_TYPE) {
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
        if (unknownUnlockBlock.type === ISignatureUnlockBlock_1.SIGNATURE_UNLOCK_BLOCK_TYPE) {
            var unlockBlock = unknownUnlockBlock;
            logger(prefix + "\tSignature Unlock Block");
            logSignature(prefix + "\t\t\t", unlockBlock.signature);
        }
        else if (unknownUnlockBlock.type === IReferenceUnlockBlock_1.REFERENCE_UNLOCK_BLOCK_TYPE) {
            var unlockBlock = unknownUnlockBlock;
            logger(prefix + "\tReference Unlock Block");
            logger(prefix + "\t\tReference:", unlockBlock.reference);
        }
    }
}
exports.logUnlockBlock = logUnlockBlock;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2luZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9sb2dnaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDZEQUFrRjtBQUNsRixpRUFBd0Y7QUFDeEYsbUVBQTJGO0FBRzNGLGlFQUF3RjtBQUV4Rix5RUFBcUc7QUFDckcsMkVBQXlHO0FBQ3pHLHlFQUFxRztBQUNyRyxxRUFBeUU7QUFDekUscUVBQThGO0FBRTlGLG1EQUFtRTtBQUNuRSx5Q0FBd0M7QUFFeEM7Ozs7O0dBS0c7QUFDSCxJQUFJLE1BQU0sR0FBOEMsVUFBQyxPQUFlLEVBQUUsSUFBYTtJQUNuRixPQUFBLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFBeEUsQ0FBd0UsQ0FBQztBQUU3RTs7O0dBR0c7QUFDSCxTQUFnQixTQUFTLENBQUMsR0FBOEM7SUFDcEUsTUFBTSxHQUFHLEdBQUcsQ0FBQztBQUNqQixDQUFDO0FBRkQsOEJBRUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBZ0IsT0FBTyxDQUFDLE1BQWMsRUFBRSxJQUFlO0lBQ25ELE1BQU0sQ0FBSSxNQUFNLFlBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEMsTUFBTSxDQUFJLE1BQU0sZUFBWSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM1QyxNQUFNLENBQUksTUFBTSxrQkFBZSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNqRCxNQUFNLENBQUksTUFBTSxrQkFBZSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNqRCxNQUFNLENBQUksTUFBTSw4QkFBMkIsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUN4RSxNQUFN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