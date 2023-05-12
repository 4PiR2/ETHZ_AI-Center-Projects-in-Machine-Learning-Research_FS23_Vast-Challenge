import json

from matplotlib import pyplot as plt
import networkx as nx
import pandas as pd
from pyvis.network import Network
import torch


plot_colors_0 = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
]
plot_colors_1 = [
    '#000000', '#ff0000', '#ffff00', '#777777', '#7f7f00', '#00ff00', '#0000ff', '#007f00', '#7f0000',
]


def load_mc1(json_path: str):
    entities = ['FishEye International', 'Mar de la Vida OJSC', 979893388, 'Oceanfront Oasis Inc Carriers', 8327]
    # entities = ['FishEye International', 'Mar de la Vida OJSC', 'Oceanfront Oasis Inc Carriers', 8327]

    with open(json_path, 'r') as f:
        data = json.load(f)

    node_types = sorted([
        '', 'company', 'event', 'location', 'movement', 'organization', 'person', 'political_organization', 'vessel',
    ])
    node_types_id = {t: i for i, t in enumerate(node_types)}
    nodes = data['nodes']
    countries = sorted([''] + list(set([node['country'] for node in nodes if 'country' in node])))
    countries_id = {t: i for i, t in enumerate(countries)}
    node_id_2_uid = {}
    for node in nodes:
        # country, dataset, id, type | country_id, type_id, uid, *
        for k in ['country', 'type']:
            if k not in node:
                node[k] = ''
        node['uid'] = node_id_2_uid[node['id']] = len(node_id_2_uid)
        node['type_id'] = node_types_id[node['type']]
        node['country_id'] = countries_id[node['country']]
        node['*'] = False
    for entity in entities:
        nodes[node_id_2_uid[entity]]['*'] = True

    edge_types = sorted([
        '', 'family_relationship', 'membership', 'ownership', 'partnership',
    ])
    edge_types_id = {t: i for i, t in enumerate(edge_types)}
    edges = {}
    for edge in data['links']:
        # dataset, key, source, target, type, weight | src_id, tgt_id, type_id
        key = edge['src_id'], edge['tgt_id'] = node_id_2_uid[edge['source']], node_id_2_uid[edge['target']]
        edge['type_id'] = edge_types_id[edge['type']]
        if key in edges:
            edges[key].append(edge)
        else:
            edges[key] = [edge]
    return nodes, edges


def to_graphin(ns: list[dict], es: dict[int, list[dict]], mask=None, weight=None, json_path: str = None):
    nodes = []
    for i, n in enumerate(ns):
        if mask is not None and not mask[i]:
            continue
        node = {'id': str(n['uid'])}
        label = {
            'value': f"{n['id']} ({n['country']})" if n['country'] else f"{n['id']}",
            "fill": '#ff0000' if n['*'] else '#000000',
            # "position": 'right',
            # "offset": [20, 5],
        }
        keyshape = {
            'size': float(weight[i] ** .5) if weight is not None else 10.,
            'stroke': plot_colors_1[n['type_id']],
            'fill': plot_colors_1[n['type_id']],
            'fillOpacity': .2,
        }
        node['style'] = {'label': label, 'keyshape': keyshape}
        nodes.append(node)

    edges = []
    for i, ((s, t), el) in enumerate(es.items()):
        if mask is not None and not (mask[s] and mask[t]):
            continue
        for e in el:
            edge = {'source': str(s), 'target': str(t)}
            label = {
                # 'value': e['key'],  # 0, 1, 2, ..., 21
            }
            keyshape = {
                'stroke': plot_colors_0[e['type_id']],
                'lineWidth': e['weight'],
                'opacity': .2,
            }
            edge['style'] = {'label': label, 'keyshape': keyshape}
            edges.append(edge)

    root = {'nodes': nodes, 'edges': edges, 'combos': []}
    if json_path:
        with open(json_path, 'w') as f:
            json.dump(root, f, indent=2)
    return root


def nx_vis(ns: list[dict], es: dict[int, list[dict]], mask=None, weight=None, html_path: str = None):
    G = nx.MultiDiGraph()
    for i, n in enumerate(ns):
        if mask is not None and not mask[i]:
            continue
        n['label'] = (f"[{n['type'][:2].upper()}] " if n['type'] else '') + f"{n['id']}" + (f" ({n['country']})" if n['country'] else '')
        n['color'] = 'red' if n['*'] else '#0000ff77'
        n['size'] = float(weight[i] ** .5) if weight is not None else 1.
        G.add_nodes_from([(i, n),])
    for i, ((s, t), el) in enumerate(es.items()):
        if mask is not None and not (mask[s] and mask[t]):
            continue
        for e in el:
            del e['source'], e['target']
            e['color'] = f"{plot_colors_0[e['type_id']]}77"
            e['title'] = f"[{ns[s]['id']}] {e['type']} [{ns[t]['id']}]"
            # e['label'] = str(e['key'])
            G.add_edges_from([(s, t, e),])
    # nx.draw(G)
    # plt.show()
    net = Network(height='1500px', width='1500px', directed=True, notebook=True)
    net.repulsion()
    # net.toggle_physics(False)
    net.from_nx(G)
    if html_path:
        net.show(html_path)


def bfs(edges_df: pd.DataFrame, visited, start_uid: int, n_layers: int = -1):
    queue = [start_uid, -1]
    while queue and n_layers != 0:
        m = queue.pop(0)
        if m < 0:
            n_layers -= 1
            queue.append(-1)
            continue
        if visited[m]:
            continue
        visited[m] = True
        queue.extend(edges_df[edges_df['src_id'] == m]['tgt_id'].values)
        queue.extend(edges_df[edges_df['tgt_id'] == m]['src_id'].values)


def main():
    nodes, edges = load_mc1('../data/MC1.json')
    nodes_df = pd.DataFrame.from_dict(nodes)
    edges_df = pd.DataFrame.from_dict([e for el in edges.values() for e in el])

    mask_bfs = torch.zeros(len(nodes_df), dtype=torch.bool)
    for entity in nodes_df[nodes_df['*']]['uid'].values:
        mask_tmp = torch.zeros_like(mask_bfs)
        bfs(edges_df, mask_tmp, start_uid=entity, n_layers=2)
        mask_bfs |= mask_tmp

    adjacency_matrix = torch.empty(len(nodes), len(nodes), dtype=torch.int)
    weight_matrix = torch.zeros(len(nodes), len(nodes))
    for (src, tgt), el in edges.items():
        adjacency_matrix[src, tgt] = len(el)
        for e in el:
            weight_matrix[src, tgt] += e['weight']
    degree_in, degree_out = weight_matrix.sum(0), weight_matrix.sum(1)
    degree = degree_in + degree_out
    weight_in, weight_out = weight_matrix.sum(0), weight_matrix.sum(1)
    weight = weight_in + weight_out
    weight_order = weight.argsort(descending=True).argsort()
    mask_weight = weight_order < 50

    nx_vis(nodes, edges, mask_weight, weight, '../graph-vis/top.html')
    # nx_vis(nodes, edges, mask_bfs, weight, '../graph-vis/bfs2.html')
    # to_graphin(nodes, edges, mask_bfs, weight, '../frontend-project/src/data/MC1_c.json')


if __name__ == '__main__':
    main()
