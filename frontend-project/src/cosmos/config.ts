import { Node, Link } from "./data-gen";
import { GraphConfigInterface } from "@cosmograph/cosmos";

const plot_colors_0 = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
];
const plot_colors_1 = [
    '#000000', '#ff0000', '#ffff00', '#777777', '#7f7f00', '#00ff00', '#0000ff', '#007f00', '#7f0000',
];

export const config: GraphConfigInterface<Node, Link> = {
  backgroundColor: "#ffffffff",
  nodeSize: (n) => Math.sqrt(n.degree_in + n.degree_out),
  nodeColor: (n) => plot_colors_1[n.ntid] + '77',
  nodeGreyoutOpacity: .1,
  linkWidth: (l) => l.weight,
  linkColor: (l) => plot_colors_0[l.etid],
  linkArrows: true,
  linkGreyoutOpacity: .1,
  simulation: {
    linkDistance: 20.,
    linkSpring: 2,
    repulsion: 0.2,
    gravity: 0.1,
    decay: 100000
  },
  events: {}
};
