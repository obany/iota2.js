import { Bip32Path, Converter, Ed25519Address, Ed25519Seed, getBalance, getUnspentAddress, getUnspentAddresses, IKeyPair, ISeed, send, SingleNodeClient } from "@iota/iota2.js";

const API_ENDPOINT = "http://localhost:14265";

async function run() {
    const client = new SingleNodeClient(API_ENDPOINT);

    const genesisSeed: ISeed = Ed25519Seed.fromBytes(Converter.hexToBytes("256a818b2aac458941f7274985a410e57fb750f3a3a67969ece5bd9ae7eef5b2"));
    console.log("Genesis");
    console.log("\tSeed:", Converter.bytesToHex(genesisSeed.toBytes()));

    const genesisSeedKeyPair: IKeyPair = genesisSeed.keyPair();
    console.log("\tPrivate Key:", Converter.bytesToHex(genesisSeedKeyPair.privateKey));
    console.log("\tPublic Key:", Converter.bytesToHex(genesisSeedKeyPair.publicKey));

    const genesisAddressPath = new Bip32Path("m/0");
    const firstAddressSeed = genesisSeed.generateSeedFromPath(genesisAddressPath);
    console.log(`\tAddress for ${genesisAddressPath.toString()}:`, Converter.bytesToHex(Ed25519Address.publicKeyToAddress(firstAddressSeed.keyPair().publicKey)));
    console.log();

    const newSeed: Ed25519Seed = Ed25519Seed.fromBytes(Converter.hexToBytes("e57fb750f3a3a67969ece5bd9ae7eef5b2256a818b2aac458941f7274985a410"));

    const newAddressPath = new Bip32Path("m/0");
    const newAddressSeed: ISeed = newSeed.generateSeedFromPath(newAddressPath);
    const newAddress: string = Converter.bytesToHex(Ed25519Address.publicKeyToAddress(newAddressSeed.keyPair().publicKey));
    console.log("New");
    console.log("\tSeed:", Converter.bytesToHex(newSeed.toBytes()));
    console.log(`\tAddress ${newAddressPath.toString()}:`, newAddress);
    console.log();

    const { messageId } = await send(client, genesisSeed, new Bip32Path(), newAddress, 100);

    console.log("Created Message Id", messageId);

    const newAddressBalance = await getBalance(client, newSeed, new Bip32Path());
    console.log("New Address Balance", newAddressBalance);

    const unspentAddress = await getUnspentAddress(client, newSeed, new Bip32Path());
    console.log("First Unspent Address", unspentAddress);

    const allUspentAddresses = await getUnspentAddresses(client, newSeed, new Bip32Path());
    console.log("Unspent Addresses", allUspentAddresses);
}


run()
    .then(() => console.log("Done"))
    .catch((err) => console.error(err));