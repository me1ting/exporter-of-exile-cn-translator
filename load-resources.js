export { uniques } from "./resources/uniques.js";
export { repeatedUniques } from "./resources/uniques-repeated.js";
export { armour } from "./resources/armour.js";
export { repeatedArmour } from "./resources/armour-repeated.js"
export { accessories } from "./resources/accessories.js";
export { flasks } from "./resources/flasks.js";
export { weapons } from "./resources/weapons.js";
export { repeatedWeapons } from "./resources/weapons-repeated.js"
export { gems } from "./resources/gems.js";
export { properties } from "./resources/properties.js";
export { requirements } from "./resources/requirements.js";
export { formulableNodes } from "./resources/formulable-nodes.js";
export { repeatedFormulableNodes } from "./resources/formulable-nodes-repeated.js";
export { modifiers } from "./resources/modifiers.js";
export { repeatedModifiers } from "./resources/repeated-modifiers.js";
export { jewels } from "./resources/jewels.js";

export function shouldBeTranlated(target) {
    console.log("should be translated: " + target.type + "," + target.content);
}