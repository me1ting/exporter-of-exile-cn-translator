import {
    open,
} from 'node:fs/promises';

import { translate } from './get-passive-skills.js';


let readPath = "./demo/pob/tree1.json";

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