import { BaseTypeProvider } from "../../src/provider/basetype.provider";
import { BaseTypeService } from "../../src/service/basetype.service";


let provider = new BaseTypeProvider();
let service = new BaseTypeService(provider);

function testTranslateBaseType() {
    let testcases = [
        { "zh": "刚玉药剂", "en": "Corundum Flask" }
    ]

    for (let t of testcases) {
        let zh = t["zh"];
        let en = t["en"];


        test(`translate basetype: ${zh} to ${en}`, () => {
            expect(service.translateBaseType(zh)).toBe(en);
        });
    }
}

function testTranslateTypeLine() {
    let testcases = [
        { "zh": "嗜血的永恒之剑", "en": "Eternal Sword" }
    ]

    for (let t of testcases) {
        let zh = t["zh"];
        let en = t["en"];


        test(`translate basetype: ${zh} to ${en}`, () => {
            expect(service.translateTypeLine(zh)).toBe(en);
        });
    }
}

testTranslateBaseType();
testTranslateTypeLine();