import { Node, Link } from "./data-gen";
import { GraphConfigInterface } from "@cosmograph/cosmos";

export const config: GraphConfigInterface<Node, Link> = {
  backgroundColor: "#151515",
  nodeSize: 1,
  nodeColor: "#4B5BBF",
  nodeGreyoutOpacity: 0.1,
  linkWidth: 0.1,
  linkColor: "#5F74C2",
  linkArrows: true,
  linkGreyoutOpacity: 0,
  simulation: {
    linkDistance: 10.,
    linkSpring: 2,
    repulsion: 0.2,
    gravity: 0.1,
    decay: 100000
  },
  events: {}
};
