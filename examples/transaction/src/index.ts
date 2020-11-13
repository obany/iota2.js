import { Bip32Path, Converter, Ed25519Address, Ed25519Seed, getBalance, getUnspentAddress, getUnspentAddresses, IKeyPair, ISeed, IUTXOInput, sendAdvanced, SingleNodeClient } from "@iota/iota2.js";

const API_ENDPOINT = "http://localhost:14265";

async function run() {
    const client = new SingleNodeClient(API_ENDPOINT);

    // These are the default values from the Hornet alphanet configuration
    const privateKey = "256a818b2aac458941f7274985a410e57fb750f3a3a67969ece5bd9ae7eef5b2f7868ab6bb55800b77b8b74191ad8285a9bf428ace579d541fda47661803ff44";
    const publicKey = "f7868ab6bb55800b77b8b74191ad8285a9bf428ace579d541fda47661803ff44";

    console.log("Genesis");
    console.log("\tPrivate Key:", privateKey);
    console.log("\tPublic Key:", publicKey);

    const genesisSeedKeyPair: IKeyPair = {
        privateKey: Converter.hexToBytes(privateKey),
        publicKey: Converter.hexToBytes(publicKey)
    };

    const genesisAddress = Ed25519Address.publicKeyToAddress(genesisSeedKeyPair.publicKey);
    const genesisAddressHex = Converter.bytesToHex(genesisAddress);
    console.log("\tAddress:", genesisAddressHex);

    // Create a new seed for the wallet
    const walletSeed: Ed25519Seed = Ed25519Seed.fromBytes(Converter.hexToBytes("e57fb750f3a3a67969ece5bd9ae7eef5b2256a818b2aac458941f7274985a410"));

    // Use the new seed like a wallet with Bip32 Paths
    const walletPath = new Bip32Path("m/0");
    const walletAddressSeed: ISeed = walletSeed.generateSeedFromPath(walletPath);
    const newAddress: string = Converter.bytesToHex(Ed25519Address.publicKeyToAddress(walletAddressSeed.keyPair().publicKey));

    console.log("Wallet 1");
    console.log("\tSeed:", Converter.bytesToHex(walletSeed.toBytes()));
    console.log("\tPath:", walletPath.toString());
    console.log(`\tAddress ${walletPath.toString()}:`, newAddress);
    console.log();

    // Because we are using the genesis address we must use send advanced as the input address is
    // not calculated from a Bip32 path, if you were doing a wallet to wallet transfer you can just use send
    // which calculates all the inputs/outputs for you
    const genesisAddressOutputs = await client.addressOutputs(genesisAddressHex);

    const inputsWithKeyPairs: {
        input: IUTXOInput;
        addressKeyPair: IKeyPair;
    }[] = [];

    let totalGenesis = 0;

    for (let i = 0; i < genesisAddressOutputs.outputIds.length; i++) {
        const output = await client.output(genesisAddressOutputs.outputIds[i]);
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

    const outputs : {
        address: string;
        amount: number;
    }[] = [
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

    const { messageId } = await sendAdvanced(client, inputsWithKeyPairs, outputs, "WALLET", Converter.asciiToBytes("Not trinity"));

    console.log("Created Message Id", messageId);

    const newAddressBalance = await getBalance(client, walletSeed, new Bip32Path());
    console.log("Wallet 1 Address Balance", newAddressBalance);

    const unspentAddress = await getUnspentAddress(client, walletSeed, new Bip32Path());
    console.log("Wallet 1 First Unspent Address", unspentAddress);

    const allUspentAddresses = await getUnspentAddresses(client, walletSeed, new Bip32Path());
    console.log("Wallet 1 Unspent Addresses", allUspentAddresses);
}


run()
    .then(() => console.log("Done"))
    .catch((err) => console.error(err));