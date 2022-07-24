import { StatProvider } from "../../src/provider/stat.provider";

let provider = new StatProvider();

function testInit() {
    test("init success", () => {
        expect(provider).toBeInstanceOf(StatProvider);
    })
}

testInit();