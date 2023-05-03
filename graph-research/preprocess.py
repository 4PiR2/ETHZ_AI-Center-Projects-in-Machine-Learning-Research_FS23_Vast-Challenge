# Preprocess MC1.json

import json
import random

# Load the JSON file
with open('data/MC1.json', 'r') as f:
    data = json.load(f)

# Replace node IDs, sources, and targets named "Oceanfront Oasis Inc Carrie"
for node in data['nodes']:
    if node['id'] == 'Oceanfront Oasis Inc Carrie':
        node['id'] = 'Oceanfront Oasis Inc Carriers'

for link in data['links']:
    if link['source'] == 'Oceanfront Oasis Inc Carrie':
        link['source'] = 'Oceanfront Oasis Inc Carriers'
    if link['target'] == 'Oceanfront Oasis Inc Carrie':
        link['target'] = 'Oceanfront Oasis Inc Carriers'

# Rename "links" to "edges"
data['edges'] = data.pop('links')

# Replace integer IDs, sources, and targets with strings
for node in data['nodes']:
    node['id'] = str(node['id'])

for link in data['edges']:
    link['source'] = str(link['source'])
    link['target'] = str(link['target'])

# Save the resulting object into a new JSON file
with open('data/MC1_preprocessed.json', 'w') as f:
    json.dump(data, f, indent=2)
    
# Generate a smaller graph by removing a fraction of nodes and their corresponding edges
fraction_to_remove = 0.9  # Remove 90% of nodes and their edges
num_nodes_to_remove = int(len(data['nodes']) * fraction_to_remove)
nodes_to_remove = random.sample(data['nodes'], num_nodes_to_remove)
nodes_to_remove_ids = [n['id'] for n in nodes_to_remove]
edges_to_remove = []
for edge in data['edges']:
    if edge['source'] in nodes_to_remove_ids or edge['target'] in nodes_to_remove_ids:
        edges_to_remove.append(edge)
for node in nodes_to_remove:
    data['nodes'].remove(node)
data['edges'] = [edge for edge in data['edges'] if edge not in edges_to_remove]

# Save the resulting object into a new JSON file
with open(f'data/MC1_processed_fraction={1-fraction_to_remove:.2f}.json', 'w') as f:
    json.dump(data, f, indent=2)