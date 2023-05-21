import json

def load_graph(file_path):
    with open(file_path, 'r') as f:
        json_data = json.load(f)
    json_data['links'] = json_data.pop('edges')
    return json_data

def load_json(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)

def get_graph():
    return load_graph("data/MC1_preprocessed.json")

def get_illegal_nodes():
    return load_json("data/illegal_ids.json")

def get_user_flags():
    return load_json("data/user_flag_ids.json")
