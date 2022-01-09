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
                nodes_dict[id] = value
    return nodes_dict


if __name__ == "__main__":
    tree_cn_file = "tree_3.16_CN"
    tree_en_file = "tree_3.16_EN"

    cn_nodes = get_nodes(tree_cn_file)
    en_nodes = get_nodes(tree_en_file)

    # 检查重复项
    cn_names = {}
    for id, value in cn_nodes.items():
        cn_name = value["name"]
        if cn_name in cn_names:
            cn_names[cn_name].append(id)
        else:
            cn_names[cn_name] = [id]

    with open('../formulable_nodes.json', 'wt', encoding='utf-8') as f:
        f.write('{\n')

        for k, ids in cn_names.items():
            if len(ids) == 1:
                f.write(f'"{k}":"{en_nodes[ids[0]]["name"]}",\n')
        f.write('}')

    with open('../formulable_nodes_repeated.json', 'wt', encoding='utf-8') as f:
        f.write('{\n')

        props = []
        for k, ids in cn_names.items():
            if len(ids) > 1:
                prop = f'"{k}":['

                buf = []
                for id in ids:
                    name = en_nodes[id]["name"]
                    stats = cn_nodes[id]["stats"]
                    stats_in_json = ",".join([f'"{x}"' for x in stats])
                    buf.append(f'{{"v":"{name}","stats":[{stats_in_json}]}}')
                prop = prop + ",".join(buf)

                prop = prop + ']'

                props.append(prop)

        f.write(",\n".join(props))
        f.write('}')
