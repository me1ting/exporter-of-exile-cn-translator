import sqlite3
import json

def get_nodes(file):
    nodes_dict = {}
    with open(file, 'rt', encoding='utf-8') as f:
        content = f.read()
        data = json.loads(content)
        nodes = data['nodes']
        for key, value in nodes.items():
            id = key
            if 'name' not in value:
                continue
            name = value['name']
            if 'recipe' in value:
                nodes_dict[id] = name
    return nodes_dict
                
if __name__ == "__main__":
    tree_cn_file = "tree_3.16_CN"
    tree_en_file = "tree_3.16_EN"

    cn_nodes = get_nodes(tree_cn_file)
    en_nodes = get_nodes(tree_en_file)

    # 检查重复项
    cn_names = {}
    for id,cn_name in  cn_nodes.items():
        if cn_name in cn_names:
            print("repeated formulable_node: ",cn_name,en_nodes[id],en_nodes[cn_names[cn_name]])
        cn_names[cn_name] = id

    con = sqlite3.connect('translations.db')
    cur = con.cursor()
    for id,k in cn_nodes.items():
        v = en_nodes[id]
        cur.execute(f'INSERT INTO "formulable_node" ("k", "v") VALUES ("{k}","{v}")')
    
    con.commit()
    con.close()

