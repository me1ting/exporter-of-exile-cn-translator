import { translateGoods } from "./trade.js";
import {
    open,
    readdir
} from 'node:fs/promises';

const testFolder = './testcases/goods';
const testcasesSuffix = ".txt";
const resSuffix = ".transalted.txt";

const test = async (file) => {
    let readFileHandle;
    let writeFileHandle;
    let path = `${testFolder}/${file}`;

    try {
        readFileHandle = await open(path);
        const content = await readFileHandle.readFile();
        let goods = content.toString();
        if (!content.includes("\r\n")) {
            goods = goods.replaceAll("\n", "\r\n");
        }

        let res = translateGoods(goods);
        writeFileHandle = await open(`${path}${resSuffix}`, "w+");
        await writeFileHandle.writeFile(res);
    } finally {
        await writeFileHandle?.close();
        await readFileHandle?.close();
    }
}

try {
    const files = await readdir(testFolder);
    for (const file of files) {
        if (file.endsWith(testcasesSuffix)&&!file.endsWith(resSuffix)) {
            test(file);
        }
    }
} catch (err) {
    console.error(err);
}