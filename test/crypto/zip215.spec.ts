/* eslint-disable max-len */
import { Zip215 } from "../../src/crypto/zip215";
import { Converter } from "../../src/utils/converter";
import testData from "./zip215.json";

// https://github.com/hdevalence/ed25519consensus/blob/main/zip215_test.go
describe("Zip215", () => {
    test("Can verify with standard tests", () => {
        for (const test of testData) {
            const key = Converter.hexToBytes(test[0]);
            const sig = Converter.hexToBytes(test[1]);

            const v = Zip215.verify(key, Buffer.from("Zcash"), sig);
            expect(v).toEqual(true);
        }
    });
});

