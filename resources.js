import {
    uniques, repeatedUniques, weapons, repeatedWeapons, armour, accessories, flasks, gems, properties, requirements,
    formulableNodes, repeatedFormulableNodes, modifiers, repeatedModifiers, jewels, itemClasses, shouldBeTranlated
} from "./load-resources.js";

/**
 * 获取物品名称对应的基本类型（EN）。
 * 有以下类型：weapon,armour,accessory,flask,gem,jewel
 * 分别表示：武器，护甲，饰品，药剂，宝石，珠宝
 * 如果无法判定类型，返回"unkonwn"
 * 
 * 
 * @param {*} str 
 * @returns 
 */
export function getType(str) {
    let val = weapons.get(str);//武器
    if (!val) {
        val = repeatedWeapons.get(val);
    }
    if (val) {
        return "weapon";
    }

    val = armour.get(str);//护甲
    if (!val) {
        val = repeatedWeapons.get(val);
    }
    if (val) {
        return "armour";
    }

    val = accessories.get(str);//配件
    if (val) {
        return "accessory";
    }
    val = flasks.get(str);//药剂
    if (val) {
        return "flask";
    }
    val = gems.get(str);//技能
    if (val) {
        return "gem";
    }
    val = jewels.get(str);//珠宝
    if (val) {
        return "jewel";
    }
    return "unknown";
}

/**
 * 翻译物品名字。
 * 
 * 重复项 区分方式
 * 时空扭曲 baseType（CN）
 * 
 * @param {*} str 物品名称
 * @param {*} ctx 上下文，用于区分重复项。
 * @returns 
 */
export function transName(str, ctx) {
    let val = uniques.get(str);
    if (val) {
        return val;
    }
    let vals = repeatedUniques.get(str);
    if (vals) {
        for (let val of vals) {
            if (val.ctx && val.ctx.baseType === ctx.baseType) {
                return val.v;
            }
        }
    }

    // 对于所有非传奇名称，翻译的价值不大，目前使用占位符替代。
    // 返回占位符"Item"，返回原始名称会显示乱码，返回空白字符串会报错。
    return "Item";
}

/**
 * 翻译基础类型。
 * 
 * 重复项：
 * 丝绸手套 护甲 调用方自行通过icon区分（因为是暗金，必须区分）
 * 龙骨细剑 武器 无法区分，也无必要区分（目前没有对应的暗金）
 * 
 * @param {*} str 基础类型 
 * @returns 
 */
export function transBaseType(str) {
    let val = weapons.get(str);//武器
    if (val) {
        return val;
    }
    let vals = repeatedWeapons.get(str);
    if (vals && vals.length > 0) {
        //目前只有 "龙骨细剑" 且无法区分，且不需要区分，返回任意一个即可。
        return vals[0].v;
    }

    val = armour.get(str);//护甲
    if (val) {
        return val;
    }

    val = accessories.get(str);//配件
    if (val) {
        return val;
    }

    val = flasks.get(str);//药剂
    if (val) {
        return val;
    }

    val = accessories.get(str);//配件
    if (val) {
        return val;
    }

    val = gems.get(str);//技能
    if (val) {
        return val;
    }

    val = jewels.get(str);//珠宝
    if (val) {
        return val;
    }

    shouldBeTranlated({
        "type": "baseType",
        "content": str
    });

    return str;
}

/**
 * 翻译属性。
 * @param {*} str 
 * @returns 
 */
export function transProperty(str) {
    let val = properties.get(str);
    if (val) {
        return val;
    }

    shouldBeTranlated({
        "type": "property",
        "content": str
    });

    return str;
}

/**
 * 尝试翻译属性，翻译失败不记录日志。
 * @param {*} str 
 * @returns 
 */
export function tryTransProperty(str) {
    let val = properties.get(str);
    return val ? val : str;
}

/**
 * 翻译需求。
 * @param {*} str 
 * @returns 
 */
export function transRequirement(str) {
    let val = requirements.get(str);
    if (val) {
        return val;
    }

    shouldBeTranlated({
        "type": "requirement",
        "content": str
    });

    return str;
}

/**
 * 尝试翻译需求，翻译失败返回不记录日志。
 * @param {*} str 
 * @returns 
 */
export function tryTransRequirement(str) {
    let val = requirements.get(str);

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
function transFormulableNode(str) {
    let val = formulableNodes.get(str);
    if (val) {
        return val;
    }

    let vals = repeatedFormulableNodes.get(str);
    if (vals && vals.length > 0) {
        if (prompt) {
            let choice = -1;

            let promptTextBuf = [`请根据描述确认重复的天赋技能（输入选择的序号）：${str}\n`];
            let index = 0;
            for (let val of vals) {
                promptTextBuf.push(`    ${index}: ${val.stats[0]}...\n`);
                index += 1;
            }
            let promptText = promptTextBuf.join();

            while (choice < 0 || choice >= vals.length) {
                let input = prompt(promptText);
                choice = parseInt(input);
                if (isNaN(choice) || isFinite(choice)) {
                    choice = -1;
                }
            }

            return vals[choice].v;
        } else {
            //node.js 环境下直接返回原字符串
            return str;
        }
    }


    shouldBeTranlated({
        "type": "formulableNode",
        "content": str
    });

    return str;
}

const ALLOCATE_CN = "配置 ";
const ALLOCATE_EN = "Allocates ";
const ADDED_SMALL_PASSIVE_SKILL_GRANT_CN = "增加的小天赋获得：";
const ADDED_SMALL_PASSIVE_SKILL_GRANT_EN = "Added Small Passive Skills grant: ";

/**
 * 翻译词缀。
 * 存在重复词缀：
 * 1. 仅大小写不同，后端取一种。
 * 2. 语义不同，但其中一种在交易网站上查不到（可能是遗产或其它原因导致），后端取有效的那种。
 * 3. 语义不同，两种皆有效，添加context解决。
 * 4. 单复数语法导致的不同，1.只有一个参数，后端分别插入单、复数版本；2. 多个参数，添加context解决。
 * @param {*} str 
 * @param {*} ctx 上下文
 * @returns 
 */
export function transModifier(str, ctx) {
    //附魔
    if (str.startsWith(ALLOCATE_CN)) {
        let node = str.substring(ALLOCATE_CN.length);
        return ALLOCATE_EN + transFormulableNode(node);
    }

    //星团珠宝特殊词缀
    if (str.startsWith(ADDED_SMALL_PASSIVE_SKILL_GRANT_CN)) {
        let granted = str.substring(ADDED_SMALL_PASSIVE_SKILL_GRANT_CN.length);
        return ADDED_SMALL_PASSIVE_SKILL_GRANT_EN + transModifier(granted);
    }

    //复合词缀
    if (str.includes('\n')) {
        let mods = str.split('\n')
        let buf = []
        for (let mod of mods) {
            buf.push(transModifier(mod));
        }

        return buf.join('\n');
    }

    //精确匹配
    let result = modifiers.get(str);
    if (!result) {
        let results = repeatedModifiers.get(str);
        if (results) {
            result = chooseFromRepeats(results, ctx);
        }
    }
    if (result) {
        return result.toTplBody;
    }

    //解析匹配
    let m = Modifier.fromString(str);
    result = transModifierObject(m);
    if (result) {
        return result;
    }

    shouldBeTranlated({
        "type": "modifier",
        "content": str
    });

    return str;
}

function transModifierObject(m, ctx) {
    let tplBody = m.getTemplateBody();
    let t = modifiers.get(tplBody);
    if (!t) {
        let results = repeatedModifiers.get(tplBody);
        if (results) {
            let copy = Object.assign({}, ctx);
            copy.params = m.params;
            t = chooseFromRepeats(results, copy);
        }
    }
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

function chooseFromRepeats(results, ctx) {
    let defaultResult = null;
    for (let r of results) {
        if (ctxMatchs(r.ctx, ctx)) {
            return r;
        }
        if (!r.ctx) {
            defaultResult = r;
        }
    }

    return defaultResult;
}

/**
 * 匹配context，目前返回boolean，未来根据需求可以返回匹配的Rank值。
 * @param {*} pattern 
 * @param {*} target 
 */
function ctxMatchs(pattern, target) {
    if (!pattern && !target) {
        return true
    }

    if (!pattern || !target) {
        return false
    }

    if (pattern.types && target.type) {
        if (pattern.types.includes(target.type)) {
            return true;
        }
    }

    if (pattern.isSingle) {
        let sigleParamIndex = pattern.singleIndex;
        if (target.params && parseInt(target.params[sigleParamIndex]) === 1) {
            return true;
        }
    }
}

export function transGem(str) {
    let gem = Gem.fromString(str);
    let val = gems.get(gem.name);

    if (val) {
        let buf = [];
        if (gem.qualityType === GEM_QUALITY_TYPE_DIVERGENT) {
            buf.push(GEM_PREFIX_DIVERGENT_EN);
        } else if (gem.qualityType === GEM_QUALITY_TYPE_ANOMALOUS) {
            buf.push(GEM_PREFIX_ANOMALOUS_EN);
        } else if (gem.qualityType === GEM_QUALITY_TYPE_PHANTASMAL) {
            buf.push(GEM_PREFIX_PHANTASMAL_EN);
        }
        buf.push(val);
        if (gem.isSupport) {
            buf.push(GEM_SUFFIX_SUPPORT_EN);
        }

        return buf.join(" ");
    }

    shouldBeTranlated({
        "type": "gem",
        "content": str
    });

    return str;
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

export function transItemClasses(str) {
    let val = itemClasses.get(str);
    if (val) {
        return val;
    }

    shouldBeTranlated({
        "type": "itemClass",
        "content": str
    });

    return str;
}

class Modifier {
    constructor(segments, params) {
        this.segments = segments;
        this.params = params;
    }

    /**
     * @param {*} str 
     * @returns 
     */
    static fromString(str) {
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
const GEM_QUALITY_TYPE_PHANTASMAL = 3;
const GEM_SUFFIX_SUPPORT_CN = "（辅）";
const GEM_SUFFIX_AWAKENED_SUPPORT_CN = "（强辅）";
//必须带空格，因为存在特例：“异常爆发(辅)”
const GEM_PREFIX_DIVERGENT_CN = "分歧 ";
const GEM_PREFIX_ANOMALOUS_CN = "异常 ";
const GEM_PREFIX_PHANTASMAL_CN = "魅影 ";
const GEM_SUFFIX_SUPPORT_EN = "Support";
const GEM_PREFIX_DIVERGENT_EN = "Divergent";
const GEM_PREFIX_ANOMALOUS_EN = "Anomalous";
const GEM_PREFIX_PHANTASMAL_EN = "Phantasmal";

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
        if (str.startsWith(GEM_PREFIX_DIVERGENT_CN)) {
            qualityType = GEM_QUALITY_TYPE_DIVERGENT;
            str = str.substring(GEM_PREFIX_DIVERGENT_CN.length).trim();
        } else if (str.startsWith(GEM_PREFIX_ANOMALOUS_CN)) {
            qualityType = GEM_QUALITY_TYPE_ANOMALOUS;
            str = str.substring(GEM_PREFIX_ANOMALOUS_CN.length).trim();
        } else if (str.startsWith(GEM_PREFIX_PHANTASMAL_CN)) {
            qualityType = GEM_QUALITY_TYPE_PHANTASMAL;
            str = str.substring(GEM_PREFIX_PHANTASMAL_CN.length).trim();
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
