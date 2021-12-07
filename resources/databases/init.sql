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
INSERT INTO "main"."requirement" ("k", "v") VALUES ('等级', 'Level');
INSERT INTO "main"."requirement" ("k", "v") VALUES ('力量', 'Str');
INSERT INTO "main"."requirement" ("k", "v") VALUES ('敏捷', 'Dex');
INSERT INTO "main"."requirement" ("k", "v") VALUES ('智慧', 'Int');
INSERT INTO "main"."requirement" ("k", "v") VALUES ('(宝石)', '(gem)');

drop table property;
CREATE TABLE "property" (
	"id"	INTEGER NOT NULL,
	"k"	TEXT,
	"v"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
INSERT INTO "main"."property" ("k", "v") VALUES ('品质', 'Quality');
INSERT INTO "main"."property" ("k", "v") VALUES ('{1} 秒内回复 {0} 生命', 'Recovers {0} Life over {1} Seconds');
INSERT INTO "main"."property" ("k", "v") VALUES ('{1} 秒内回复 {0} 魔力', 'Recovers {0} Mana over {1} Seconds');
INSERT INTO "main"."property" ("k", "v") VALUES ('每次使用会从 {1} 充能次数中消耗 {0} 次', 'Consumes {0} of {1} Charges on use');
INSERT INTO "main"."property" ("k", "v") VALUES ('物理伤害', 'Physical Damage');
INSERT INTO "main"."property" ("k", "v") VALUES ('能量护盾', 'Energy Shield');
INSERT INTO "main"."property" ("k", "v") VALUES ('武器范围', 'Weapon Range');
INSERT INTO "main"."property" ("k", "v") VALUES ('持续 {0} 秒', 'Lasts {0} Seconds');
INSERT INTO "main"."property" ("k", "v") VALUES ('闪避值', 'Evasion rating');
INSERT INTO "main"."property" ("k", "v") VALUES ('目前有 {0} 充能次数', 'Currently has {0} Charges');
INSERT INTO "main"."property" ("k", "v") VALUES ('弓', 'Bow');
INSERT INTO "main"."property" ("k", "v") VALUES ('火焰，冰霜，闪电伤害', 'Elemental Damage');
INSERT INTO "main"."property" ("k", "v") VALUES ('攻击暴击率', 'Critical Strike Chance');
INSERT INTO "main"."property" ("k", "v") VALUES ('每秒攻击次数', 'Attacks per Second');
INSERT INTO "main"."property" ("k", "v") VALUES ('品质（元素伤害词缀）', 'Quality (Elemental Damage Modifiers)');
INSERT INTO "main"."property" ("k", "v") VALUES ('符文匕首', 'Rune Dagger');
INSERT INTO "main"."property" ("k", "v") VALUES ('护甲', 'Armour');
INSERT INTO "main"."property" ("k", "v") VALUES ('品质（生命和魔力词缀）', 'Quality (Life and Mana Modifiers)');
INSERT INTO "main"."property" ("k", "v") VALUES ('等级', 'Level');
INSERT INTO "main"."property" ("k", "v") VALUES ('深渊', 'Abyss');
INSERT INTO "main"."property" ("k", "v") VALUES ('品质（属性词缀）', 'Quality (Attribute Modifiers)');
INSERT INTO "main"."property" ("k", "v") VALUES ('品质（物理伤害和混沌伤害词缀）', 'Quality (Physical and Chaos Damage Modifiers)');
INSERT INTO "main"."property" ("k", "v") VALUES ('范围', 'Radius');
INSERT INTO "main"."property" ("k", "v") VALUES ('中', 'Medium');
INSERT INTO "main"."property" ("k", "v") VALUES ('格挡几率', 'Chance to Block');
INSERT INTO "main"."property" ("k", "v") VALUES ('法杖', 'Wand');
INSERT INTO "main"."property" ("k", "v") VALUES ('变量', 'Variable');
INSERT INTO "main"."property" ("k", "v") VALUES ('大', 'Large');
INSERT INTO "main"."property" ("k", "v") VALUES ('小', 'Small');
INSERT INTO "main"."property" ("k", "v") VALUES ('品质（抗性词缀）', 'Quality (Resistance Modifiers)');
INSERT INTO "main"."property" ("k", "v") VALUES ('战杖', 'Warstaff');

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