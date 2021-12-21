import {
    open,
} from 'node:fs/promises';

import { translatePassiveSkills } from './get-passive-skills.js';


let readPath = "./demo/tree.json";

let readFileHandle;
let writeFileHandle;

try {
    readFileHandle = await open(readPath);
    const content = await readFileHandle.readFile();
    let data = JSON.parse(content);
    translatePassiveSkills(data);
    writeFileHandle = await open(readPath + ".transalted.json", "w+");
    await writeFileHandle.writeFile(JSON.stringify(data));

} finally {
    await writeFileHandle?.close();
    await readFileHandle?.close();
}