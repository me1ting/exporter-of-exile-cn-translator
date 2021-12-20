import { translateGoods } from "./trade.js";

let goods = "物品类别: 箭袋\r\n稀 有 度: 稀有\r\n咒缚 掌爪\r\n刺锋箭袋\r\n--------\r\n需求:\r\n等级: 64\r\n--------\r\n物品等级: 84\r\n--------\r\n攻击和法术暴击率提高 27% (implicit)\r\n--------\r\n攻击速度提高 6%\r\n弓类攻击的暴击率提高 11%\r\n弓类攻击 +27% 暴击伤害加成\r\n+39 最大生命\r\n弓类攻击发射一支额外箭矢\r\n攻击技能的元素伤害提高 30% (crafted)\r\n--------\r\n督军物品\r\n--------\r\n出售获得通货: 非绑定\r\n";

let result = translateGoods(goods);
console.log(result);