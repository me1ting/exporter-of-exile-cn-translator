import sqlite3

# 先执行init.sql，再执行本脚本


def init_uniques():
    con = sqlite3.connect('resources.db')
    cur = con.cursor()
    rows = cur.execute(
        'select v,k from translate_cn where source="Uniques.txt"').fetchall()
    con.close()

    data = {}
    for r in rows:
        # 通知重复项
        # 前端应该检查并处理重复项，数据库中重复项的翻译是不可靠的
        if r[0] in data and r[1] != data[r[0]]:
            print("repeated unique: ", r[0], data[r[0]], r[1])
        data[r[0]] = r[1]

    con = sqlite3.connect('translations.db')
    cur = con.cursor()

    for k, v in data.items():
        cur.execute(f'INSERT INTO "unique" ("k", "v") VALUES ("{k}","{v}")')
    con.commit()
    con.close()


def init_armour():
    con = sqlite3.connect('resources.db')
    cur = con.cursor()
    rows = cur.execute(
        'select v,k from translate_cn where source="Items_Armour.txt"').fetchall()
    con.close()

    rows = list(rows)
    # 补充
    rows.append(['异色鞋 (火冰)', 'Two-Toned Boots'])

    data = {}
    for r in rows:
        if r[0] in data and r[1] != data[r[0]]:
            print("repeated armour: ", r[0], data[r[0]], r[1])
        data[r[0]] = r[1]

    con = sqlite3.connect('translations.db')
    cur = con.cursor()

    for k, v in data.items():
        cur.execute(f'INSERT INTO "armour" ("k", "v") VALUES ("{k}","{v}")')
    con.commit()
    con.close()


def init_accessories():
    con = sqlite3.connect('resources.db')
    cur = con.cursor()
    rows = cur.execute(
        'select v,k from translate_cn where source="Items_Accessories.txt"').fetchall()
    con.close()

    rows = list(rows)
    # 补充
    rows.append(["宝钻戒指", "Diamond Ring"])

    data = {}
    for r in rows:
        if r[0] in data and r[1] != data[r[0]]:
            print("repeated accessory: ", r[0], data[r[0]], r[1])
        data[r[0]] = r[1]

    con = sqlite3.connect('translations.db')
    cur = con.cursor()

    for k, v in data.items():
        cur.execute(f'INSERT INTO "accessory" ("k", "v") VALUES ("{k}","{v}")')
    con.commit()
    con.close()


def init_flasks():
    con = sqlite3.connect('resources.db')
    cur = con.cursor()
    rows = cur.execute(
        'select v,k from translate_cn where source="Items_Flasks.txt"').fetchall()
    con.close()

    rows = list(rows)
    # 补充
    rows.append(["黄金药剂", "Gold Flask"])

    data = {}
    for r in rows:
        if r[0] in data and r[1] != data[r[0]]:
            print("repeated flask: ", r[0], data[r[0]], r[1])
        data[r[0]] = r[1]

    con = sqlite3.connect('translations.db')
    cur = con.cursor()

    for k, v in data.items():
        cur.execute(f'INSERT INTO "flask" ("k", "v") VALUES ("{k}","{v}")')
    con.commit()
    con.close()


def init_weapons():
    con = sqlite3.connect('resources.db')
    cur = con.cursor()
    rows = cur.execute(
        'select v,k from translate_cn where source="Items_Weapons.txt"').fetchall()
    con.close()

    rows = list(rows)
    # 覆盖数据
    rows.append(["锋刃重锤", "Pernach"])

    data = {}
    for r in rows:
        if r[0] in data and r[1] != data[r[0]]:
            print("repeated weapon: ", r[0], data[r[0]], r[1])
        data[r[0]] = r[1]

    con = sqlite3.connect('translations.db')
    cur = con.cursor()

    for k, v in data.items():
        cur.execute(f'INSERT INTO "weapon" ("k", "v") VALUES ("{k}","{v}")')
    con.commit()
    con.close()

def init_gems():
    con = sqlite3.connect('resources.db')
    cur = con.cursor()
    rows = cur.execute(
        'select v,k from translate_cn where source="Items_Gems.txt"').fetchall()
    con.close()

    rows = list(rows)
    # 格式化
    formattedRows = [
        [r[0].replace('(', '（').replace(')', '）'), r[1]] for r in rows]
    rows = formattedRows
    # 补充
    rows.append(['持续时间缩短（辅）','Less Duration'])
    rows.append(['弹幕','Barrage'])
    rows.append(['提高暴击几率（辅）','Increased Critical Strikes'])
    # 覆盖
    rows.append(['低阶毒化（辅）','Chance to Poison'])
    rows.append(['毒化（辅）','Critical Strike Affliction'])
    rows.append(['增大范围（强辅）','Awakened Increased Area of Effect'])
    rows.append(['武器元素伤害（强辅）','Awakened Elemental Damage with Attacks'])

    data = {}
    for r in rows:
        if r[0] in data and r[1] != data[r[0]]:
            print("repeated gem: ", r[0], data[r[0]], r[1])
        data[r[0]] = r[1]

    con = sqlite3.connect('translations.db')
    cur = con.cursor()

    for k, v in data.items():
        cur.execute(f'INSERT INTO "gem" ("k", "v") VALUES ("{k}","{v}")')
    con.commit()
    con.close()

def init_jewels():
    con = sqlite3.connect('resources.db')
    cur = con.cursor()
    rows = cur.execute(
        'select v,k from translate_cn where source="Items_Jewels.txt"').fetchall()
    con.close()

    rows = list(rows)

    data = {}
    for r in rows:
        if r[0] in data and r[1] != data[r[0]]:
            print("repeated jewel: ", r[0], data[r[0]], r[1])
        data[r[0]] = r[1]

    con = sqlite3.connect('translations.db')
    cur = con.cursor()

    for k, v in data.items():
        cur.execute(f'INSERT INTO "jewel" ("k", "v") VALUES ("{k}","{v}")')
    con.commit()
    con.close()

if __name__ == "__main__":
    init_uniques()
    init_armour()
    init_accessories()
    init_flasks()
    init_weapons()
    init_gems()
    init_jewels()
