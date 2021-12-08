drop table "unique";
CREATE TABLE "unique" (
	"id"	INTEGER,
	"k"	TEXT,
	"v"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

drop table armour;
CREATE TABLE "armour" (
	"id"	INTEGER NOT NULL,
	"k"	TEXT,
	"v"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

drop table accessory;
CREATE TABLE "accessory" (
	"id"	INTEGER NOT NULL,
	"k"	TEXT,
	"v"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

drop table flask;
CREATE TABLE "flask" (
	"id"	INTEGER NOT NULL,
	"k"	TEXT,
	"v"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

drop table weapon;
CREATE TABLE "weapon" (
	"id"	INTEGER NOT NULL,
	"k"	TEXT,
	"v"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

drop table gem;
CREATE TABLE "gem" (
	"id"	INTEGER NOT NULL,
	"k"	TEXT,
	"v"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

drop table gem;
CREATE TABLE "gem" (
	"id"	INTEGER NOT NULL,
	"k"	TEXT,
	"v"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

drop table requirement;
CREATE TABLE "requirement" (
	"id"	INTEGER NOT NULL,
	"k"	TEXT,
	"v"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
INSERT INTO "requirement" ("k", "v") VALUES ('等级', 'Level');
INSERT INTO "requirement" ("k", "v") VALUES ('力量', 'Str');
INSERT INTO "requirement" ("k", "v") VALUES ('敏捷', 'Dex');
INSERT INTO "requirement" ("k", "v") VALUES ('智慧', 'Int');
INSERT INTO "requirement" ("k", "v") VALUES ('(宝石)', '(gem)');

drop table property;
CREATE TABLE "property" (
	"id"	INTEGER NOT NULL,
	"k"	TEXT,
	"v"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
INSERT INTO "property" ("k", "v") VALUES ('品质', 'Quality');
INSERT INTO "property" ("k", "v") VALUES ('品质（属性词缀）', 'Quality (Attribute Modifiers)');
INSERT INTO "property" ("k", "v") VALUES ('品质（物理伤害和混沌伤害词缀）', 'Quality (Physical and Chaos Damage Modifiers)');
INSERT INTO "property" ("k", "v") VALUES ('品质（生命和魔力词缀）', 'Quality (Life and Mana Modifiers)');
INSERT INTO "property" ("k", "v") VALUES ('品质（元素伤害词缀）', 'Quality (Elemental Damage Modifiers)');
INSERT INTO "property" ("k", "v") VALUES ('品质（抗性词缀）', 'Quality (Resistance Modifiers)');
INSERT INTO "property" ("k", "v") VALUES ('品质（暴击词缀）', 'Quality (Caster Modifiers)');
INSERT INTO "property" ("k", "v") VALUES ('{1} 秒内回复 {0} 生命', 'Recovers {0} Life over {1} Seconds');
INSERT INTO "property" ("k", "v") VALUES ('{1} 秒内回复 {0} 魔力', 'Recovers {0} Mana over {1} Seconds');
INSERT INTO "property" ("k", "v") VALUES ('每次使用会从 {1} 充能次数中消耗 {0} 次', 'Consumes {0} of {1} Charges on use');
INSERT INTO "property" ("k", "v") VALUES ('物理伤害', 'Physical Damage');
INSERT INTO "property" ("k", "v") VALUES ('能量护盾', 'Energy Shield');
INSERT INTO "property" ("k", "v") VALUES ('武器范围', 'Weapon Range');
INSERT INTO "property" ("k", "v") VALUES ('持续 {0} 秒', 'Lasts {0} Seconds');
INSERT INTO "property" ("k", "v") VALUES ('闪避值', 'Evasion rating');
INSERT INTO "property" ("k", "v") VALUES ('目前有 {0} 充能次数', 'Currently has {0} Charges');
INSERT INTO "property" ("k", "v") VALUES ('火焰，冰霜，闪电伤害', 'Elemental Damage');
INSERT INTO "property" ("k", "v") VALUES ('攻击暴击率', 'Critical Strike Chance');
INSERT INTO "property" ("k", "v") VALUES ('每秒攻击次数', 'Attacks per Second');
INSERT INTO "property" ("k", "v") VALUES ('护甲', 'Armour');
INSERT INTO "property" ("k", "v") VALUES ('等级', 'Level');
INSERT INTO "property" ("k", "v") VALUES ('深渊', 'Abyss');
INSERT INTO "property" ("k", "v") VALUES ('格挡几率', 'Chance to Block');
INSERT INTO "property" ("k", "v") VALUES ('范围', 'Radius');
INSERT INTO "property" ("k", "v") VALUES ('变量', 'Variable');
INSERT INTO "property" ("k", "v") VALUES ('大', 'Large');
INSERT INTO "property" ("k", "v") VALUES ('中', 'Medium');
INSERT INTO "property" ("k", "v") VALUES ('小', 'Small');
INSERT INTO "property" ("k", "v") VALUES ('弓', 'Bow');
INSERT INTO "property" ("k", "v") VALUES ('战杖', 'Warstaff');
INSERT INTO "property" ("k", "v") VALUES ('单手剑', 'One Handed Sword');
INSERT INTO "property" ("k", "v") VALUES ('符文匕首', 'Rune Dagger');
INSERT INTO "property" ("k", "v") VALUES ('法杖', 'Wand');
INSERT INTO "property" ("k", "v") VALUES ('仅限', 'Limited to');

drop table formulable_node;
CREATE TABLE "formulable_node" (
	"id"	INTEGER NOT NULL,
	"k"	TEXT,
	"v"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

drop table modifier;
CREATE TABLE "modifier" (
	"id"	INTEGER NOT NULL,
	"k"	TEXT,
	"v"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

drop table jewel;
CREATE TABLE "jewel" (
	"id"	INTEGER NOT NULL,
	"k"	TEXT,
	"v"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

drop table repeated_modifier;
CREATE TABLE "repeated_modifier" (
	"id"	INTEGER NOT NULL,
	"k"	TEXT,
	"v"	TEXT,
	"ctx" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
INSERT INTO "repeated_modifier" ("k", "v", "ctx") VALUES ('药剂持续期间，移动速度提高 {0}%', '{0}% increased Movement Speed during Flask effect','{"types":["flask"]}');
INSERT INTO "repeated_modifier" ("k", "v") VALUES ('药剂持续期间，移动速度提高 {0}%', '{0}% increased Movement Speed during any Flask Effect');
INSERT INTO "repeated_modifier" ("k", "v", "ctx") VALUES ('药剂持续期间，攻击速度提高 {0}%', '{0}% increased Attack Speed during Flask effect','{"types":["flask"]}');
INSERT INTO "repeated_modifier" ("k", "v") VALUES ('药剂持续期间，攻击速度提高 {0}%', '{0}% increased Attack Speed during any Flask Effect');
INSERT INTO "repeated_modifier" ("k", "v") VALUES ('若你至少拥有 {1} 点敏捷，可以投掷地雷的技能就会最多额外投掷 {0} 个地雷', 'Skills which throw Mines throw up to {0} additional Mines if you have at least {1} Dexterity');
INSERT INTO "repeated_modifier" ("k", "v", "ctx") VALUES ('若你至少拥有 {1} 点敏捷，可以投掷地雷的技能就会最多额外投掷 {0} 个地雷', 'Skills which throw Mines throw up to {0} additional Mine if you have at least {1} Dexterity', '{"isSingle":true,"singleIndex":1}');
INSERT INTO "repeated_modifier" ("k", "v") VALUES ('若你至少拥有 {1} 点智慧，可以放置地雷的技能就会最多额外投掷 {0} 个地雷', 'Skills which throw Mines throw up to {0} additional Mines if you have at least {1} Intelligence');
INSERT INTO "repeated_modifier" ("k", "v", "ctx") VALUES ('若你至少拥有 {1} 点智慧，可以放置地雷的技能就会最多额外投掷 {0} 个地雷', 'Skills which throw Mines throw up to {0} additional Mine if you have at least {1} Intelligence', '{"isSingle":true,"singleIndex":1}');
