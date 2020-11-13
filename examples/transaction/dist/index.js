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
const iota2_js_1 = require("@iota/iota2.js");
const API_ENDPOINT = "http://localhost:14265";
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new iota2_js_1.SingleNodeClient(API_ENDPOINT);
        // These are the default values from the Hornet alphanet configuration
        const privateKey = "256a818b2aac458941f7274985a410e57fb750f3a3a67969ece5bd9ae7eef5b2f7868ab6bb55800b77b8b74191ad8285a9bf428ace579d541fda47661803ff44";
        const publicKey = "f7868ab6bb55800b77b8b74191ad8285a9bf428ace579d541fda47661803ff44";
        console.log("Genesis");
        console.log("\tPrivate Key:", privateKey);
        console.log("\tPublic Key:", publicKey);
        const genesisSeedKeyPair = {
            privateKey: iota2_js_1.Converter.hexToBytes(privateKey),
            publicKey: iota2_js_1.Converter.hexToBytes(publicKey)
        };
        const genesisAddress = iota2_js_1.Ed25519Address.publicKeyToAddress(genesisSeedKeyPair.publicKey);
        const genesisAddressHex = iota2_js_1.Converter.bytesToHex(genesisAddress);
        console.log("\tAddress:", genesisAddressHex);
        // Create a new seed for the wallet
        const walletSeed = iota2_js_1.Ed25519Seed.fromBytes(iota2_js_1.Converter.hexToBytes("e57fb750f3a3a67969ece5bd9ae7eef5b2256a818b2aac458941f7274985a410"));
        // Use the new seed like a wallet with Bip32 Paths
        const walletPath = new iota2_js_1.Bip32Path("m/0");
        const walletAddressSeed = walletSeed.generateSeedFromPath(walletPath);
        const newAddress = iota2_js_1.Converter.bytesToHex(iota2_js_1.Ed25519Address.publicKeyToAddress(walletAddressSeed.keyPair().publicKey));
        console.log("Wallet 1");
        console.log("\tSeed:", iota2_js_1.Converter.bytesToHex(walletSeed.toBytes()));
        console.log("\tPath:", walletPath.toString());
        console.log(`\tAddress ${walletPath.toString()}:`, newAddress);
        console.log();
        // Because we are using the genesis address we must use send advanced as the input address is
        // not calculated from a Bip32 path, if you were doing a wallet to wallet transfer you can just use send
        // which calculates all the inputs/outputs for you
        const genesisAddressOutputs = yield client.addressOutputs(genesisAddressHex);
        const inputsWithKeyPairs = [];
        let totalGenesis = 0;
        for (let i = 0; i < genesisAddressOutputs.outputIds.length; i++) {
            const output = yield client.output(genesisAddressOutputs.outputIds[i]);
            if (!output.isSpent) {
                inputsWithKeyPairs.push({
                    input: {
                        type: 0,
                        transactionId: output.transactionId,
                        transactionOutputIndex: output.outputIndex
                    },
                    addressKeyPair: genesisSeedKeyPair
                });
                totalGenesis += output.output.amount;
            }
        }
        const amountToSend = 1000;
        const outputs = [
            // This is the transfer to the new address
            {
                address: newAddress,
                amount: amountToSend
            },
            // Sending remainder back to genesis
            {
                address: genesisAddressHex,
                amount: totalGenesis - amountToSend
            }
        ];
        const { messageId } = yield iota2_js_1.sendAdvanced(client, inputsWithKeyPairs, outputs, "WALLET", iota2_js_1.Converter.asciiToBytes("Not trinity"));
        console.log("Created Message Id", messageId);
        const newAddressBalance = yield iota2_js_1.getBalance(client, walletSeed, new iota2_js_1.Bip32Path());
        console.log("Wallet 1 Address Balance", newAddressBalance);
        const unspentAddress = yield iota2_js_1.getUnspentAddress(client, walletSeed, new iota2_js_1.Bip32Path());
        console.log("Wallet 1 First Unspent Address", unspentAddress);
        const allUspentAddresses = yield iota2_js_1.getUnspentAddresses(client, walletSeed, new iota2_js_1.Bip32Path());
        console.log("Wallet 1 Unspent Addresses", allUspentAddresses);
    });
}
run()
    .then(() => console.log("Done"))
    .catch((err) => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBb007QUFFcE0sTUFBTSxZQUFZLEdBQUcsd0JBQXdCLENBQUM7QUFFOUMsU0FBZSxHQUFHOztRQUNkLE1BQU0sTUFBTSxHQUFHLElBQUksMkJBQWdCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFbEQsc0VBQXNFO1FBQ3RFLE1BQU0sVUFBVSxHQUFHLGtJQUFrSSxDQUFDO1FBQ3RKLE1BQU0sU0FBUyxHQUFHLGtFQUFrRSxDQUFDO1FBRXJGLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUV4QyxNQUFNLGtCQUFrQixHQUFhO1lBQ2pDLFVBQVUsRUFBRSxvQkFBUyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUM7WUFDNUMsU0FBUyxFQUFFLG9CQUFTLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQztTQUM3QyxDQUFDO1FBRUYsTUFBTSxjQUFjLEdBQUcseUJBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN2RixNQUFNLGlCQUFpQixHQUFHLG9CQUFTLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQy9ELE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFFN0MsbUNBQW1DO1FBQ25DLE1BQU0sVUFBVSxHQUFnQixzQkFBVyxDQUFDLFNBQVMsQ0FBQyxvQkFBUyxDQUFDLFVBQVUsQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDLENBQUM7UUFFaEosa0RBQWtEO1FBQ2xELE1BQU0sVUFBVSxHQUFHLElBQUksb0JB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