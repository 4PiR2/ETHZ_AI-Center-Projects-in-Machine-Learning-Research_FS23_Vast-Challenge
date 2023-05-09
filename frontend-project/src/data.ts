export {nodes, links}
const nodes = [
{ "id": "node1", "comboId": "combo1", "label": "Node 1" },
{ "id": "123", "comboId": "combo1", "label": "Node 2" },
{ "id": "node3", "label": "Node 4" }
];
const links = [
{ "source": "node1", "target": "123",       "type": "ownership",
"weight": 0.90013963,
"dataset": "MC1",
"key": 0 },
{ "source": "123", "target": "node3" }
];
