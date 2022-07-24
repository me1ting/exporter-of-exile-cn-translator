import items from "../testcase/items/1.json";
import passiveSkills from "../testcase/passiveSkills/1.json";
import {Translator} from "../src/lib";

const t = new Translator();

function isASCII(str: string): boolean {
    return /^[\x00-\x7F]*$/.test(str);
}

function testTranslateItems(){
    test("translate items",()=>{    
        t.translateItems(items);
        expect(isASCII(items.items[0].baseType));
    });
}

function testTransaltePassiveSkills(){
    test("translate passkive skills",()=>{    
        t.translatePassiveSkills(passiveSkills);
        expect(isASCII(passiveSkills.items[0].baseType));
    });
}

testTranslateItems();
testTransaltePassiveSkills();