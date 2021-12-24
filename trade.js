import { transBaseType, transItemClass, transModifier, transName, transProperty, tryTransProperty, tryTransRequirement } from "./resources.js";

const PARTS_SEPARATOR = "--------";
const LINES_SEPARATOR = "\r\n";
const KEY_VALUE_SEPARATOR = ": ";

const KEY_ITEM_CLASS = "物品类别";

export function translateGoods(str) {
    let goods = Goods.parse(str);
    return goods.getTranslation();
}

class Goods {
    constructor(parts) {
        this.parts = parts;
    }

    static parse(str) {
        let parts = str.split(PARTS_SEPARATOR);

        let objects = [];
        for (let part of parts) {
            part = part.trim();
            objects.push(Part.parse(part));
        }

        return new Goods(objects);
    }

    /**
     * 返回翻译结果（字符串表示）
     */
    getTranslation() {
        let buf = [];

        for (let part of this.parts) {
            buf.push(part.getTranslation());
        }

        return buf.join(`${LINES_SEPARATOR}${PARTS_SEPARATOR}${LINES_SEPARATOR}`);
    }
}

class Part {
    constructor(lines) {
        this.lines = lines;
    }

    static parse(str) {
        let lines = str.split(LINES_SEPARATOR);

        let objects = [];
        for (let line of lines) {
            objects.push(Line.parse(line));
        }
        return new Part(objects);
    }

    /**
     * 返回翻译结果（字符串表示）
     */
    getTranslation() {
        let buf = [];

        let isMetaPart = false;
        let firstLine = this.lines[0];
        if (firstLine.type === LINE_TYPE_KEY_VALUE && firstLine.data.key === KEY_ITEM_CLASS) {
            isMetaPart = true;
        }

        for (let [i, line] of this.lines.entries()) {
            //元部分中词缀类型的行
            if (isMetaPart && line.type === LINE_TYPE_MODIFIER) {
                //一般而言，倒数两行是name和baseType
                //但是非传奇药剂有所不同，只有一行：修饰词+baseType
                let modifier = line.data.modifier;
                if (i === this.lines.length - 2) {
                    //物品名称
                    buf.push(transName(modifier));
                } else if (i === this.lines.length - 1) {
                    if (isFlaskName(modifier)) {
                        //药剂名称
                        buf.push(transFlaskName(modifier));
                    } else {
                        //基础类型
                        buf.push(transTypeLine(modifier));
                    }
                }
                continue;
            }
            buf.push(line.getTranslation());
        }

        return buf.join(`${LINES_SEPARATOR}`);
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

    getTranslation() {
        if (this.type === LINE_TYPE_KEY_VALUE) {
            let key = this.data.key;
            let value = this.data.value;

            if (key === KEY_ITEM_CLASS) {
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
                modifier = transModifier(modifier);
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

function isFlaskName(str) {
    return str.endsWith("药剂");
}

const FLASK_NAME_OF1 = "之";
const FLASK_NAME_OF2 = "的";
function transFlaskName(str) {
    let name = str;
    if (name.includes(FLASK_NAME_OF1) || name.includes(FLASK_NAME_OF2)) {
        name = name.replaceAll(FLASK_NAME_OF2, FLASK_NAME_OF1);
        let res = str.split(FLASK_NAME_OF1);
        name = res[res.length - 1];
    }

    return transBaseType(name);
}

const SYNTHESISED_CN = "忆境 ";
const SYNTHESISED_EN = "Synthesised ";
function transTypeLine(str){
    if(str.startsWith(SYNTHESISED_CN)){
        return SYNTHESISED_EN+transBaseType(str.substring(SYNTHESISED_CN.length));
    }

    return transBaseType(str);
}