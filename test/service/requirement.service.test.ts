import { CharacterProvider } from "../../src/provider/character.provider";
import { CharacterService } from "../../src/service/character.service";
import { RequirementProvider } from "../../src/provider/requirement.provider";
import { RequirementSerivce } from "../../src/service/requirement.service";

let characterProvider = new CharacterProvider();
let characterService = new CharacterService(characterProvider);
let requirementProvider = new RequirementProvider();
let service = new RequirementSerivce(requirementProvider, characterService);

function testTranslateSuffix() {
    let testcases = [
        { "zh": "(宝石)", "en": "(gem)" },
        { "zh": "(珠宝)", "en": "(jewel)" },
    ];

    for (let t of testcases) {
        let zh = t["zh"];
        let en = t["en"];

        test(`translate requirement suffix: ${zh} to ${en}`, () => {
            expect(service.translateSuffix(zh)).toBe(en);
        });
    }
}

testTranslateSuffix();