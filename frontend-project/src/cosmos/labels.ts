import { LabelRenderer, LabelOptions } from "@interacta/css-labels";
import { CosmosInputNode, CosmosInputLink, Graph } from "@cosmograph/cosmos";
import { nodes_all } from "./data-gen";

export class CosmosLabels<
  N extends CosmosInputNode,
  L extends CosmosInputLink
> {
  private labelRenderer: LabelRenderer;
  private labels: LabelOptions[] = new Array();
  constructor(div: HTMLDivElement) {
    this.labelRenderer = new LabelRenderer(div, { pointerEvents: "none" });
  }

  update(graph: Graph<N, L>): void {
    // Get coordinates of the tracked nodes
    const trackedNodesPositions = graph.getTrackedNodePositionsMap();
    let index = 0;
    trackedNodesPositions.forEach((positions, nodeId) => {
      // Convert coordinates to the screen space
      const screenPosition = graph.spaceToScreenPosition([
        positions?.[0] ?? 0,
        positions?.[1] ?? 0
      ]);

      // Get the node radius and convert it to the screen space value in pixels
      const radius = graph.spaceToScreenRadius(
        graph.getNodeRadiusById(nodeId) as number
      );

      // Set label properties
      let node = nodes_all[parseInt(nodeId.substring(1))]
      if (node.label) {
        this.labels[index] = {
          id: nodeId,
          text: node.label,
          x: screenPosition[0],
          y: screenPosition[1] - (radius + 2),
          opacity: 1,
          color: node.nsuspicious? '#ff0000ff' : '#000000ff'
        };
      }
      index += 1;
    });

    // Pass labels configuration to the renderer and draw them
    this.labelRenderer.setLabels(this.labels);
    this.labelRenderer.draw(true);
  }
}
