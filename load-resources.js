import { createWriteStream } from 'node:fs';
import {open} from 'node:fs/promises';

const uniquesFile = await open("./resources/uniques.json");
export const uniques = new Map();
try {
    const content =await uniquesFile.readFile();
    let data = JSON.parse(content);
    if (data){
        for (const row of data) {
            uniques[row[0]] = row[1];
        }
    }
}finally{
    await uniquesFile.close();
}

const armourFile = await open("./resources/armour.json");
export const armour = new Map();
try {
    const content =await armourFile.readFile();
    let data = JSON.parse(content);
    if (data){
        for (const row of data) {
            armour[row[0]] = row[1];
        }
    }
}finally{
    await armourFile.close();
}

const accessoriesFile = await open("./resources/accessories.json");
export const accessories = new Map();
try {
    const content =await accessoriesFile.readFile();
    let data = JSON.parse(content);
    if (data){
        for (const row of data) {
            accessories[row[0]] = row[1];
        }
    }
}finally{
    await accessoriesFile.close();
}

const flasksFile = await open("./resources/flasks.json");
export const flasks = new Map();
try {
    const content =await flasksFile.readFile();
    let data = JSON.parse(content);
    if (data){
        for (const row of data) {
            flasks[row[0]] = row[1];
        }
    }
}finally{
    await flasksFile.close();
}

const weaponsFile = await open("./resources/weapons.json");
export const weapons = new Map();
try {
    const content =await weaponsFile.readFile();
    let data = JSON.parse(content);
    if (data){
        for (const row of data) {
            weapons[row[0]] = row[1];
        }
    }
}finally{
    await weaponsFile.close();
}

const gemsFile = await open("./resources/gems.json");
export const gems = new Map();
try {
    const content =await gemsFile.readFile();
    let data = JSON.parse(content);
    if (data){
        for (const row of data) {
            gems[row[0]] = row[1];
        }
    }
}finally{
    await gemsFile.close();
}

const propertiesFile = await open("./resources/properties.json");
export const properties = new Map();
try {
    const content =await propertiesFile.readFile();
    let data = JSON.parse(content);
    if (data){
        for (const row of data) {
            properties[row[0]] = row[1];
        }
    }
}finally{
    await propertiesFile.close();
}

const requirementsFile = await open("./resources/requirements.json");
export const requirements = new Map();
try {
    const content =await requirementsFile.readFile();
    let data = JSON.parse(content);
    if (data){
        for (const row of data) {
            requirements[row[0]] = row[1];
        }
    }
}finally{
    await requirementsFile.close();
}

const passiveSkillsFile = await open("./resources/passive-skills.json");
export const passiveSkills = new Map();
try {
    const content =await passiveSkillsFile.readFile();
    let data = JSON.parse(content);
    if (data){
        for (const row of data) {
            passiveSkills[row[0]] = row[1];
        }
    }
}finally{
    await passiveSkillsFile.close();
}

const modifiersFile = await open("./resources/modifiers.json");
export const modifiers = new Map();
try {
    const content =await modifiersFile.readFile();
    let data = JSON.parse(content);
    if (data){
        for (const row of data) {
            let key = row[0];
            let kParams = row[1];
            let v = row[2];
            let vParams = row[3];
            
            let val = new Object();
            val.toTplBody = v;
            val.fromParams = kParams;
            val.toParams = vParams;

            if(key in modifiers){
                modifiers[key].push(val);
            }else{
                modifiers[key] = [val];
            }
        }
    }
}finally{
    await modifiersFile.close();
}

const jewelsFile = await open("./resources/jewels.json");
export const jewels = new Map();
try {
    const content =await jewelsFile.readFile();
    let data = JSON.parse(content);
    if (data){
        for (const row of data) {
            jewels[row[0]] = row[1];
        }
    }
}finally{
    await jewelsFile.close();
}


const logFile = "./resources/should_be_translated.txt";
const shouldBeTranslatedLogger  = createWriteStream(logFile, {flags:'a'});
export function shouldBeTranlated(target){
    shouldBeTranslatedLogger.write(target.type+","+target.content+"\r\n");
}