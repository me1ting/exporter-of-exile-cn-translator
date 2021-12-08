import {
    open,
} from 'node:fs/promises';

import { translateItems } from './get-items.js';


let readPath = "./demo/items.json";

let readFileHandle;
let writeFileHandle;

try {
    readFileHandle = await open(readPath);
    const content = await readFileHandle.readFile();
    let data = JSON.parse(content);
    translateItems(data);
    //writeFileHandle = await open(readPath + ".transalted.json", "w+");
    //await writeFileHandle.writeFile(JSON.stringify(data));
} finally {
    //await writeFileHandle?.close();
    await readFileHandle?.close();
}