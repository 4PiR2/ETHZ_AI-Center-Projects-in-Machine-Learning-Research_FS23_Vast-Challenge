export type Node = {
  id: string;
  name: string;
  ntid: number;
  cid: number;
  x?: number;
  y?: number;
  size?: number;
  nsuspicious?: number;
  degree_in?: number;
  degree_out?: number;
  weight_in?: number;
  weight_out?: number;
  label?: string;
};

export type Link = {
  source: string;
  target: string;
  weight: number;
  etid: number;
  esuspicious?: number;
  label?: string;
};

import * as data from '../data/MC1.json';

let suspicious_entities = ['FishEye International', 'Mar de la Vida OJSC', 979893388, 'Oceanfront Oasis Inc Carriers', 8327];

const node_types = ['', 'company', 'event', 'location', 'movement', 'organization', 'person', 'political_organization', 'vessel'].sort();
const edge_types = ['', 'family_relationship', 'membership', 'ownership', 'partnership'].sort();

let nodes_all: Node[] = [];
let links_all: Link[] = [];

function create_reverse_index (str_list: string[]) {
  let reverse_index: { [id: string]: number } = {};
  str_list.forEach((s) => {
    reverse_index[s] = Object.keys(reverse_index).length;
  });
  return reverse_index;
}

const ntype2ntid = create_reverse_index(node_types);
const etype2etid = create_reverse_index(edge_types);

const nodes_data = data['nodes'];
let countries_list : string[] = [];
nodes_data.forEach((node) => {
  countries_list.push(node.country ? node.country : '');
});
const countries = Array.from(new Set(countries_list)).sort();
const country2cid = create_reverse_index(countries);

function parse_node_id (node_id: any) {
  return (typeof node_id == 'string') ? node_id : ('#' + node_id);
}

function parse_attr(index: { [id: string]: number }, attr: any) {
  return index[attr ? attr : ''];
}

for (let i = 0; i < suspicious_entities.length; ++i) {
  suspicious_entities[i] = parse_node_id(suspicious_entities[i]);
}

let id2uid: { [id: string | number]: number } = {};
nodes_data.forEach((node) => {
  let uid = id2uid[parse_node_id(node.id)] = Object.keys(id2uid).length;
  let name = node.id.toString();
  let ntid = parse_attr(ntype2ntid, node.type);
  let cid = parse_attr(country2cid, node.country);
  let suspicious = suspicious_entities.indexOf(parse_node_id(node.id)) >= 0;
  nodes_all.push({
    id: uid.toString(),
    name: name,
    ntid: ntid,
    cid: cid,
    nsuspicious: suspicious ? 1 : 0,
    degree_in: 0,
    degree_out: 0,
    weight_in: 0.,
    weight_out: 0.,
    label: (ntid ? '[' + node.type.substring(0, 2).toUpperCase() + '] ' : '') + name + (cid ? ' (' + node.country + ')' : '')
  });
});

const links_data = data['links'];
links_data.forEach((link) => {
  let src = id2uid[parse_node_id(link.source)];
  let tgt = id2uid[parse_node_id(link.target)];
  let weight = link.weight ? link.weight : 0.;
  let etid = parse_attr(etype2etid, link.type);
  let suspicious = nodes_all[src].nsuspicious || nodes_all[tgt].nsuspicious;
  ++nodes_all[src].degree_out;
  ++nodes_all[tgt].degree_in;
  nodes_all[src].weight_out += weight;
  nodes_all[tgt].weight_in += weight;
  links_all.push({
    source: src.toString(),
    target: tgt.toString(),
    weight: weight,
    etid: etid,
    esuspicious: suspicious ? 1 : 0,
    label: nodes_all[src].name + ' ' + (etid ? link.type : ' ') + nodes_all[tgt].name
  });
});

let nodes_init: Node[] = [nodes_all[id2uid[parse_node_id(suspicious_entities[0])]], nodes_all[id2uid[parse_node_id(suspicious_entities[1])]]];
let links_init: Link[] = links_all.filter((l) => (l.source == nodes_init[0].id || l.target == nodes_init[1].id));

links_init = links_all;
nodes_init = nodes_all;

export { links_all, nodes_all, links_init, nodes_init };
