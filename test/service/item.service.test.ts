import { BaseTypeProvider } from "../../src/provider/basetype.provider";
import { ItemService } from "../../src/service/item.service";

let provider = new BaseTypeProvider();
let service = new ItemService(provider);

function testTranslateName() {
    let testcases = [
        { "zh": "时空扭曲", "zhBaseType": "青玉护身符", "en": "Warped Timepiece" },
        { "zh": "时空扭曲", "zhBaseType": "月光石戒指", "en": "Timetwist" },
        { "zh": "怒气 灵具", "zhBaseType": "潜能之戒", "en": "Item" },
    ];

    for (let t of testcases) {
        let zh = t["zh"];
        let zhBaseType = t["zhBaseType"];
        let en = t["en"];
        
        test(`translate item name: ${zh} to ${en}`, () => {
            expect(service.translateName(zh, zhBaseType)).toBe(en);
        });
    }
}

testTranslateName();