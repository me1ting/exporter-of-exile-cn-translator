import { modifiers } from "./load-resources.js";
import { getCompoundModifiers, transTypeLine, transItemClass, transModifier, transName, transProperty, tryTransProperty, tryTransRequirement, getType, getBaseTypeFromTypeLine } from "./resources.js";

const PART_SEPARATOR = "\r\n--------\r\n"; // 区域分隔符
const LINE_SEPARATOR = "\r\n"; // 行分隔符
const KEY_VALUE_SEPARATOR = ": "; // 键值分隔符
const SUB_MODIFIER_SEPARATOR = "\n"; // 复合词缀子词缀分隔符

const ITEM_CLASS_CN = "物品类别";

/**
 * 将交易页面的中文商品信息翻译为英文。
 * 
 * @param {*} str 
 * @returns 
 */
export function translateGoods(str) {
    let goods = Goods.parse(str);
    return goods.getTranslation();
}

/**
 * 表示一件商品。
 */
class Goods {
    constructor(parts) {
        this.parts = parts;
    }

    /**
     * 将中文商品信息解析为商品对象。
     * @param {*} str 
     * @returns 
     */
    static parse(str) {
        let parts = str.split(PART_SEPARATOR);

        let objects = [];
        for (let part of parts) {
            objects.push(Part.parse(part));
        }

        return new Goods(objects);
    }

    /**
     * 返回翻译结果（字符串表示）
     */
    getTranslation() {
        let ctx = {};
        let buf = [];

        for (let part of this.parts) {
            buf.push(part.getTranslation(ctx));
        }

        return buf.join(`${PART_SEPARATOR}`);
    }
}

class Part {
    constructor(lines) {
        this.lines = lines;
    }

    static parse(str) {
        let lines = str.split(LINE_SEPARATOR);

        let objects = [];
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            //存在是复合词缀的前缀的可能性，找到其所属的复合词缀
            let res = getCompoundModifiers(line);
            if (res) {
                //TODO：检查每一种长度的可能性
                let count = res[0];
                if (i + count <= lines.length) {
                    let buf = [];
                    for (let j = i; j < i + count; j++) {
                        buf.push(lines[j]);
                    }

                    objects.push(Line.parse(buf.join(SUB_MODIFIER_SEPARATOR)));
                    i += count;
                    continue;
                }
            }

            objects.push(Line.parse(line));
        }

        return new Part(objects);
    }

    /**
     * 返回翻译结果（字符串表示）
     */
    getTranslation(ctx) {
        let buf = [];

        let isMetaPart = false;
        let firstLine = this.lines[0];
        if (firstLine.type === LINE_TYPE_KEY_VALUE && firstLine.data.key === ITEM_CLASS_CN) {
            isMetaPart = true;
        }

        for (let [i, line] of this.lines.entries()) {
            //元部分中词缀类型的行
            if (isMetaPart && line.type === LINE_TYPE_MODIFIER) {
                //一般而言，倒数两行是name和typeLine
                //但是魔法物品有所不同，只有typeLine一行
                let modifier = line.data.modifier;
                if (i === this.lines.length - 2) {
                    //name
                    ctx.nameCN = modifier;
                    let typeLine = this.lines[this.lines.length - 1].data.modifier;
                    ctx.baseTypeCN = getBaseTypeFromTypeLine(typeLine, ctx);

                    buf.push(transName(modifier, ctx));
                    continue;
                } else if (i === this.lines.length - 1) {
                    //typeLine
                    if (!ctx.baseTypeCN) {
                        ctx.baseTypeCN = getBaseTypeFromTypeLine(modifier, ctx);
                    }
                    ctx.type = getType(ctx.baseTypeCN);

                    buf.push(transTypeLine(modifier, ctx));
                    continue;
                }
            }

            buf.push(line.getTranslation(ctx));
        }

        return buf.join(`${LINE_SEPARATOR}`);
    }
}

const LINE_TYPE_ONLY_KEY = 0;
const LINE_TYPE_KEY_VALUE = 1;
const LINE_TYPE_MODIFIER = 2;

class Line {
    constructor(data, type) {
        this.data = data;
        this.type = type;
    }

    static parse(str) {
        let type = LINE_TYPE_MODIFIER;
        let data = {};

        if (str.includes(KEY_VALUE_SEPARATOR)) {
            type = LINE_TYPE_KEY_VALUE;
            let pair = str.split(KEY_VALUE_SEPARATOR);
            //可能存在这种极端情况，当作词缀处理
            if (pair.length !== 2) {
                type = LINE_TYPE_MODIFIER;
            } else {
                data.key = pair[0];
                data.value = pair[1];
            }
        } else if (str.endsWith(":")) {
            type = LINE_TYPE_ONLY_KEY;
            data.key = str.substring(0, str.length - 1);
        } else {
            let pattern = new RegExp("(.+)\\s(\\(\\w+\\))$");
            let matchs = pattern.exec(str);
            if (matchs) {
                data.modifier = matchs[1];
                data.suffix = matchs[2];
            } else {
                data.modifier = str;
            }
        }

        return new Line(data, type);
    }

    getTranslation(ctx) {
        if (this.type === LINE_TYPE_KEY_VALUE) {
            let key = this.data.key;
            let value = this.data.value;

            if (key === ITEM_CLASS_CN) {
                value = transItemClass(value);
            }

            //商品中的某些属性可能被归类为requirements
            if (!isASCII(key)) {
                key = tryTransRequirement(key);
            }

            if (!isASCII(key)) {
                key = transProperty(key);
            }

            if (!isASCII(value)) {
                value = transProperty(value);
            }

            return `${key}${KEY_VALUE_SEPARATOR}${value}`;
        } else if (this.type === LINE_TYPE_ONLY_KEY) {
            let key = this.data.key;

            if (!isASCII(key)) {
                key = transProperty(key);
            }

            return `${key}:`;
        } else {
            let modifier = this.data.modifier;
            let suffix = this.data.suffix;
            //商品中的某些词缀可能被归类为properties
            if (!isASCII(modifier)) {
                modifier = tryTransProperty(modifier);
            }
            if (!isASCII(modifier)) {
                modifier = transModifier(modifier, ctx);
            }

            if (suffix) {
                return `${modifier} ${suffix}`;
            } else {
                return modifier;
            }
        }
    }
}

function isASCII(str) {
    return /^[\x00-\x7F]*$/.test(str);
}
