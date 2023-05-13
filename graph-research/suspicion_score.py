import networkx as nx
import re
from collections import defaultdict
from networkx.readwrite import json_graph
import json

## Load the graph
# Load the JSON file
with open("data/MC1.json", 'r') as f:
    json_data = json.load(f)

# Convert the JSON data to a networkx graph
graph = json_graph.node_link_graph(json_data)

def to_lowercase(node):
    name = ''.join(c for c in str(node) if c.isascii())
    return name.lower()

# Rename nodes to only include lowercase ascii characters
graph = nx.relabel_nodes(graph, to_lowercase)

## Print the info found in the graph
types = set()
countries = set()
for k, v in graph.nodes.items():
    if "type" in v:
        types.add(v['type'])
    if "country" in v:
        countries.add(v['country'])
print(types)
print(countries)

types = set()
for k, v in graph.edges.items():
    if "type" in v:
        types.add(v['type'])
print(types)

## Calculate suspicious score

def calculate_country_suspicion_score(illegal_nodes, graph):
    """
    Calculate the suspicion score for each country based on the number of illegal nodes it has.

    Parameters:
    illegal_nodes (list): A list of illegal node IDs.
    graph (networkx.Graph): The graph containing all nodes and edges.

    Returns:
    dict: A dictionary with country as key and suspicion score as value.

    Design Choices:
    - The suspicion score for a country is calculated as the proportion of illegal nodes in that country,
      normalized by the maximum number of illegal nodes in any country.
    """
    country_counts = defaultdict(int)
    for node in illegal_nodes:
        if "country" in graph.nodes[node]:
            country = graph.nodes[node]["country"]
            country_counts[country] += 1
    max_count = 1
    if len(country_counts.values()) > 0:
        max_count = max(country_counts.values())
    return {country: count / max_count for country, count in country_counts.items()}

def calculate_suspicion_score(graph, illegal_nodes, user_flags, country_suspicion_score, depth=2):
    """
    Calculate the suspicion score for each node in the graph based on illegal nodes, user flags, and country suspicion scores.

    Parameters:
    graph (networkx.Graph): The graph containing all nodes and edges.
    illegal_nodes (list): A list of illegal node IDs.
    user_flags (list): A list of user-flagged node IDs.
    country_suspicion_score (dict): A dictionary with country as key and suspicion score as value.
    depth (int, optional): The depth up to which the suspiciousness of illegal nodes propagates. Defaults to 2.

    Returns:
    dict: A dictionary with node ID as key and suspicion score as value.

    Design Choices:
    - The suspicion score calculation is based on the edge type, weight, and depth.
    - The score is reduced by half with each increasing depth.
    - Node and edge attributes are checked for missing data using the get method with default values.
    - Node types and edge types have their own weights which can be adjusted easily.
    - User-flagged nodes are given an additional boost of 1.2 times their calculated score.
    - The final score is multiplied by (1 + country_suspicion_score) if the node's country has a suspicion score.
    - The score is capped at a maximum of 1.
    """
    scores = {node: 0 for node in graph.nodes()}

    # Initialize illegal nodes with a base suspicion score
    for illegal_node in illegal_nodes:
        scores[illegal_node] = 10


    edge_type_weights = {"ownership": 2, "partnership": 2, "membership": 1, "family_relationship": 1}
    node_type_weights = {"vessel": 1.5, "organization": 1.5, "company": 1.5, "person": 1,
                         "political_organization": 1, "movement": 1, "event": 1, "location": 1}

    # Calculate suspiciousness scores based on edge type, weight, and depth
    for illegal_node in illegal_nodes:
        nodes_at_current_depth = {illegal_node}
        depth_factor = 1
        for _ in range(depth):
            neighbors = set()
            for node in nodes_at_current_depth:
                for neighbor in graph.neighbors(node):
                    edge = graph[node][neighbor]
                    edge_type = edge.get("type", "membership")
                    edge_weight = edge.get("weight", 1)
                    scores[neighbor] += edge_type_weights[edge_type] * edge_weight * depth_factor
                    neighbors.add(neighbor)
            nodes_at_current_depth = neighbors
            depth_factor *= 0.5

    max_score = max(scores.values())
    for node, score in scores.items():
        node_attr = graph.nodes[node]
        node_type = node_attr.get("type", "person")
        country = node_attr.get("country", "")

        normalized_score = score / max_score
        normalized_score *= node_type_weights[node_type]
        if node in user_flags:
            normalized_score *= 1.2
        if country in country_suspicion_score:
            normalized_score *= (1 + country_suspicion_score[country])

        scores[node] = min(normalized_score, 1)

    return scores

illegal_nodes = ['armed robbery', 'game thief', 'illegal', 'shabu', 'shark fin', 'illegal', 'deepwater horizon', 'cartel emergent weaponry use', 'dark web vendor illegal narcotics', 'heroin cocaine exchange bitcoin', 'officer pleads guilty', 'bribes exchange smuggling contraband']

user_flags = ["leo", "yeezy", "blue bay"]

# Turns out no illegal nodes has a country assignment
country_suspicion_score = calculate_country_suspicion_score(illegal_nodes, graph)
suspicion_scores = calculate_suspicion_score(graph, illegal_nodes, user_flags, country_suspicion_score, depth=5)

## Print sorted scores
sorted_scores = dict(sorted(suspicion_scores.items(), key=lambda item: -item[1]))

for i, (k, v) in enumerate(sorted_scores.items()):
    if i > 30:
        break
    print(k, v)

## Scores of entities to investigate 
entities_to_investigate = ['Mar de la Vida OJSC', 979893388, 'Oceanfront Oasis Inc Carriers', 8327]

for entity in entities_to_investigate:
    entity = to_lowercase(entity)
    print(entity, suspicion_scores[entity])
