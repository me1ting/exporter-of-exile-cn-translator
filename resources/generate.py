from re import finditer
import sqlite3
import json

# uniques.json


def generate_uniques():
    con = sqlite3.connect('resources.db')
    cur = con.cursor()
    rows = cur.execute(
        'select v,k from translate_cn where source="Uniques.txt"').fetchall()
    con.close()

    con = sqlite3.connect('patch.db')
    cur = con.cursor()
    patch = cur.execute(
        'select k,v from "unique"').fetchall()
    con.close()
    rows.extend(patch)

    with open('./uniques.json', 'wt') as f:
        f.write(json.dumps(rows))

# armour.json


def generate_armour():
    con = sqlite3.connect('resources.db')
    cur = con.cursor()
    rows = cur.execute(
        'select v,k from translate_cn where source="Items_Armour.txt"').fetchall()
    con.close()

    con = sqlite3.connect('patch.db')
    cur = con.cursor()
    patch = cur.execute(
        'select k,v from armour').fetchall()
    con.close()
    rows.extend(patch)

    with open('./armour.json', 'wt') as f:
        f.write(json.dumps(rows))


# accessories.json


def generate_accessories():
    con = sqlite3.connect('resources.db')
    cur = con.cursor()
    rows = cur.execute(
        'select v,k from translate_cn where source="Items_Accessories.txt"').fetchall()
    con.close()

    con = sqlite3.connect('patch.db')
    cur = con.cursor()
    patch = cur.execute(
        'select k,v from accessory').fetchall()
    con.close()
    rows.extend(patch)

    with open('./accessories.json', 'wt') as f:
        f.write(json.dumps(rows))

# flasks.json


def generate_flasks():
    con = sqlite3.connect('resources.db')
    cur = con.cursor()
    rows = cur.execute(
        'select v,k from translate_cn where source="Items_Flasks.txt"').fetchall()
    con.close()

    con = sqlite3.connect('patch.db')
    cur = con.cursor()
    patch = cur.execute(
        'select k,v from flask').fetchall()
    con.close()
    rows.extend(patch)

    with open('./flasks.json', 'wt') as f:
        f.write(json.dumps(rows))

# weapons.json


def generate_weapons():
    con = sqlite3.connect('resources.db')
    cur = con.cursor()
    rows = cur.execute(
        'select v,k from translate_cn where source="Items_Weapons.txt"').fetchall()
    con.close()

    con = sqlite3.connect('patch.db')
    cur = con.cursor()
    patch = cur.execute(
        'select k,v from weapon').fetchall()
    con.close()
    rows.extend(patch)

    with open('./weapons.json', 'wt') as f:
        f.write(json.dumps(rows))

# gems.json


def generate_gems():
    con = sqlite3.connect('resources.db')
    cur = con.cursor()
    rows = cur.execute(
        'select v,k from translate_cn where source="Items_Gems.txt"').fetchall()
    con.close()

    con = sqlite3.connect('patch.db')
    cur = con.cursor()
    patch = cur.execute(
        'select k,v from gem').fetchall()
    con.close()
    rows.extend(patch)

    result = [[r[0].replace('(', '（').replace(')', '）'), r[1]] for r in rows]

    with open('./gems.json', 'wt') as f:
        f.write(json.dumps(result))

# requirement.json


def generate_requirements():
    con = sqlite3.connect('patch.db')
    cur = con.cursor()
    rows = cur.execute(
        'select k,v from requirement').fetchall()

    with open('./requirements.json', 'wt') as f:
        f.write(json.dumps(rows))

    con.close()

# properties.json


def generate_properties():
    con = sqlite3.connect('patch.db')
    cur = con.cursor()
    rows = cur.execute(
        'select k,v from property').fetchall()

    with open('./properties.json', 'wt') as f:
        f.write(json.dumps(rows))

    con.close()

# passive-skills.json


def generate_passive_skills():
    con = sqlite3.connect('resources.db')
    cur = con.cursor()
    rows = cur.execute(
        'select v,k from translate_cn where source="tree_dn"').fetchall()
    con.close()

    con = sqlite3.connect('patch.db')
    cur = con.cursor()
    patch = cur.execute(
        'select k,v from passive_skill').fetchall()
    con.close()
    rows.extend(patch)

    with open('./passive-skills.json', 'wt') as f:
        f.write(json.dumps(rows))

# modifiers.json


def generate_modifiers():
    con = sqlite3.connect('resources.db')
    cur = con.cursor()
    rows = cur.execute(
        'select v,k from translate_cn where source="statDescriptions"').fetchall()
    con.close()

    con = sqlite3.connect('patch.db')
    cur = con.cursor()
    patch = cur.execute(
        'select k,v from modifier').fetchall()
    con.close()
    rows.extend(patch)

    # 为了方便前端使用，需要将词缀模板进行处理：
    # - 将模板拆分为模板主体和形式参数列表两个部分
    newRows = []

    import re
    # 匹配模板中的：{0},{1}...
    pattern = re.compile(r'\{(\d)\}')
    for pair in rows:
        k = pair[0]
        v = pair[1]

        kMatchs = list(pattern.finditer(k))
        vMatchs = list(pattern.finditer(v))

        kBuf = []
        kParams = []
        lastIndex = 0
        for i, m in enumerate(kMatchs):
            param = m.group(1)
            start = m.start()
            end = m.end()

            kParams.append(int(param))
            kBuf.append(k[lastIndex:start])
            kBuf.append('{}')

            lastIndex = end

        if lastIndex < len(k):
            kBuf.append(k[lastIndex:])

        vBuf = []
        vParams = []
        lastIndex = 0
        if(len(kParams)) > 0:
            for m in pattern.finditer(v):
                param = m.group(1)
                start = m.start()
                end = m.end()

                vParams.append(int(param))
                vBuf.append(v[lastIndex:start])
                vBuf.append('{}')

                lastIndex = end

        if lastIndex < len(v):
            vBuf.append(v[lastIndex:])

        newRows.append((''.join(kBuf), kParams, ''.join(vBuf), vParams))

    with open('./modifiers.json', 'wt') as f:
        f.write(json.dumps(newRows))

# gem-tags.json


def generate_gem_tags():
    con = sqlite3.connect('resources.db')
    cur = con.cursor()
    rows = cur.execute(
        'select v,k from translate_cn where source="Gems_tag"').fetchall()

    with open('./gem-tags.json', 'wt') as f:
        f.write(json.dumps(rows))

    con.close()

# gem-properties.json


def generate_gem_properties():
    con = sqlite3.connect('patch.db')
    cur = con.cursor()
    rows = cur.execute(
        'select k,v from gem_property').fetchall()

    with open('./gem-properties.json', 'wt') as f:
        f.write(json.dumps(rows))

    con.close()


# jewels.json


def generate_jewels():
    con = sqlite3.connect('resources.db')
    cur = con.cursor()
    rows = cur.execute(
        'select v,k from translate_cn where source="Items_Jewels.txt"').fetchall()

    with open('./jewels.json', 'wt') as f:
        f.write(json.dumps(rows))

    con.close()


generate_uniques()
generate_armour()
generate_accessories()
generate_flasks()
generate_weapons()
generate_gems()
generate_properties()
generate_requirements()
generate_passive_skills()
generate_modifiers()
# generate_gem_tags()
# generate_gem_properties()
generate_jewels()
