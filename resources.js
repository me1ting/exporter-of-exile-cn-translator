import {
    uniques, repeatedUniques, weapons, repeatedWeapons, armour, accessories, flasks, gems, properties, requirements,
    formulableNodes, repeatedFormulableNodes, modifiers, repeatedModifiers, jewels, itemClasses, shouldBeTranlated, compoundModifiers, repeatedArmour
} from "./load-resources.js";

/**
 * 获取baseType所属的大类（EN，项目内部划分，非POE通用概念）。
 * 有以下大类：weapon,armour,accessory,flask,gem,jewel
 * 分别表示：武器，护甲，饰品，药剂，宝石，珠宝
 * 如果无法判定类型，返回"unknown"
 * 
 * 
 * @param {*} baseType baseType
 * @returns 
 */
export function getType(baseType) {
    let val = weapons.get(baseType);//武器
    if (!val) {
        val = repeatedWeapons.get(val);
    }
    if (val) {
        return "weapon";
    }

    val = armour.get(baseType);//护甲
    if (!val) {
        val = repeatedWeapons.get(val);
    }
    if (val) {
        return "armour";
    }

    val = accessories.get(baseType);//饰品
    if (val) {
        return "accessory";
    }
    val = flasks.get(baseType);//药剂
    if (val) {
        return "flask";
    }
    val = gems.get(baseType);//技能
    if (val) {
        return "gem";
    }
    val = jewels.get(baseType);//珠宝
    if (val) {
        return "jewel";
    }
    return "unknown";
}

/**
 * 翻译物品名字。
 * 
 * 重复项 区分方式
 * 时空扭曲 ctx.baseTypeCN
 * 
 * @param {*} name 物品名称
 * @param {*} ctx 上下文，用于区分重复项。
 * @returns 
 */
export function transName(name, ctx) {
    let val = uniques.get(name);
    if (val) {
        return val;
    }
    let vals = repeatedUniques.get(name);
    if (vals) {
        for (let val of vals) {
            if (val.ctx && val.ctx.baseTypeCN === ctx.baseTypeCN) {
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
 * 丝绸手套 护甲 建议调用方自己区分；本函数可以根据ctx.nameCN中的传奇名称来进行判定，未判定将返回默认值
 * 龙骨细剑 武器 无法区分，也无必要区分，返回默认值
 * 
 * @param {*} baseType 基础类型
 * @param {*} ctx 上下文，用于区分重复项
 * @returns 
 */
export function transBaseType(baseType, ctx) {
    let val = tryTransBaseType(baseType, ctx);
    if (val) {
        return val;
    }

    shouldBeTranlated({
        "type": "baseType",
        "content": baseType
    });

    return baseType;
}

function tryTransBaseType(baseType, ctx) {
    let val = weapons.get(baseType);//武器
    if (val) {
        return val;
    }
    let vals = repeatedWeapons.get(baseType);
    if (vals && vals.length > 0) {
        //目前存在重复baseType的武器只有龙骨细剑
        //两种龙骨细剑都没有传奇，因此返回默认值即可
        let defaultVal;
        for (let val of vals) {
            if (val.default) {
                defaultVal = val;
            }

            if (defaultVal) {
                return defaultVal.v;
            }
        }
    }

    val = armour.get(baseType);//护甲
    if (val) {
        return val;
    }

    vals = repeatedArmour.get(baseType);
    if (vals && vals.length > 0) {
        //根据传奇名称判定具体的baseType，否则返回默认值
        let defaultVal;
        for (let val of vals) {
            if (val.default) {
                defaultVal = val;
            }

            if (val.ctx && ctx && val.ctx.uniquesCN && ctx.nameCN) {
                if (val.ctx.uniquesCN.includes(ctx.nameCN)) {
                    return val.v;
                }
            }

            if (defaultVal) {
                return defaultVal.v;
            }
        }
    }

    val = flasks.get(baseType);//药剂
    if (val) {
        return val;
    }

    val = accessories.get(baseType);//饰品
    if (val) {
        return val;
    }

    val = gems.get(baseType);//技能
    if (val) {
        return val;
    }

    val = jewels.get(baseType);//珠宝
    if (val) {
        return val;
    }

    return undefined;
}


const SUPERIOR_CN = "精良的 ";
const SUPERIOR_EN = "Superior ";
const SYNTHESISED_CN = "忆境 ";
const SYNTHESISED_EN = "Synthesised ";

/**
 * 翻译typeLine。
 * 
 * 一般而言，typeLine === baseType。但是魔法物品不同，typeLine === 一大堆修饰词+baseType。
 * 由于整理、翻译修饰词是一件费力而无用的工作，因此这里选择去掉修饰词，保留baseType。
 * 
 * 推荐使用baseType的值直接替代typeLine。目前只有商店的魔法物品因为无baseType信息，才需要调用该方法来翻译typeLine。
 * 
 * @param {*} typeLine
 * @param {*} ctx 上下文，用于区分重复项
 */
export function transTypeLine(typeLine, ctx) {
    if (typeLine.startsWith(SUPERIOR_CN)) {
        return SUPERIOR_EN + transTypeLine(typeLine.substring(SUPERIOR_CN.length), ctx);
    }

    if (typeLine.startsWith(SYNTHESISED_CN)) {
        return SYNTHESISED_EN + transTypeLine(typeLine.substring(SYNTHESISED_CN.length), ctx);
    }

    //先尝试能否直接作为baseType翻译。
    let val = tryTransBaseType(typeLine, ctx);
    if (val) {
        return val;
    }

    //尝试失败，处理修饰词存在的情况。
    //修饰词以`的`、`之`结尾，但是由于`的`、`之`又可能出现在baseType中。
    //以`的`、`之`为修饰词结尾，将baseType拆分为一个slices，包含修饰词+"baseType"
    //此时以下情况：
    // - 得到的“baseType”就是baseType
    // - 得到的“baseType”拼接其前一个或前两个修饰词才是真正的baseType
    //
    //分别测试每一种可能性
    let pattern = /.+?[之的]/ug;
    if (pattern.test(typeLine)) {
        pattern.lastIndex = 0;

        let len = typeLine.length;
        let slices = [];
        let lastIndex = 0;
        while (true) {
            let matches = pattern.exec(typeLine);
            if (matches) {
                let result = matches[0];
                slices.push(result);
                lastIndex = pattern.lastIndex;
            } else {
                if (lastIndex < len) {
                    slices.push(typeLine.substring(lastIndex));
                }
                break;
            }
        }

        let last = slices[slices.length - 1];
        let val = tryTransBaseType(last, ctx);
        if (val) {
            return val;
        }

        //只有超过2个才测试最后两个slices连接起来的可能性，而等于两个时，在函数开始就进行了测试
        if (slices.length > 2) {
            let secondToLast = slices[slices.length - 2];
            let val = tryTransBaseType(secondToLast + last, ctx);
            if (val) {
                return val;
            }
            //最多测试后三个slices连接起来的可能性。
            if (slices.length > 3) {
                let thirdToLast = slices[slices.length - 3];
                let val = tryTransBaseType(thirdToLast + secondToLast + last, ctx);
                if (val) {
                    return val;
                }
            }
        }
    }

    shouldBeTranlated({
        "type": "typeLine",
        "content": typeLine
    });

    return typeLine;
}

/**
 * 从typeLine中解析得到baseType。
 * 适用于商品。
 * 
 * @param {*} typeLine 
 */
export function getBaseTypeFromTypeLine(typeLine, ctx) {
    //逻辑基本等同于transTypeLine，唯一区别是返回值。
    //TODO 重构代码，避免重复代码
    if (typeLine.startsWith(SUPERIOR_CN)) {
        typeLine = typeLine.substring(SUPERIOR_CN.length);
    }

    if (typeLine.startsWith(SYNTHESISED_CN)) {
        typeLine = typeLine.substring(SYNTHESISED_CN.length);
    }

    if (tryTransBaseType(typeLine, ctx)) {
        return typeLine;
    }

    let pattern = /.+?[之的]/ug;
    if (pattern.test(typeLine)) {
        pattern.lastIndex = 0;

        let len = typeLine.length;
        let slices = [];
        let lastIndex = 0;
        while (true) {
            let matches = pattern.exec(typeLine);
            if (matches) {
                let result = matches[0];
                slices.push(result);
                lastIndex = pattern.lastIndex;
            } else {
                if (lastIndex < len) {
                    slices.push(typeLine.substring(lastIndex));
                }
                break;
            }
        }

        let last = slices[slices.length - 1];
        let val = tryTransBaseType(last, ctx);
        if (val) {
            return last;
        }

        if (slices.length > 2) {
            let secondToLast = slices[slices.length - 2];
            let val = tryTransBaseType(secondToLast + last, ctx);
            if (val) {
                secondToLast + last
            }
            if (slices.length > 3) {
                let thirdToLast = slices[slices.length - 3];
                let val = tryTransBaseType(thirdToLast + secondToLast + last, ctx);
                if (val) {
                    return thirdToLast + secondToLast + last;
                }
            }
        }
    }

    return typeLine;
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
 * 存在重复项：电能之击、毁灭装置、毒蛇之牙、英勇、汲血者，使用prompt区分
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
                choice = parseInt(input, 10);
                if (isNaN(choice)) {
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
 * 
 * 存在重复词缀：
 * 1. 仅大小写不同，数据库保留大写字母更多的一项，如军帽上存在的重复词缀。
 * 2. 语义不同，但其中一种在交易网站上查不到，数据保留有效项。
 * 3. 语义不同，两种皆有效，添加context解决。
 * 4. 单复数语法导致的不同：1.只有一个参数，后端分别插入单、复数版本；2. 多个参数，将单数参数固化到模板主体中。
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

    //军帽词缀，不同于其它词缀，参数包括非数值（技能名称）。
    //因为唯一，这里编码处理，如果以后存在大量的包含非数值参数的词缀，可以从归类为同一类型并结合数据库进行处理。
    let p = /插入的技能石被 (\d+) 级的【(.+)】辅助/u;
    let matches = p.exec(str);
    if (matches) {
        let level = matches[1];
        let gem = matches[2];

        let gemEN = transGem(`${gem}（辅）`);
        if (gemEN.endsWith(` ${GEM_SUFFIX_SUPPORT_EN}`)) {
            //-1是因为存在空格
            gemEN = gemEN.substring(0, gemEN.length - GEM_SUFFIX_SUPPORT_EN.length - 1);
        }

        return `Socketed Gems are Supported by Level ${level} ${gemEN}"`;
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
    let m = Modifier.parse(str);
    result = transModifierObject(m, ctx);
    if (result) {
        return result;
    }

    //固化单数参数匹配
    if (m.hasSingleParam()) {
        let weldModifier = m.weldingSingleParams();
        result = transModifierObject(weldModifier, ctx);
        if (result) {
            return result;
        }
    }

    //作为复合词缀匹配
    if (str.includes('\n')) {
        let mods = str.split('\n')
        let buf = []
        for (let mod of mods) {
            buf.push(transModifier(mod));
        }

        return buf.join('\n');
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
        if (ctxMatch(r.ctx, ctx)) {
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
function ctxMatch(pattern, target) {
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
}

/**
 * 将词缀作为首行，获取关联的复合词缀信息。
 * @param {*} str 目标词缀
 * @returns 
 */
export function getCompoundModifiers(str) {
    //精确匹配
    let val = compoundModifiers.get(str);
    if (val) {
        return val;
    }
    //解析匹配
    let m = Modifier.parse(str);
    val = compoundModifiers.get(m.getTemplateBody());
    if (val) {
        return val;
    }

    //固化单数参数匹配
    if (m.hasSingleParam()) {
        let weldModifier = m.weldingSingleParams();
        val = compoundModifiers.get(weldModifier.getTemplateBody());
        if (val) {
            return val;
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

export function transItemClass(str) {
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

/**
 * 表示一个词缀。
 * 
 * 一个词缀解析可以得到模板主体和实际参数两部分。
 */
class Modifier {
    constructor(segments, params) {
        this.segments = segments;
        this.params = params;
    }

    /**
     * @param {*} str 
     * @returns 
     */
    static parse(str) {
        let segments = []
        let params = []

        if (str) {
            let pattern = /([+-]?[\d&&\.]+)(\s\(augmented\))?/g;
            let len = str.length;

            let lastIndex = 0;

            while (true) {
                let match = pattern.exec(str);
                if (match) {
                    let result = match[1];
                    let argmented = match[2];
                    let index = match.index;
                    if (lastIndex !== index) {
                        segments.push(new Segment(STR_SEGMENT, str.substring(lastIndex, index)));
                    }

                    segments.push(new Segment(PARAM_SEGMENT, null, params.length));
                    params.push(new Param(result, Boolean(argmented)));
                    lastIndex = pattern.lastIndex;
                } else {
                    if (lastIndex < len) {
                        segments.push(new Segment(STR_SEGMENT, str.substring(lastIndex)));
                    }
                    break;
                }
            }
        }

        return new Modifier(segments, params);
    }

    /**
     * 获取模板主体。
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

    /**
     * 是否有单数参数。
     */
    hasSingleParam() {
        for (let [i, segment] of this.segments.entries()) {
            if (segment.type === PARAM_SEGMENT) {
                let param = this.params[segment.index];
                if (param.v === '1'
                    && (i === this.segments.length - 1
                        || this.segments[i + 1].type === PARAM_SEGMENT
                        || this.segments[i + 1].type === STR_SEGMENT && !this.segments[i + 1].content.startsWith("%"))) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * 将单数参数固化到模板主体中，返回新的Modifer对象。
     */
    weldingSingleParams() {
        let newSegments = [];
        let newParams = [];

        for (let [i, segment] of this.segments.entries()) {
            if (segment.type === PARAM_SEGMENT) {
                let param = this.params[segment.index];

                //参数值为1，且非百分比参数
                if (param.v === '1'
                    && (i === this.segments.length - 1
                        || this.segments[i + 1].type === PARAM_SEGMENT
                        || this.segments[i + 1].type === STR_SEGMENT && !this.segments[i + 1].content.startsWith("%"))) {
                    //这里暂不考虑(argmented)存在的情况
                    newSegments.push(new Segment(STR_SEGMENT, param.v));
                    continue;
                }

                newParams.push(param);
            }

            newSegments.push(segment);
        }

        return new Modifier(newSegments, newParams);
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
                let param = paramsMapping[s.index];
                buf.push(`${param.v}`);
                if (param.argmented) {
                    buf.push(` (argmented)`);
                }
            };
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

/**
 * 表示一个实际参数。
 * 
 * argmented表示参数是否是计算得到，出现于商品的特殊词缀中。
 */
class Param {
    constructor(v, argmented) {
        this.v = v;
        this.argmented = argmented;
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
