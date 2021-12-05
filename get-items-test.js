import {
    open,
} from 'node:fs/promises';

import { translate } from './get-items.js';


let readPath = "./demo/pob/items1.json";

let readFileHandle;
let writeFileHandle;

try {
    readFileHandle = await open(readPath);
    const content = await readFileHandle.readFile();
    let data = JSON.parse(content);
    translate(data);
    writeFileHandle = await open(readPath + ".transalted.json", "w+");
    await writeFileHandle.writeFile(JSON.stringify(data));

} finally {
    await writeFileHandle?.close();
    await readFileHandle?.close();
}