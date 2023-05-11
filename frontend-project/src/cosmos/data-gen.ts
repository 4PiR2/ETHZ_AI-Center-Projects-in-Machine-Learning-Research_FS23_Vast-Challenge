export type Node = {
  id: string;
  x?: number;
  y?: number;
  color?: string;
  label?: string;
};

export type Link = {
  source: string;
  target: string;
};

import * as data from '../data/MC1.json';
let nodes_data = data['nodes'];
let id2uid: { [id: string | number]: number } = {};

let nodes_all: Node[] = [];
let links_all: Link[] = [];

function parse_node_id (node_id: any) {
  if (typeof node_id == 'string') {
    return node_id;
  } else {
    return '#' + node_id;
  }
};

nodes_data.forEach((node) => {
  let uid = id2uid[parse_node_id(node.id)] = Object.keys(id2uid).length;
  nodes_all.push({id: uid.toString(), label: node.id.toString()});
});
let links_data = data['links'];
links_data.forEach((link) => {
  links_all.push({source: id2uid[parse_node_id(link.source)].toString(), target: id2uid[parse_node_id(link.target)].toString()});
});

let nodes_init: Node[] = [{id: links_all[0].source}, {id: links_all[0].target}];
let links_init: Link[] = [links_all[0]];

links_init = links_all;
nodes_init = nodes_all;

// const n = 100;
// const m = 100;
// for (let node = 0; node < n * m; node += 1) {
//   nodes.push({ id: `${node}` });
//   const nextNode = node + 1;
//   const bottomNode = node + n;
//   const nodeLine = Math.floor(node / n);
//   const nextNodeLine = Math.floor(nextNode / n);
//   const bottomNodeLine = Math.floor(bottomNode / n);
//   if (nodeLine === nextNodeLine)
//     links.push({ source: `${node}`, target: `${nextNode}` });
//   if (bottomNodeLine < m)
//     links.push({ source: `${node}`, target: `${bottomNode}` });
// }

export { links_all, nodes_all, links_init, nodes_init };
