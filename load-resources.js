export { uniques } from "./resources/uniques.js";
export { armour } from "./resources/armour.js";
export { accessories } from "./resources/accessories.js";
export { flasks } from "./resources/flasks.js";
export { weapons } from "./resources/weapons.js";
export { gems } from "./resources/gems.js";
export { properties } from "./resources/properties.js";
export { requirements } from "./resources/requirements.js";
export { formulableNodes } from "./resources/formulable-nodes.js";
export { modifiers } from "./resources/modifiers.js";
export { jewels } from "./resources/jewels.js";

export function shouldBeTranlated(target) {
    console.log("should be translated: " + target.type + "," + target.content);
}