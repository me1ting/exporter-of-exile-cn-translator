import { transBaseType, transModifier, transName, transProperty } from "./resources.js";

const PARTS_SEPARATOR = "--------";
const LINES_SEPARATOR = "\r\n";
const KEY_VALUE_SEPARATOR = ": ";

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
            //不使用trim，是因为不清楚空白是否属于词缀
            if (part.startsWith(LINES_SEPARATOR)) {
                part = part.substring(LINES_SEPARATOR.length);
            }
            if (part.endsWith(LINES_SEPARATOR)) {
                part = part.substring(0, part.length - LINES_SEPARATOR.length);
            }

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
        if (firstLine.type === LINE_TYPE_KEY_VALUE && firstLine.data.key === "物品类别") {
            isMetaPart = true;
        }

        for (let [i, line] of this.lines.entries()) {
            if (isMetaPart) {
                if (i === this.lines.length - 2) {
                    //物品名称
                    buf.push(transName(line.data.modifier));
                    continue;
                } else if (i === this.lines.length - 1) {
                    //基础类型
                    buf.push(transBaseType(line.data.modifier));
                    continue;
                }
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
            let pattern = new RegExp("(.+)\\s(\\(\\w+\\))");
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