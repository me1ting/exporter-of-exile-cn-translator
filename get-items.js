import { properties } from './load-resources.js';
import {
    transName, transBaseType, transProperty, transRequirement, transEnchantMod, transExplicitMod,
    transImplicitMod, transCraftedMod, transUtilityMod, transFracturedMod, transScourgeMods,
    transGem, transGemProperty
} from './resources.js';

export function translate(data) {
    const items = data.items;
    let translatedItems = [];
    for (const item of items) {
        //跳过背包物品
        if (item.inventoryId === "MainInventory") {
            continue;
        }

        //跳过赏金饰品
        if (item.baseType === "赏金猎人饰品") {
            continue;
        }

        translateItem(item);

        translatedItems.push(item);
    }
    data.items = translatedItems;
}

export function translateItem(item) {
    //无用字段，对POB没有任何影响，这里删除只是为了减少最终Code的大小
    if (item.icon) {
        item.icon = "";
    }
    if (item.secDescrText) {
        item.secDescrText = "";
    }
    if (item.descrText) {
        item.descrText = "";
    }
    if (item.flavourText) {
        item.flavourText = [];
    }

    if (item.name) {
        item.name = transName(item.name);
    }

    if (item.baseType) {
        item.baseType = transBaseType(item.baseType);
    }

    item.typeLine = item.baseType;


    if (item.properties) {
        for (const p of item.properties) {
            p.name = transProperty(p.name);

            //仅限珠宝，范围值需要翻译：大、中、小
            if (p.name === "Radius") {
                if (p.values) {
                    let val = p.values[0];
                    val[0] = transProperty(val[0]);
                }
            }
        }
    }

    if (item.requirements) {
        for (const r of item.requirements) {
            r.name = transRequirement(r.name);
            if (r.suffix) {
                r.suffix = transRequirement(r.suffix);
            }
        }
    }

    if (item.enchantMods) {
        for (let i = 0; i < item.enchantMods.length; i++) {
            let m = item.enchantMods[i];
            item.enchantMods[i] = transEnchantMod(m);
        }
    }

    if (item.explicitMods) {
        for (let i = 0; i < item.explicitMods.length; i++) {
            let m = item.explicitMods[i];
            item.explicitMods[i] = transExplicitMod(m);
        }
    }

    if (item.implicitMods) {
        for (let i = 0; i < item.implicitMods.length; i++) {
            let m = item.implicitMods[i];
            item.implicitMods[i] = transImplicitMod(m);
        }
    }

    if (item.craftedMods) {
        for (let i = 0; i < item.craftedMods.length; i++) {
            let m = item.craftedMods[i];
            item.craftedMods[i] = transCraftedMod(m);
        }
    }

    if (item.utilityMods) {
        for (let i = 0; i < item.utilityMods.length; i++) {
            let m = item.utilityMods[i];
            item.utilityMods[i] = transUtilityMod(m);
        }
    }

    if (item.fracturedMods) {
        for (let i = 0; i < item.fracturedMods.length; i++) {
            let m = item.fracturedMods[i];
            item.fracturedMods[i] = transFracturedMod(m);
        }
    }
    if (item.scourgeMods) {
        for (let i = 0; i < item.scourgeMods.length; i++) {
            let m = item.scourgeMods[i];
            item.scourgeMods[i] = transScourgeMods(m);
        }
    }

    // 孔上有两种情况：
    // 技能。
    // 深渊珠宝。
    if (item.socketedItems) {
        for (let si of item.socketedItems) {
            if (si.abyssJewel) {
                translateItem(si);
            } else {
                translateGem(si);
            }

        }
    }
}

function translateGem(item) {
    if (item.icon) {
        item.icon = "";
    }
    if (item.secDescrText) {
        item.secDescrText = "";
    }
    if (item.descrText) {
        item.descrText = "";
    }

    item.baseType = transGem(item.baseType);
    item.typeLine = transGem(item.typeLine);

    if (item.properties) {
        //props[0]记录的是宝石的标签
        //对于宝石的props，实际只需要翻译等级、品质两个属性。
        for (let i = 1; i < item.properties.length; i++) {
            let p = item.properties[i];
            p.name = transGemProperty(p.name);
        }
    }
}