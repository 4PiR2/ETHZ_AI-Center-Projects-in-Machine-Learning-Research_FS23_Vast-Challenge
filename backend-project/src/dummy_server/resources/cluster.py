import networkx as nx
from networkx.readwrite import json_graph
from community import community_louvain
from networkx.algorithms import community
import numpy as np
from sklearn.cluster import KMeans
import umap

def embed_and_cluster(graph_dict, n_components=3, n_clusters=3):
    G = json_graph.node_link_graph(graph_dict)
    adjacency_matrix = nx.adjacency_matrix(G).toarray()
    
    embedding = umap.UMAP(n_components=n_components).fit_transform(adjacency_matrix)
    labels = KMeans(n_clusters=n_clusters).fit_predict(embedding)
    
    node_labels = {list(G.nodes)[i]: int(label) for i, label in enumerate(labels)}
    return node_labels

def compute_subgraph(graph_dict, nodes, method='louvain'):
    G = json_graph.node_link_graph(graph_dict)
    if method == 'louvain':
        partition = community_louvain.best_partition(G.to_undirected())
    elif method == 'girvan_newman':
        gn_communities = community.girvan_newman(G.to_undirected())
        partition = {node: cid for cid, community in enumerate(gn_communities) for node in community}
    else:
        raise ValueError(f"Unknown method: {method}")

    # Extract community ids of given nodes
    community_ids = {partition[node] for node in nodes if node in partition}
    subgraph_nodes = {node for node, community_id in partition.items() if community_id in community_ids}
    subgraph = G.subgraph(subgraph_nodes)

    return json_graph.node_link_data(subgraph)

def calculate_centrality(graph_dict, method='degree'):
    G = json_graph.node_link_graph(graph_dict)
    if method == 'degree':
        centrality = nx.degree_centrality(G)
    elif method == 'betweenness':
        centrality = nx.betweenness_centrality(G)
    elif method == 'closeness':
        centrality = nx.closeness_centrality(G)
    elif method == 'eigenvector':
        centrality = nx.eigenvector_centrality(G)
    else:
        raise ValueError(f"Unknown method: {method}")
    return centrality

