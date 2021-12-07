import { translateItem } from "./get-items.js";
import { transEnchantMod, transProperty,transPassiveSkill } from "./resources.js";


export function translatePassiveSkills(data){
    if(data.items){
        for (const item of data.items){
            translateItem(item);
        }
    }
}