import sqlite3
import json


def chooseTheMaxUppersCountOne(str1, str2):
    count1 = 0
    for c in str1:
        if c >= 'A' and c <= 'Z':
            count1 += 1

    count2 = 0
    for c in str2:
        if c >= 'A' and c <= 'Z':
            count2 += 1

    if count1 > count2:
        return str1
    else:
        return str2

# 一些装备无关词缀，或者无法找到来源而且重复的词缀
def shouldBeSkipped(k):
    return k.startswith('<enchanted>') or \
        k.startswith('稀有天灾怪物额外掉落') or \
        k.startswith('虚空忆境的') or \
        k.startswith('稀有裂隙怪物额外掉落') or \
        k.startswith('区域内会出现额外') or \
        k.startswith('从能量护盾偷取中获得的最大能量护盾') or\
        k.startswith('怪物')\

if __name__ == "__main__":
    # read poecharm db
    con = sqlite3.connect('resources.db')
    cur = con.cursor()
    rows = cur.execute(
        'select v,k from translate_cn where source="statDescriptions"').fetchall()
    con.close()

    rows = list(rows)

    # read patchs
    additions = {}
    with open('modifiers_additions.json', 'rt', encoding='utf-8') as f:
        content = f.read()
        additions = json.loads(content)
    removals = {}
    with open('modifiers_removals.json', 'rt', encoding='utf-8') as f:
        content = f.read()
        removals = json.loads(content)
    removals = set(removals)
    updates = {}
    with open('modifiers_updates.json', 'rt', encoding='utf-8') as f:
        content = f.read()
        updates = json.loads(content)

    # 检查重复词缀
    modifiers = {}
    repeats = set()
    # 将重复项写入格式化数据文件，以便后续处理
    with open('repeated_modifiers.json', 'wt', encoding='utf-8') as f:
        f.write('{\n')
        
        for r in rows:
            k = r[0]
            v = r[1]
            if shouldBeSkipped(k):
                continue

            if k in removals or k in updates:
                continue

            if k in modifiers:
                # 重复类型：特定单词大小写的不同，比如：
                #   军帽：Socketed Gems are Supported by Level {0} Increased Critical Damage
                #   其它：Socketed Gems are supported by Level {0} Increased Critical Damage
                # 目前不知道这是否对POB造成影响，但要区分它们确实需要太多的工作量，因此统一使用大写版本。
                if v.lower() == modifiers[k].lower():
                    modifiers[k] = chooseTheMaxUppersCountOne(v, modifiers[k])
                    continue

                f.write(f'"{k}":"{v}",\n')
                f.write(f'"{k}":"{modifiers[k]}",\n')

                repeats.add(k)
            modifiers[k] = v
        f.write('}')

    # 移除未处理的重复项，这样可以及时发现问题
    for k in repeats:
        del modifiers[k]
    
    # apply patchs
    for k in removals:
        if k in modifiers:
            del modifiers[k]
    for k,v in updates.items():
        modifiers[k] = v
    for k,v in additions.items():
        modifiers[k] = v
    
    con = sqlite3.connect('translations.db')
    cur = con.cursor()
    for k,v in modifiers.items():
        cur.execute(f'INSERT INTO "modifier" ("k", "v") VALUES ("{k}","{v}")')
    
    con.commit()
    con.close()
