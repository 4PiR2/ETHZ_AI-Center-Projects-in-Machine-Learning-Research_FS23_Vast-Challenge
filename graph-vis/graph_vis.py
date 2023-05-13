import copy
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


class Node:
    def __init__(self, _uid: int, **nattrs):
        self.uid: int = _uid
        self.nattrs: dict = nattrs
        self.ei: dict[Node, list[Edge]] = {}
        self.eo: dict[Node, list[Edge]] = {}

    def __eq__(self, other):
        if isinstance(other, Node):
            return self.uid == other.uid
        elif isinstance(other, int):
            return self.uid == other
        else:
            return False

    def __hash__(self):
        return hash(self.uid)

    def __repr__(self):
        return repr((self.uid, self.nattrs))


class Edge:
    def __init__(self, _src: Node, _tgt: Node, **eattrs):
        self.src: Node = _src
        self.tgt: Node = _tgt
        self.eattrs: dict = eattrs

    def __repr__(self):
        return repr((self.src.uid, self.tgt.uid))


class G:
    def __init__(self):
        self.nodes: dict[int, Node] = {}
        self.edges: dict[[Node, Node], list[Edge]] = {}

    def add_n(self, *nodes: Node):
        for n in nodes:
            self.nodes[n.uid] = n

    def add_e(self, *edges: Edge):
        for e in edges:
            if (e.src, e.tgt) in self.edges:
                self.edges[e.src, e.tgt].append(e)
            else:
                self.edges[e.src, e.tgt] = [e]
            if e.tgt in e.src.eo:
                e.src.eo[e.tgt].append(e)
            else:
                e.src.eo[e.tgt] = [e]
            if e.src in e.tgt.ei:
                e.tgt.ei[e.src].append(e)
            else:
                e.tgt.ei[e.src] = [e]

    def to_df(self) -> [pd.DataFrame, pd.DataFrame]:
        nodes = pd.DataFrame.from_dict([n.nattrs for n in self.nodes.values()])
        edges = pd.DataFrame.from_dict([e.eattrs for el in self.edges.values() for e in el])
        return nodes, edges

    def to_nx(self) -> nx.Graph:
        g = nx.MultiDiGraph()
        for n in self.nodes.keys():
            g.add_nodes_from([(n, )])
        for (s, t), el in self.edges.items():
            for e in el:
                g.add_edges_from([(s.uid, t.uid, {'weight': e.eattrs['weight']})], )
        return g

    def sub_graph(self, uids: list[int] = None):
        if uids is None:
            uids = self.nodes.keys()
        g = G()
        for n in self.nodes.values():
            if n.uid in uids:
                g.add_n(Node(n.uid, **n.nattrs))
        for (s, t), el in self.edges.items():
            if s.uid in uids and t.uid in uids:
                for e in el:
                    g.add_e(Edge(g.nodes[s.uid], g.nodes[t.uid], **e.eattrs))
        return g

    def bfs(self, start_uid: int, n_layers: int = -1, flatten: bool = True) -> list:
        visited = torch.zeros(len(self.nodes), dtype=torch.bool)
        results = [[]]
        queue = [start_uid, -1]
        while queue and n_layers != 0:
            m = queue.pop(0)
            if m < 0:
                n_layers -= 1
                results.append([])
                queue.append(-1)
                continue
            if visited[m]:
                continue
            visited[m] = True
            results[-1].append(m)
            queue += [node.uid for node in self.nodes[m].eo.keys()] + [node.uid for node in self.nodes[m].ei.keys()]
        if flatten:
            return list(visited.nonzero())
        else:
            return results

    def get_adjacency_mat(self, weighted: bool = False) -> torch.Tensor:
        mat = nx.adjacency_matrix(self.to_nx(), nodelist=self.nodes.keys(), weight='weight' if weighted else None)
        return torch.tensor(mat.todense())

    def connected_components(self) -> list[list]:
        return sorted(nx.connected_components(self.to_nx().to_undirected(as_view=True)), key=len, reverse=True)

    def to_vis(self, html_path: str, weight: torch.Tensor = None):
        g = nx.MultiDiGraph()
        if weight is None:
            weight_mat = self.get_adjacency_mat(True)
            weight = weight_mat.sum(0) + weight_mat.sum(1)
        for i, (uid, node) in enumerate(self.nodes.items()):
            n = node.nattrs
            properties = {
                'label': (f"[{n['type'][:2].upper()}] " if n['type'] else '') + f"{n['id']}" + (
                    f" ({n['country']})" if n['country'] else ''),
                'color': 'red' if n['*'] else '#0000ff77',
                'size': float(weight[i] ** .5),
                **copy.deepcopy(n),
            }
            g.add_nodes_from([(uid, properties), ])
        for (s, t), el in self.edges.items():
            for e in el:
                properties = {
                    'color': f"{plot_colors_0[e.eattrs['etid']]}77",
                    'title': f"[{self.nodes[s.uid].nattrs['id']}] {e.eattrs['type']} [{self.nodes[t.uid].nattrs['id']}]",
                    # 'label': str(e.eattrs['key']),
                    **copy.deepcopy(e.eattrs)
                }
                del properties['source'], properties['target']
                g.add_edges_from([(s.uid, t.uid, properties)], )
        # nx.draw(g)
        # plt.show()
        net = Network(height='1500px', width='1500px', directed=True, notebook=True)
        net.from_nx(g)
        net.repulsion()
        # net.toggle_physics(False)
        if html_path:
            net.show(html_path)


def load_mc1(json_path: str) -> G:
    entities = ['FishEye International', 'Mar de la Vida OJSC', 979893388, 'Oceanfront Oasis Inc Carriers', 8327]
    # entities = ['FishEye International', 'Mar de la Vida OJSC', 'Oceanfront Oasis Inc Carriers', 8327]

    with open(json_path, 'r') as f:
        data = json.load(f)

    ntypes = sorted([
        '', 'company', 'event', 'location', 'movement', 'organization', 'person', 'political_organization', 'vessel',
    ])
    ntids = {t: i for i, t in enumerate(ntypes)}
    nodes = data['nodes']
    countries = sorted([''] + list(set([node['country'] for node in nodes if 'country' in node])))
    cids = {t: i for i, t in enumerate(countries)}
    nid2uid = {}
    for node in nodes:
        # country, dataset, id, type | cid, ntid, uid, *
        for k in ['country', 'type']:
            if k not in node:
                node[k] = ''
        node['uid'] = nid2uid[node['id']] = len(nid2uid)
        node['ntid'] = ntids[node['type']]
        node['cid'] = cids[node['country']]
        node['*'] = False
    for entity in entities:
        nodes[nid2uid[entity]]['*'] = True

    etypes = sorted([
        '', 'family_relationship', 'membership', 'ownership', 'partnership',
    ])
    etids = {t: i for i, t in enumerate(etypes)}
    edges = {}
    for edge in data['links']:
        # dataset, key, source, target, type, weight | srcid, tgtid, etid
        key = edge['src_uid'], edge['tgt_uid'] = nid2uid[edge['source']], nid2uid[edge['target']]
        edge['etid'] = etids[edge['type']]
        if key in edges:
            edges[key].append(edge)
        else:
            edges[key] = [edge]

    g = G()
    for n in nodes:
        g.add_n(Node(n['uid'], **n))
    for el in edges.values():
        for e in el:
            g.add_e(Edge(g.nodes[e['src_uid']], g.nodes[e['tgt_uid']], **e))
    return g


def vis_top(k: int = 50):
    g = load_mc1('../data/MC1.json')
    weight_matrix = g.get_adjacency_mat(True)
    weight_in, weight_out = weight_matrix.sum(0), weight_matrix.sum(1)
    weight = weight_in + weight_out
    weight_order = weight.argsort(descending=True).argsort()
    mask_weight = weight_order < k
    h = g.sub_graph(mask_weight.nonzero())
    h.to_vis(f'top_{k}.html', weight[mask_weight])


def vis_bfs(k: int = 2):
    g = load_mc1('../data/MC1.json')
    weight_matrix = g.get_adjacency_mat(True)
    weight_in, weight_out = weight_matrix.sum(0), weight_matrix.sum(1)
    weight = weight_in + weight_out
    weight_order = weight.argsort(descending=True).argsort()
    nodes_df, _ = g.to_df()
    bfs_results = []
    for entity in nodes_df[nodes_df['*']]['uid'].values:
        if weight_order[entity] < 50:
            continue
        bfs_results += g.bfs(start_uid=entity, n_layers=2)
    bfs_results.sort()
    h = g.sub_graph(bfs_results)
    h.to_vis(f'bfs_{k}.html', weight[bfs_results])


def vis_outliers():
    g = load_mc1('../data/MC1.json')
    components_id = g.connected_components()
    outliers = []
    for i in range(1, len(components_id)):
        outliers += components_id[i]
    g = g.sub_graph(outliers)
    g.to_vis('outliers.html')


def main():
    g = load_mc1('../data/MC1.json')
    components_id = g.connected_components()
    outliers = []
    for i in range(1, len(components_id)):
        outliers += components_id[i]
    g0 = g.sub_graph(components_id[0])
    g1 = g.sub_graph(outliers)
    adj_mat_0 = g0.get_adjacency_mat(False)
    adj_mat_1 = g1.get_adjacency_mat(False)
    plt.imsave('main_cluster.png', adj_mat_0.bool().numpy())
    plt.imsave('outliers.png', adj_mat_1.bool().numpy())


if __name__ == '__main__':
    main()
