import json
import os
import networkx as nx
from networkx.readwrite import json_graph
import community as community_louvain
import matplotlib.pyplot as plt

MC1_path = "/home/lukas/eth/ai_center/MC1"

# Load the JSON file
with open(os.path.join(MC1_path, "V1/MC1.json"), 'r') as f:
    json_data = json.load(f)

# Convert the JSON data to a networkx graph
graph = json_graph.node_link_graph(json_data)
undirected_graph = graph.to_undirected()


# Compute the best partition using the Louvain method
partition = community_louvain.best_partition(undirected_graph)

# Add the community information as a node attribute
for node, community_id in partition.items():
    graph.nodes[node]['community'] = community_id

# Entities of interest
entities_of_interest = ['Mar de la Vida OJSC', '979893388', 'Oceanfront Oasis Inc Carrie', '8327']

# Find the communities of the entities of interest
communities_of_interest = set()
for entity in entities_of_interest:
    if entity in graph.nodes:
        community_id = graph.nodes[entity]['community']
        communities_of_interest.add(community_id)
        print(f"{entity} belongs to community {community_id}")

# Create a subgraph containing only the nodes from the communities of interest
nodes_of_interest = [node for node, attrs in graph.nodes(data=True) if attrs['community'] in communities_of_interest]
subgraph = graph.subgraph(nodes_of_interest)

from pyvis.network import Network

# Create a PyVis network
net = Network(height='800px', width='100%', bgcolor='#FFFFFF', font_color='black', notebook=True)

# Add nodes and edges to the network
for node, attrs in subgraph.nodes(data=True):
    community_id = attrs['community']
    try:
        node_type = attrs['type']
    except:
        node_type = "None"
    label = f"{node} ({node_type})" if 'type' in attrs else node
    title = f"Node Type: {node_type}<br>Community: {community_id}"
    color = f"rgba({community_id * 30 % 256}, {(community_id * 50) % 256}, {(community_id * 70) % 256}, 0.8)"
    size = 10 if node not in entities_of_interest else 20
    net.add_node(node, label=label, title=title, color=color, size=size)

for source, target, attrs in subgraph.edges(data=True):
    edge_type = attrs['type']
    label = edge_type
    net.add_edge(source, target, label=label, title=edge_type)

# Centrality measures
degree_centrality = nx.degree_centrality(subgraph)
betweenness_centrality = nx.betweenness_centrality(subgraph)
closeness_centrality = nx.closeness_centrality(subgraph)

# Add centrality measures to node titles
for node in subgraph.nodes:
    title = net.get_node(node)['title']
    title += f"<br>Degree Centrality: {degree_centrality[node]:.2f}"
    title += f"<br>Betweenness Centrality: {betweenness_centrality[node]:.2f}"
    title += f"<br>Closeness Centrality: {closeness_centrality[node]:.2f}"
    net.get_node(node).update({'title': title})

# Toggle button to hide node and edge labels
net.show_buttons(filter_=['nodes', 'edges', 'interaction'])

# Display the network
net.show("graph.html")

