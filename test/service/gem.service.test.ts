import { GemProvider } from "../../src/provider/gem.provider";
import { GemService } from "../../src/service/gem.service";

let provider = new GemProvider();
let service = new GemService(provider);

function testTranslateTypeLine(){
    let testcases = [
        {"zh":"魅影 旋风斩","en":"Phantasmal Cyclone"},
        {"zh":"分歧 秘术增强(辅)","en":"Divergent Arcane Surge Support"},
        {"zh":"异常 暗影印记","en":"Anomalous Assassin's Mark"}
    ]

    for (let t of testcases) {
        let zh = t["zh"];
        let en = t["en"];
        
        test(`translate gem type line: ${zh} to ${en}`, () => {
            expect(service.translateTypeLine(zh)).toBe(en);
        });
    }
}

testTranslateTypeLine();