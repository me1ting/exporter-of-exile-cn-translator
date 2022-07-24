import { BaseTypeProvider } from "./provider/basetype.provider";
import { CharacterProvider } from "./provider/character.provider";
import { GemProvider } from "./provider/gem.provider";
import { PassiveSkillProvider } from "./provider/passiveskill.provider";
import { PropertyProvider } from "./provider/property.provider";
import { RequirementProvider } from "./provider/requirement.provider";
import { StatProvider } from "./provider/stat.provider";
import { BaseTypeService } from "./service/basetype.service";
import { CharacterService } from "./service/character.service";
import { GemService } from "./service/gem.service";
import { ItemService } from "./service/item.service";
import { PassiveSkillService } from "./service/passiveskill.service";
import { PropertyService } from "./service/property.service";
import { RequirementSerivce } from "./service/requirement.service";
import { StatService } from "./service/stat.service";
import { ZH_PROPERTY_NAME_LIMITED_TO, ZH_PROPERTY_NAME_RADIUS } from "./type/property.type";
import { ZH_REQUIREMENT_NAME_CLASS } from "./type/requirement.type";

const ZH_THIEFS_TRINKET = "赏金猎人饰品";

export class Translator {
    private readonly baseTypeProvider: BaseTypeProvider;
    private readonly baseTypeService: BaseTypeService;
    private readonly itemService: ItemService;
    private readonly requirementProvider: RequirementProvider;
    private readonly characterProvider: CharacterProvider;
    private readonly characterService: CharacterService;
    private readonly requirementService: RequirementSerivce;
    private readonly propertyProvider: PropertyProvider;
    private readonly propertySerivce: PropertyService;
    private readonly gemProvider: GemProvider;
    private readonly gemService: GemService;
    private readonly passiveSkillProvider: PassiveSkillProvider;
    private readonly passiveSkillService: PassiveSkillService;
    private readonly statProvider: StatProvider;
    private readonly statService: StatService;

    constructor() {
        this.baseTypeProvider = new BaseTypeProvider();
        this.baseTypeService = new BaseTypeService(this.baseTypeProvider);
        this.itemService = new ItemService(this.baseTypeProvider);
        this.requirementProvider = new RequirementProvider();
        this.characterProvider = new CharacterProvider();
        this.characterService = new CharacterService(this.characterProvider);
        this.requirementService = new RequirementSerivce(this.requirementProvider, this.characterService);
        this.propertyProvider = new PropertyProvider();
        this.propertySerivce = new PropertyService(this.propertyProvider);
        this.gemProvider = new GemProvider();
        this.gemService = new GemService(this.gemProvider);
        this.passiveSkillProvider = new PassiveSkillProvider();
        this.passiveSkillService = new PassiveSkillService(this.passiveSkillProvider);
        this.statProvider = new StatProvider();
        this.statService = new StatService(this.passiveSkillService,this.statProvider);
    }

    public translateItems(data: any) {
        const items = data.items;
        let translatedItems = [];
        for (const item of items) {
            //Skip non-build items
            if (item.inventoryId === "MainInventory" || item.baseType === ZH_THIEFS_TRINKET) {
                continue;
            }

            this.translateItem(item);

            translatedItems.push(item);
        }
        data.items = translatedItems;
        return data;
    }

    translateItem(item: any) {
        const zhBaseType = item.baseType;
        const zhName = item.name;
        const zhTypeLine = item.typeLine;

        if (zhName) {
            let res = this.itemService.translateName(zhName, zhBaseType);
            if (res) {
                item.name = res;
            } else {
                console.log(`warning: should be translated: item name, ${zhName}`);
            }
        }

        if (zhBaseType) {
            let res = this.baseTypeService.translateBaseType(zhBaseType, zhName);
            if (res) {
                item.baseType = res;
            } else {
                console.log(`warning: should be translated: base type, ${zhBaseType}`);
            }
        }

        if (zhTypeLine) {
            item.typeLine = item.baseType;
        }

        if (item.requirements) {
            for (const r of item.requirements) {
                const zhName = r.name;
                let res = this.requirementService.translateName(zhName);
                if (res) {
                    r.name = res;
                } else {
                    console.log(`warning: should be translated: requirement name, ${zhName}`);
                }

                if (zhName === ZH_REQUIREMENT_NAME_CLASS) {
                    if (r.values) {
                        for (const v of r.values) {
                            let zhValue = v[0];
                            let res = this.requirementService.translateValue(zhName, zhValue);
                            if (res) {
                                v[0] = res;
                            } else {
                                console.log(`warning: should be translated: requirement value, ${zhValue}`);
                            }
                        }
                    }
                }

                if (r.suffix) {
                    let zhSuffix = r.suffix;
                    let res = this.requirementService.translateSuffix(zhSuffix);
                    if (res) {
                        r.suffix = res;
                    } else {
                        console.log(`warning: should be translated: requirement suffix, ${zhSuffix}`);
                    }
                }
            }
        }

        if (item.properties) {
            for (const p of item.properties) {
                const zhName = p.name;
                let res = this.propertySerivce.translateName(zhName);
                if (res) {
                    p.name = res;
                } else {
                    console.log(`warning: should be translated: property name, ${zhName}`);
                }

                if (zhName === ZH_PROPERTY_NAME_LIMITED_TO || zhName === ZH_PROPERTY_NAME_RADIUS) {
                    if (p.values) {
                        for (const v of p.values) {
                            let zhValue = v[0];
                            let res = this.propertySerivce.translateValue(zhName, zhValue);
                            if (res) {
                                v[0] = res;
                            } else {
                                console.log(`warning: should be translated: property value, ${zhValue}`);
                            }
                        }
                    }
                }
            }
        }

        if (item.socketedItems) {
            for (const si of item.socketedItems) {
                if (si.abyssJewel) {
                    this.translateItem(si);
                } else {
                    this.translateGem(si);
                }
            }
        }

        if (item.enchantMods) {
            for (let i = 0; i < item.enchantMods.length; i++) {
                let zhStat = item.enchantMods[i];
                let res = this.statService.translateMod(zhStat, zhBaseType);
                if (res) {
                    item.enchantMods[i] = res;
                } else {
                    console.log(`warning: should be translated: stat: ${zhStat}`);
                }
            }
        }

        if (item.explicitMods) {
            for (let i = 0; i < item.explicitMods.length; i++) {
                let zhStat = item.explicitMods[i];
                let res = this.statService.translateMod(zhStat, zhBaseType);
                if (res) {
                    item.explicitMods[i] = res;
                } else {
                    console.log(`warning: should be translated: stat: ${zhStat}`);
                }
            }
        }

        if (item.implicitMods) {
            for (let i = 0; i < item.implicitMods.length; i++) {
                let zhStat = item.implicitMods[i];
                let res = this.statService.translateMod(zhStat, zhBaseType);
                if (res) {
                    item.implicitMods[i] = res;
                } else {
                    console.log(`warning: should be translated: stat: ${zhStat}`);
                }
            }
        }

        if (item.craftedMods) {
            for (let i = 0; i < item.craftedMods.length; i++) {
                let zhStat = item.craftedMods[i];
                let res = this.statService.translateMod(zhStat, zhBaseType);
                if (res) {
                    item.craftedMods[i] = res;
                } else {
                    console.log(`warning: should be translated: stat: ${zhStat}`);
                }
            }
        }

        if (item.utilityMods) {
            for (let i = 0; i < item.utilityMods.length; i++) {
                let zhStat = item.utilityMods[i];
                let res = this.statService.translateMod(zhStat, zhBaseType);
                if (res) {
                    item.utilityMods[i] = res;
                } else {
                    console.log(`warning: should be translated: stat: ${zhStat}`);
                }
            }
        }

        if (item.fracturedMods) {
            for (let i = 0; i < item.fracturedMods.length; i++) {
                let zhStat = item.fracturedMods[i];
                let res = this.statService.translateMod(zhStat, zhBaseType);
                if (res) {
                    item.fracturedMods[i] = res;
                } else {
                    console.log(`warning: should be translated: stat: ${zhStat}`);
                }
            }
        }

        if (item.scourgeMods) {
            for (let i = 0; i < item.scourgeMods.length; i++) {
                let zhStat = item.scourgeMods[i];
                let res = this.statService.translateMod(zhStat, zhBaseType);
                if (res) {
                    item.scourgeMods[i] = res;
                } else {
                    console.log(`warning: should be translated: stat: ${zhStat}`);
                }
            }
        }
    }

    translateGem(item: any) {
        const zhBaseType = item.baseType;
        const zhTypeLine = item.typeLine;
        if (zhBaseType) {
            let res = this.gemService.translateBaseType(zhBaseType);
            if (res) {
                item.baseType = res;
            } else {
                console.log(`warning: should be translated: gem base type: ${zhBaseType}`);
            }
        }

        if (zhTypeLine) {
            let res = this.gemService.translateTypeLine(zhTypeLine);
            if (res) {
                item.typeLine = res;
            } else {
                console.log(`warning: should be translated: gem type line: ${zhTypeLine}`);
            }
        }

        if (item.properties) {
            for (const p of item.properties) {
                let res = this.gemService.translatePropertyName(p.name);
                if (res) {
                    p.name = res;
                }
            }
        }
    }

    public translatePassiveSkills(data: any) {
        if (data.items) {
            for (const item of data.items) {
                this.translateItem(item);
            }
        }
    }

    public translateGoods(data: any) {
    }
}