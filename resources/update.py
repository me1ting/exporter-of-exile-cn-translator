from re import finditer
import sqlite3
import json

log_file = './should_be_translated.txt'


def update_properties_from_log():
    try:
        with open(log_file, 'rt', encoding='utf-8') as f:
            for line in f:
                split_res = line.split(',', 1)
                if len(split_res) < 2:
                    continue

                type, content = split_res[0].strip(), split_res[1].strip()
                if type != 'property':
                    continue

                if is_property_exist(content):
                    continue

                try_res = try_to_translate_using_poecharm(content)
                if try_res != None:
                    add_property(content, try_res)
                    continue
                print('property should be translated: ', content)
    except FileNotFoundError:
        pass


def is_property_exist(str):
    con = sqlite3.connect('patch.db')
    cur = con.cursor()
    row = cur.execute(
        f'select count(*) from property where k="{str}"').fetchone()
    con.close()

    return row[0] != 0


def add_property(cn, en):
    con = sqlite3.connect('patch.db')
    cur = con.cursor()
    cur.execute(
        f'insert into property values ("{cn}","{en}")')
    con.commit()
    con.close()


def try_to_translate_using_poecharm(str):
    con = sqlite3.connect('resources.db')
    cur = con.cursor()
    row = cur.execute(
        f'select k,v from translate_cn where v="{str}"').fetchone()
    if row != None:
        con.close()
        return row[0]

    suffix = ':'
    keyword = str+suffix
    row = cur.execute(
        f'select k,v from translate_cn where v="{keyword}"').fetchone()
    if row != None:
        con.close()
        v = row[0]
        return v[:len(v)-len(suffix)]

    preffix = '^x7F7F7F'
    suffix = ': '
    keyword = preffix+str+suffix
    row = cur.execute(
        f'select k,v from translate_cn where v="{keyword}"').fetchone()
    if row != None:
        con.close()
        v = row[0]
        return v[len(preffix):len(v)-len(suffix)]

    con.close()


def update_requirements_from_log():
    try:
        with open(log_file, 'rt', encoding='utf-8') as f:
            for line in f:
                split_res = line.split(',', 1)
                if len(split_res) < 2:
                    continue

                type, content = split_res[0].strip(), split_res[1].strip()
                if type != 'requirement':
                    continue

                if is_requirement_exist(content):
                    continue

                try_res = try_to_translate_using_poecharm(content)
                if try_res != None:
                    add_requirement(content, try_res)
                    continue
                print('requirement should be translated: ', content)
    except FileNotFoundError:
        pass


def is_requirement_exist(str):
    con = sqlite3.connect('patch.db')
    cur = con.cursor()
    row = cur.execute(
        f'select count(*) from requirement where k="{str}"').fetchone()
    con.close()

    return row[0] != 0


def add_requirement(cn, en):
    con = sqlite3.connect('patch.db')
    cur = con.cursor()
    cur.execute(
        f'insert into requirement values ("{cn}","{en}")')
    con.commit()
    con.close()

def update_gem_properties_from_log():
    try:
        with open(log_file, 'rt', encoding='utf-8') as f:
            for line in f:
                split_res = line.split(',', 1)
                if len(split_res) < 2:
                    continue

                type, content = split_res[0].strip(), split_res[1].strip()
                if type != 'gemProperty':
                    continue

                if is_gem_property_exist(content):
                    continue

                try_res = try_to_translate_using_poecharm(content)
                if try_res != None:
                    add_gem_property(content, try_res)
                    continue
                print('gem property should be translated: ', content)
    except FileNotFoundError:
        pass


def is_gem_property_exist(str):
    con = sqlite3.connect('patch.db')
    cur = con.cursor()
    row = cur.execute(
        f'select count(*) from gem_property where k="{str}"').fetchone()
    con.close()

    return row[0] != 0


def add_gem_property(cn, en):
    con = sqlite3.connect('patch.db')
    cur = con.cursor()
    cur.execute(
        f"insert into gem_property values ('{cn}','{en}')")
    con.commit()
    con.close()
