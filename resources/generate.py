from re import finditer
import sqlite3
import json


# uniques.js


def generate_uniques():
    con = sqlite3.connect('databases/translations.db')
    cur = con.cursor()
    rows = cur.execute(
        'select k,v from "unique"').fetchall()
    con.close()

    data = {}
    for r in rows:
        data[r[0]] = r[1]

    save_dict_as_javascript('./uniques.js', data, 'uniques')


# armour.js


def generate_armour():
    con = sqlite3.connect('databases/translations.db')
    cur = con.cursor()
    rows = cur.execute(
        'select k,v from armour').fetchall()
    con.close()

    data = {}
    for r in rows:
        data[r[0]] = r[1]

    save_dict_as_javascript('./armour.js', data, 'armour')


# accessories.js


def generate_accessories():
    con = sqlite3.connect('databases/translations.db')
    cur = con.cursor()
    rows = cur.execute(
        'select k,v from accessory').fetchall()
    con.close()

    data = {}
    for r in rows:
        data[r[0]] = r[1]

    save_dict_as_javascript('./accessories.js', data, 'accessories')


# flasks.js


def generate_flasks():
    con = sqlite3.connect('databases/translations.db')
    cur = con.cursor()
    rows = cur.execute(
        'select k,v from flask').fetchall()
    con.close()

    data = {}
    for r in rows:
        data[r[0]] = r[1]

    save_dict_as_javascript('./flasks.js', data, 'flasks')


# weapons.js


def generate_weapons():
    con = sqlite3.connect('databases/translations.db')
    cur = con.cursor()
    rows = cur.execute(
        'select k,v from weapon').fetchall()
    con.close()

    data = {}
    for r in rows:
        data[r[0]] = r[1]

    save_dict_as_javascript('./weapons.js', data, 'weapons')


# gems.js


def generate_gems():
    con = sqlite3.connect('databases/translations.db')
    cur = con.cursor()
    rows = cur.execute(
        'select k,v from gem').fetchall()
    con.close()

    data = {}
    for r in rows:
        data[r[0]] = r[1]

    save_dict_as_javascript('./gems.js', data, 'gems')


# requirements.js


def generate_requirements():
    con = sqlite3.connect('databases/translations.db')
    cur = con.cursor()
    rows = cur.execute(
        'select k,v from requirement').fetchall()
    con.close()

    data = {}
    for r in rows:
        data[r[0]] = r[1]

    save_dict_as_javascript('./requirements.js', data, 'requirements')


# properties.js


def generate_properties():
    con = sqlite3.connect('databases/translations.db')
    cur = con.cursor()
    rows = cur.execute(
        'select k,v from property').fetchall()
    con.close()

    data = {}
    for r in rows:
        data[r[0]] = r[1]

    save_dict_as_javascript('./properties.js', data, 'properties')


# formulable-nodes.js


def generate_formulable_nodes():
    con = sqlite3.connect('databases/translations.db')
    cur = con.cursor()
    rows = cur.execute(
        'select k,v from formulable_node').fetchall()
    con.close()

    data = {}

    for r in rows:
        data[r[0]] = r[1]

    save_dict_as_javascript('./formulable-nodes.js', data, 'formulableNodes')

# modifiers.js


def generate_modifiers():
    con = sqlite3.connect('databases/translations.db')
    cur = con.cursor()
    rows = cur.execute(
        'select k,v from modifier').fetchall()
    con.close()

    # 为了方便前端使用，需要将词缀模板进行处理：
    # - 将模板拆分为模板主体和形式参数列表两个部分
    formattedRows = []

    for r in rows:
        k = r[0]
        v = r[1]
        fromTplBody, fromParams = parseTemplate(k)
        toTplBody, toParams = parseTemplate(v)

        formattedRows.append(
            (fromTplBody, {"fromParams": fromParams, "toTplBody": toTplBody, "toParams": toParams}))

    rows = formattedRows

    data = {}

    # 模板主体存在重复的情况，只是参数顺序的不同，因此任意一个值都是正确的。
    for r in rows:
        data[r[0]] = r[1]

    save_dict_as_javascript('./modifiers.js', data, 'modifiers')


def parseTemplate(t):
    import re
    pattern = re.compile(r'\{(\d)\}')
    matchs = list(pattern.finditer(t))

    if len(matchs) == 0:
        return t, []

    buf = []
    params = []
    lastIndex = 0
    for m in matchs:
        param = m.group(1)
        start = m.start()
        end = m.end()

        params.append(int(param))
        buf.append(t[lastIndex:start])
        buf.append('{}')  # 占位符

        lastIndex = end

    if lastIndex < len(t):
        buf.append(t[lastIndex:])

    return ''.join(buf), params

# jewels.json


def generate_jewels():
    con = sqlite3.connect('databases/translations.db')
    cur = con.cursor()
    rows = cur.execute(
        'select k,v from jewel').fetchall()
    con.close()

    data = {}

    for r in rows:
        data[r[0]] = r[1]

    save_dict_as_javascript('./jewels.js', data, 'jewels')


def save_dict_as_javascript(path, data, name):
    with open(path, 'wt') as f:
        f.write(f'export const {name} = new Map([')
        for k, v in data.items():
            f.write(f'[{json.dumps(k)},{json.dumps(v)}],')
        f.write("]);")


generate_uniques()
generate_armour()
generate_accessories()
generate_flasks()
generate_weapons()
generate_gems()
generate_requirements()
generate_properties()
generate_formulable_nodes()
generate_modifiers()
generate_jewels()
