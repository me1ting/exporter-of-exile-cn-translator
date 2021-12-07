import {
    uniques, weapons, armour, accessories, flasks, gems, properties, requirements,
    formulableNodes, modifiers, jewels, shouldBeTranlated
} from "./load-resources.js";

/**
 * 翻译物品名字。
 * 
 * 存在重复项：
 * 时空扭曲 通过baseType区分
 * 
 * @param {*} str 物品名称
 * @param {*} baseType 物品基础类型，用于区分重复的传奇名称。
 * @returns 
 */
export function transName(str, baseType) {
    //存在重复的传奇名称，这里作硬编码处理。
    if (str === "时空扭曲") {
        if (baseType === "青玉护身符") {
            return "Warped Timepiece";
        } else if (baseType === "月光石戒指") {
            return "Timetwist";
        }
    }
    let val = uniques.get(str);
    // 对于所有非传奇名称，翻译的价值不大，目前使用占位符替代。
    // 直接返回占位符"xxx"，返回原始名称会显示乱码，返回空白字符串会报错。
    return val ? val : "xxx";
}

/**
 * 翻译基础类型。
 * 
 * 存在重复项：
 * 丝绸手套 护甲 调用方通过icon区分
 * 龙骨细剑 武器 除了需求等级，没有任何区别，区分价值不大；由于需求等级又受到词缀影响，因此没法区分。
 * 
 * @param {*} str 类型 
 * @returns 
 */
export function transBaseType(str) {
    let val = weapons.get(str);//武器
    if (!val) {
        val = armour.get(str);//护甲
    }
    if (!val) {
        val = accessories.get(str);//配件
    }
    if (!val) {
        val = flasks.get(str);//药剂
    }
    if (!val) {
        val = gems.get(str);//技能
    }

    if (!val) {
        val = jewels.get(str);//珠宝
    }

    if (!val) {
        shouldBeTranlated({
            "type": "baseType",
            "content": str
        });
    }

    return val ? val : str;
}

/**
 * 翻译属性。
 * @param {*} str 
 * @returns 
 */
export function transProperty(str) {
    let val = properties.get(str);

    if (!val) {
        shouldBeTranlated({
            "type": "property",
            "content": str
        });
    }

    return val ? val : str;
}

export function transRequirement(str) {
    let val = requirements.get(str);
    if (!val) {
        shouldBeTranlated({
            "type": "requirement",
            "content": str
        });
    }
    return val ? val : str;
}

/**
 * 翻译涂油天赋技能。
 * 
 * 存在重复项：电能之击、毁灭装置、毒蛇之牙、英勇、汲血者
 * 由于重复项的重复次数目前最大为2，因此目前使用浏览器原生的confirm进行区分。
 * 如果后续重复次数超过2，可以使用prompt。
 * 
 * @param {*} str 
 * @returns 
 */
export function transFormulableNode(str) {
    if (str === "电能之击") {
        if (confirm) {
            if (confirm("请手动确认天赋技能：电能之击\n\n点击确认选择：若你近期内感电任意敌人，则伤害提高30%...\n点击取消选择：武器造成的伤害穿透 8% 闪电抗性...")) {
                return "Static Blows";
            } else {
                return "Arcing Blows";
            }
        } else {
            console.log("skip passive skill: ", str);
        }
    }

    if (str === "毁灭装置") {
        if (confirm) {
            if (confirm("请手动确认天赋技能：毁灭装置\n\n点击确认选择：地雷持续时间延长 60%...\n点击取消选择：地雷暴击率提高 50%...")) {
                return "Destructive Apparatus";
            } else {
                return "Devastating Devices";
            }
        } else {
            console.log("skip passive skill: ", str);
        }
    }

    if (str === "毒蛇之牙") {
        if (confirm) {
            if (confirm("请手动确认天赋技能：毒蛇之牙\n\n点击确认选择：地雷持续时间延长 60%...\n点击取消选择：地雷暴击率提高 50%...")) {
                return "Adder's Touch";
            } else {
                return "Fangs of the Viper";
            }
        } else {
            console.log("skip passive skill: ", str);
        }
    }

    if (str === "英勇") {
        if (confirm) {
            if (confirm("请手动确认天赋技能：英勇\n\n点击确认选择：闪避值与护甲提高 24%...\n点击取消选择：+30 力量...")) {
                return "Bravery";
            } else {
                return "Prowess";
            }
        } else {
            console.log("skip passive skill: ", str);
        }
    }

    if (str === "汲血者") {
        if (confirm) {
            if (confirm("请手动确认天赋技能：汲血者\n\n点击确认选择：生命上限提高 10%...\n点击取消选择：攻击速度提高 12%...")) {
                return "Blood Drinker";
            } else {
                return "Lust for Carnage";
            }
        } else {
            console.log("skip passive skill: ", str);
        }
    }

    let val = formulableNodes.get(str);
    if (!val) {
        shouldBeTranlated({
            "type": "formulableNode",
            "content": str
        });
    }
    return val ? val : str;
}

const ALLOCATE_CN = "配置 ";
const ALLOCATE_EN = "Allocates ";
const ADDED_SMALL_Passive_SKILL_GRANT_CN = "增加的小天赋获得：";
const ADDED_SMALL_Passive_SKILL_GRANT_EN = "Added Small Passive Skills grant: ";

export function transEnchantMod(str) {
    //项链附魔
    if (str.startsWith(ALLOCATE_CN)) {
        let node = str.substring(ALLOCATE_CN.length);
        return ALLOCATE_EN + transFormulableNode(node);
    }

    //星团珠宝特殊词缀
    if (str.startsWith(ADDED_SMALL_Passive_SKILL_GRANT_CN)) {
        let granted = str.substring(ADDED_SMALL_Passive_SKILL_GRANT_CN.length);
        return ADDED_SMALL_Passive_SKILL_GRANT_EN + transModifier(granted);
    }

    return transModifier(str);
}

export function transExplicitMod(str) {
    return transModifier(str);
}

export function transImplicitMod(str) {
    return transModifier(str);
}

export function transCraftedMod(str) {
    return transModifier(str);
}

export function transUtilityMod(str) {
    return transModifier(str);
}

export function transFracturedMod(str) {
    return transModifier(str);
}

export function transScourgeMods(str) {
    return transModifier(str);
}

function transModifier(str) {
    //整体匹配
    let result = modifiers.get(str);
    if (result) {
        return result.toTplBody;
    }

    //解析匹配
    let m = Modifier.fromString(str);
    result = transModifierInObject(m);
    if (result) {
        return result;
    }

    //解析匹配，但%作为模板主题的部分。
    m = Modifier.fromStringButParamsWithoutPercent(str);
    result = transModifierInObject(m);
    if (result) {
        return result;
    }

    shouldBeTranlated({
        "type": "modifier",
        "content": str
    });

    return str;
}

function transModifierInObject(m) {
    let tplBody = m.getTemplateBody();
    let t = modifiers.get(tplBody);
    if (t) {
        let toTplBody = t.toTplBody;
        let fromParams = t.fromParams;
        let toParams = t.toParams;

        let toTpl = Template.fromBodyAndFormalParams(toTplBody, toParams);
        let mapping = new Map();

        for (let i = 0; i < fromParams.length; i++) {
            mapping[fromParams[i]] = m.params[i];
        }

        return toTpl.render(mapping);
    }
}

function chooseTheBestOne(transaltions, params) {
    if (transaltions.length > 1) {
        //一般情况下，存在参数1时，使用单数模板
        let mayNeedOddVersion = params.includes("1");
        if (mayNeedOddVersion) {
            for (let t of transaltions) {
                if (mayNeedOddVersion && t.fromParams.length > t.toParams.length) {
                    return t;
                }
            }
        }
    }
    return transaltions[0];
}

export function transGem(str) {
    let gem = Gem.fromString(str);
    let val = gems.get(gem.name);

    if (!val) {
        shouldBeTranlated({
            "type": "gem",
            "content": str
        });
    }

    let buf = [];
    if (gem.qualityType === GEM_QUALITY_TYPE_DIVERGENT) {
        buf.push(GEM_PREFFIX_DIVERGENT_EN);
    } else if (gem.qualityType === GEM_QUALITY_TYPE_ANOMALOUS) {
        buf.push(GEM_PREFFIX_ANOMALOUS_EN);
    }
    buf.push(val);
    if (gem.isSupport) {
        buf.push(GEM_SUFFIX_SUPPORT_EN);
    }

    return buf.join(" ");
}

export function transGemProperty(str) {
    if (str === "等级") {
        return "Level";
    } else if (str === "品质") {
        return "Quality";
    } else {
        return str;
    }
}

class Modifier {
    constructor(segments, params) {
        this.segments = segments;
        this.params = params;
    }
    static fromString(str) {
        let segments = [];
        let params = [];

        if (str) {
            //目前的正则不够精细，必要时可以增加预匹配，来保证两端空格（如果位于开始、结尾会少一边空格）。
            let pattern = /(\+|-)?[\d&&\.]+%?/g;
            let len = str.length;

            let lastIndex = 0;

            while (true) {
                let match = pattern.exec(str);
                if (match) {
                    let result = match[0];
                    let index = match.index;
                    if (lastIndex !== index) {
                        segments.push(new Segment(STR_SEGMENT, str.substring(lastIndex, index), null));
                    }

                    segments.push(new Segment(PARAM_SEGMENT, null, params.length));
                    params.push(result);
                    lastIndex = pattern.lastIndex;
                } else {
                    if (lastIndex < len) {
                        segments.push(new Segment(1, str.substring(lastIndex), null, null));
                    }
                    break;
                }
            }
        }

        return new Modifier(segments, params);
    }

    /**
     * 构建词缀，但是%作为模板内容而非参数内容。
     * @param {*} str 
     * @returns 
     */
    static fromStringButParamsWithoutPercent(str) {
        let segments = []
        let params = []

        if (str) {
            let pattern = /(\+|-)?[\d&&\.]+/g;
            let len = str.length;

            let lastIndex = 0;

            while (true) {
                let match = pattern.exec(str);
                if (match) {
                    let result = match[0];
                    let index = match.index;
                    if (lastIndex !== index) {
                        segments.push(new Segment(STR_SEGMENT, str.substring(lastIndex, index), null));
                    }

                    segments.push(new Segment(PARAM_SEGMENT, null, params.length));
                    params.push(result);
                    lastIndex = pattern.lastIndex;
                } else {
                    if (lastIndex < len) {
                        segments.push(new Segment(1, str.substring(lastIndex), null, null));
                    }
                    break;
                }
            }
        }

        return new Modifier(segments, params);
    }

    /**
     * 获取模板主体。
     * 
     * 无法根据词缀解析得到其模板，因为无法判断形式参数顺序。
     */
    getTemplateBody() {
        let buf = [];
        for (const s of this.segments) {
            if (s.type === STR_SEGMENT) {
                buf.push(s.content);
            } else {
                buf.push("{}");
            }
        }
        return buf.join("");
    }
}

/**
 * 表示一个词缀模板。
 */
class Template {
    constructor(segments) {
        this.segments = segments;
    }

    /**
     * 从模板主体和形式参数列表构建模板。
     * 
     * 因为中文模板和英文模板中的形式参数（占位符）实际是乱序的，如：
     *      “使用此武器攻击时，每 {2} 点力量附加 {0} - {1} 基础火焰伤害”
     * 
     * 在匹配过程中，我们无法预知词缀对应模板的形式参数的顺序，遍历每一种可能从效率上来讲也不现实，
     * 解决办法是将这样的模板分解为两部分：
     *  - 模板主体：“使用此武器攻击时，每 {} 点力量附加 {} - {} 基础火焰伤害”
     *  - 形式参数列表：[2,0,1]
     * 
     * 这样我们在数据库中查询词缀的模板时，只需要用模板主体进行匹配，不需要考虑参数的问题，只有渲染时才考虑参数的映射关系
     * @param {*} body 
     * @param {*} formalParams 
     * @returns 
     */
    static fromBodyAndFormalParams(body, formalParams) {
        let segments = []

        if (body) {
            let pattern = /{}/g;
            let len = body.length;

            let lastIndex = 0;
            let paramsIndex = 0;

            while (true) {
                let match = pattern.exec(body);
                if (!match) {
                    if (lastIndex < len) {
                        segments.push(new Segment(1, body.substring(lastIndex), null));
                    }
                    break;
                } else {
                    let index = match.index;
                    if (lastIndex !== index) {
                        segments.push(new Segment(STR_SEGMENT, body.substring(lastIndex, index), null));
                    }
                    segments.push(new Segment(PARAM_SEGMENT, null, formalParams[paramsIndex]));

                    lastIndex = pattern.lastIndex;
                    paramsIndex += 1;
                }
            }
        }

        return new Template(segments);
    }

    /**
     * 获取模板主体。
     */
    getBody() {
        let buf = [];
        for (const s of this.segments) {
            if (s.type === STR_SEGMENT) {
                buf.push(s.content);
            } else {
                buf.push("{}");
            }
        }
        return buf.join("");
    }

    /**
     * 用实际参数渲染模板。
     * @param {*} paramsMapping 包含实际参数的map。
     */
    render(paramsMapping) {
        let buf = [];
        for (const s of this.segments) {
            if (s.type === STR_SEGMENT) {
                buf.push(s.content);
            } else {
                buf.push(`${paramsMapping[s.index]}`);
            }
        }

        return buf.join("");
    }
}


/**
 * 片段类型常量：字符串、参数
 */
const STR_SEGMENT = 1
const PARAM_SEGMENT = 2

/*
    表示一个模板片段。

    type表示类型，包括：
    - STR_SEGMENT, 普通字符串
    - PARAM_SEGMENT, 参数

    content表示内容，只有字符串类型的才有内容。
    index只用于参数类型，表示其对应参数的索引。

 */
class Segment {
    constructor(type, content, index) {
        this.type = type;
        this.content = content;
        this.index = index;
    }
}

const GEM_QUALITY_TYPE_NORMAL = 0;
const GEM_QUALITY_TYPE_DIVERGENT = 1;
const GEM_QUALITY_TYPE_ANOMALOUS = 2;
const GEM_SUFFIX_SUPPORT_CN = "（辅）";
const GEM_SUFFIX_AWAKENED_SUPPORT_CN = "（强辅）";
//必须带空格，因为存在特例：“异常爆发(辅)”
const GEM_PREFFIX_DIVERGENT_CN = "分歧 ";
const GEM_PREFFIX_ANOMALOUS_CN = "异常 ";
const GEM_SUFFIX_SUPPORT_EN = "Support";
const GEM_PREFFIX_DIVERGENT_EN = "Divergent";
const GEM_PREFFIX_ANOMALOUS_EN = "Anomalous";

class Gem {
    constructor(name, isSupport, isAwakened, qualityType) {
        this.name = name;
        this.isSupport = isSupport;
        this.isAwakened = isAwakened;
        this.qualityType = qualityType;
    }

    static fromString(str) {
        str = str.replace('(', '（').replace(')', '）');

        let qualityType = GEM_QUALITY_TYPE_NORMAL;
        if (str.startsWith(GEM_PREFFIX_DIVERGENT_CN)) {
            qualityType = GEM_QUALITY_TYPE_DIVERGENT;
            str = str.substring(GEM_PREFFIX_DIVERGENT_CN.length).trim();
        } else if (str.startsWith(GEM_PREFFIX_ANOMALOUS_CN)) {
            qualityType = GEM_QUALITY_TYPE_ANOMALOUS;
            str = str.substring(GEM_PREFFIX_ANOMALOUS_CN.length).trim();
        }

        let isSupport = false;
        let isAwakened = false;

        if (str.endsWith(GEM_SUFFIX_SUPPORT_CN)) {
            isSupport = true;
        } else if (str.endsWith(GEM_SUFFIX_AWAKENED_SUPPORT_CN)) {
            isSupport = true;
            isAwakened = true;
        }

        return new Gem(str, isSupport, isAwakened, qualityType);
    }
}
