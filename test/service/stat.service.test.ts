import { PassiveSkillProvider } from "../../src/provider/passiveskill.provider";
import { PassiveSkillService } from "../../src/service/passiveskill.service";
import { StatProvider } from "../../src/provider/stat.provider";
import { StatService } from "../../src/service/stat.service";

const passiveSkillProvider = new PassiveSkillProvider();
const passiveSkillService = new PassiveSkillService(passiveSkillProvider);
const statProvider = new StatProvider();
const statService = new StatService(passiveSkillService, statProvider);

function testTranslateModOfAllocation() {
    let testcases = [
        { "zh": "配置 复仇奔流", "en": "Allocates Vengeant Cascade", "zhBaseType": "琥珀护身符" },
    ];

    for (let t of testcases) {
        let zh = t["zh"];
        let en = t["en"];
        let zhBaseType = t["zhBaseType"];

        test(`translate stat: ${zh} to ${en}`, () => {
            expect(statService.translateMod(zh, zhBaseType)).toBe(en);
        });
    }
}

function testTranslateMod() {
    let testcases = [
        { "zh": "+5 最大生命", "en": "+5 to maximum Life", "zhBaseType": "" },
        { "zh": "攻击的魔力消耗降低 24%", "en": "24% reduced Mana Cost of Attacks", "zhBaseType": "" },
    ];

    for (let t of testcases) {
        let zh = t["zh"];
        let en = t["en"];
        let zhBaseType = t["zhBaseType"];

        test(`translate stat: ${zh} to ${en}`, () => {
            expect(statService.translateMod(zh, zhBaseType)).toBe(en);
        });
    }
}

testTranslateModOfAllocation();
testTranslateMod();