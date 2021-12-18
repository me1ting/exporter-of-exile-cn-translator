from re import finditer
import sqlite3
import json

# 为了方便前端使用，将json格式的数据库转换为js格式存储。
# 每一个数据库以map的形式存储，k为中文。
# 基本数据库的v为对应的英文翻译，附加的repeated数据库的v为对象。
#   每个对象有两个字段：
#   - v: 英文翻译
#   - ctx: 上下文对象，用于匹配上下文，从而选出合适的值。


# uniques.js,uniques-reapated.js


def generate_uniques():
    data = {}

    with open('./databases/uniques.json', 'rt', encoding="utf-8") as f:
        db = json.loads(f.read())

        for k, v in db.items():
            data[k] = v

        save_dict_as_javascript('./uniques.js', data, 'uniques')

    data2 = {}
    with open('./databases/uniques_repeated.json', 'rt', encoding="utf-8") as f:
        db = json.loads(f.read())

        for k, v in db.items():
            if k in data:
                # 重复项出现于非重复项中，需要手动处理
                print(f"find repeated key in uniques: {k}")
            else:
                data2[k] = v

        save_dict_as_javascript('./uniques-repeated.js',
                                data2, 'repeatedUniques')


# armour.js,armour-repeated.js


def generate_armour():
    data = {}

    with open('./databases/armour.json', 'rt', encoding="utf-8") as f:
        db = json.loads(f.read())

        for k, v in db.items():
            data[k] = v

        save_dict_as_javascript('./armour.js', data, 'armour')

    data2 = {}
    with open('./databases/armour_repeated.json', 'rt', encoding="utf-8") as f:
        db = json.loads(f.read())

        for k, v in db.items():
            if k in data:
                # 重复项出现于非重复项中，需要手动处理
                print(f"find repeated key in armour: {k}")
            else:
                data2[k] = v

        save_dict_as_javascript('./armour-repeated.js',
                                data2, 'repeatedArmour')


# accessories.js


def generate_accessories():
    data = {}

    with open('./databases/accessories.json', 'rt', encoding="utf-8") as f:
        db = json.loads(f.read())

        for k, v in db.items():
            data[k] = v

        save_dict_as_javascript('./accessories.js', data, 'accessories')

# flasks.js


def generate_flasks():
    data = {}

    with open('./databases/flasks.json', 'rt', encoding="utf-8") as f:
        db = json.loads(f.read())

        for k, v in db.items():
            data[k] = v

    save_dict_as_javascript('./flasks.js', data, 'flasks')


# weapons.js,weapons-repeated.js


def generate_weapons():
    data = {}

    with open('./databases/weapons.json', 'rt', encoding="utf-8") as f:
        db = json.loads(f.read())

        for k, v in db.items():
            data[k] = v

        save_dict_as_javascript('./weapons.js', data, 'weapons')

    data2 = {}
    with open('./databases/weapons_repeated.json', 'rt', encoding="utf-8") as f:
        db = json.loads(f.read())

        for k, v in db.items():
            if k in data:
                # 重复项出现于非重复项中，需要手动处理
                print(f"find repeated key in weapons: {k}")
            else:
                data2[k] = v

        save_dict_as_javascript('./weapons-repeated.js',
                                data2, 'repeatedWeapons')


# gems.js


def generate_gems():
    data = {}

    with open('./databases/gems.json', 'rt', encoding="utf-8") as f:
        db = json.loads(f.read())

        for k, v in db.items():
            data[k] = v

    save_dict_as_javascript('./gems.js', data, 'gems')


# requirements.js


def generate_requirements():
    data = {}

    with open('./databases/requirements.json', 'rt', encoding="utf-8") as f:
        db = json.loads(f.read())

        for k, v in db.items():
            data[k] = v

    save_dict_as_javascript('./requirements.js', data, 'requirements')


# properties.js


def generate_properties():
    data = {}

    with open('./databases/properties.json', 'rt', encoding="utf-8") as f:
        db = json.loads(f.read())

        for k, v in db.items():
            data[k] = v

    save_dict_as_javascript('./properties.js', data, 'properties')


# formulable-nodes.js,formulable-nodes-repeated.js


def generate_formulable_nodes():
    data = {}

    with open('./databases/formulable_nodes.json', 'rt', encoding="utf-8") as f:
        db = json.loads(f.read())

        for k, v in db.items():
            data[k] = v

    save_dict_as_javascript('./formulable-nodes.js', data, 'formulableNodes')

    data2 = {}
    with open('./databases/formulable_nodes_repeated.json', 'rt', encoding="utf-8") as f:
        db = json.loads(f.read())

        for k, v in db.items():
            if k in data:
                # 重复项出现于非重复项中，需要手动处理
                print(f"find repeated key in formulable_nodes: {k}")
            else:
                data2[k] = v

    save_dict_as_javascript('./formulable-nodes-repeated.js',
                            data2, 'repeatedFormulableNodes')


# modifiers.js,modifiers-repeated.js


def generate_modifiers():
    db = None
    with open('./databases/modifiers.json', 'rt', encoding="utf-8") as f:
        db = json.loads(f.read())

    # 为了方便前端使用，需要将词缀模板进行处理：
    # - 将模板拆分为模板主体和形式参数列表两个部分
    data = {}
    
    for k,v in db.items():
        fromTplBody, fromParams = parseTemplate(k)
        toTplBody, toParams = parseTemplate(v)

        # 模板主体存在重复的情况，通知手动检查重复的模板主体。
        if fromTplBody in data:
            print(f"repeated template body: {fromTplBody}")

        data[fromTplBody] = {"fromParams": fromParams, "toTplBody": toTplBody, "toParams": toParams}

    save_dict_as_javascript('./modifiers.js', data, 'modifiers')

    db = None
    with open('./databases/modifiers_repeated.json', 'rt', encoding="utf-8") as f:
        db = json.loads(f.read())
    
    data2 = {}

    for k,vals in db.items():
        fromTplBody, fromParams = parseTemplate(k)
        if fromTplBody in data or fromTplBody in data2:
            print(f"repeated template body: {k}")

        formattedVals = []
        for val in vals:
            v = val["v"]
            ctx = None
            if "ctx" in val:
                ctx = val["ctx"]

            toTplBody, toParams = parseTemplate(v)

            formattedVals.append({"fromParams": fromParams, "toTplBody": toTplBody, "toParams": toParams, "ctx": ctx})
        
        data2[fromTplBody] = formattedVals

    save_dict_as_javascript('./modifiers-repeated.js',
                            data2, 'repeatedModifiers')


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

# jewels.js


def generate_jewels():
    data = {}

    with open('./databases/jewels.json', 'rt', encoding="utf-8") as f:
        db = json.loads(f.read())

        for k, v in db.items():
            data[k] = v

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
