import "./styles.css";
import { nodes_all, links_all, nodes_init, links_init, Node, Link } from "./data-gen";
import { config } from "./config";
import { Graph, GraphConfigInterface } from "@cosmograph/cosmos";
import { CosmosLabels } from "./labels";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const div = document.querySelector("#labels") as HTMLDivElement;
const cosmosLabels = new CosmosLabels<Node, Link>(div);

if (config.simulation) {
  config.simulation.onTick = () => cosmosLabels.update(graph);
}
if (config.events) {
  config.events.onZoom = () => cosmosLabels.update(graph);
}

let graph: Graph<Node, Link>;
let isPaused = true;

let graphNodes = nodes_init;
let graphLinks = links_init;

let is_add_nodes = true;

if (config.events)
  config.events.onClick = (node, i, pos, event) => {
    if (node && i !== undefined) {
      let nodes_id: string[] = [];
      if (is_add_nodes) {
        let nodes_id_old: string[] = [];
        graphNodes.forEach((n) => {
          nodes_id_old.push(n.id);
        });
        let links_new = links_all.filter(
          (l) => (l.source == node.id && nodes_id_old.indexOf(l.target) < 0 || l.target == node.id && nodes_id_old.indexOf(l.source) < 0)
        );
        let nodes_id_new: string[] = [];
        links_new.forEach((l) => {
          if (l.source != node.id) {
            nodes_id_new.push(l.source);
          } else {
            nodes_id_new.push(l.target);
          }
        });
        graphLinks = [...new Set([...graphLinks, ...links_new])];
        graphNodes = [];
        nodes_id = [...new Set([...nodes_id_old, ...nodes_id_new])];
        const nodePositionsMap = graph.getNodePositionsMap();
        nodes_id.forEach((node_id) => {
          let n = nodes_all[parseInt(node_id)];
          const nodePosition = nodePositionsMap.get(node_id);
          if (nodePosition) {
            n.x = nodePosition[0];
            n.y = nodePosition[1];
          }
          graphNodes.push(n);
        });
      } else {
        graphNodes = graphNodes.filter((n) => n.id !== node.id);
        graphLinks = graphLinks.filter(
          (l) => l.source !== node.id && l.target !== node.id
        );
        const nodePositionsMap = graph.getNodePositionsMap();
        graphNodes.forEach((n) => {
          const nodePosition = nodePositionsMap.get(n.id);
          if (nodePosition) {
            n.x = nodePosition[0];
            n.y = nodePosition[1];
          }
        });
        graphNodes.forEach((n) => {
          nodes_id.push(n.id);
        });
      }
      graph.setData(graphNodes, graphLinks, !isPaused);
      // graph.unselectNodes();
      // graph.selectNodeById(node.id);
      graph.trackNodePositionsByIds(nodes_id);
      cosmosLabels.update(graph);
    }
    // console.log("Clicked node: ", node);
  };

graph = new Graph(canvas, config);
graph.setData(graphNodes, graphLinks);
graph.setZoomLevel(1.);

let nodes_id_init: string[] = []
graphNodes.forEach((node) => {
  nodes_id_init.push(node.id);
});
graph.trackNodePositionsByIds(nodes_id_init);
graph.pause();


/* ~ Demo Actions ~ */
// Start / Pause
const pauseButton = document.getElementById("pause") as HTMLDivElement;

function pause() {
  isPaused = true;
  pauseButton.textContent = "Start";
  graph.pause();
}

function start() {
  isPaused = false;
  pauseButton.textContent = "Pause";
  graph.start();
}

function togglePause() {
  if (isPaused) start();
  else pause();
}

pauseButton.addEventListener("click", togglePause);

const editButton = document.getElementById("edit") as HTMLDivElement;

function toggleEdit() {
  if (is_add_nodes) {
    is_add_nodes = false;
    editButton.textContent = "Removal Mode (Click to Toggle to Addition Mode)";
  } else {
    is_add_nodes = true;
    editButton.textContent = "Addition Mode (Click to Toggle to to Removal Mode)";
  }
}

editButton.addEventListener("click", toggleEdit);
