import {data, augmentNode, augmentEdge} from './data.js';
import {TIP1_ID} from './ids.js';

function radialExpansionAroundSelection(graph) {
    const selectedNodes = graph.findAllByState('node', 'selected');
    if (selectedNodes.length == 0) {
        return;
    }
    const nodes = graph.getNodes();
    const nodeIds = new Set(nodes.map(node => node.get('id')));
    const connectedNodes = new Set();
    const connectedEdges = new Set();
    selectedNodes.forEach((node) => {
    data.edges.forEach((edge) => {
        let added = false
        if (edge.source === node.get('id') && !nodeIds.has(edge.target)) {
            connectedNodes.add(edge.target);
            added = true
        }
        if (edge.target === node.get('id') && !nodeIds.has(edge.source)) {
            connectedNodes.add(edge.source);
            added = true
        }
        if (added) {
            connectedEdges.add(edge)
        }
    });
    });
    const centerX = graph.findById(TIP1_ID).getModel().x; // replace with your desired x-coordinate
    const centerY = graph.findById(TIP1_ID).getModel().y; // replace with your desired y-coordinate
    // calculate the radius of the circle based on the number of nodes
    const node_diam = graph.get("defaultNode").size
    const radius = node_diam * connectedNodes.size * 0.2; // replace with your desired radius
    const angleStep = (2 * Math.PI) / (connectedNodes.size);
    let counter = 0;
    connectedNodes.forEach((nodeId) => {
        const node = data.nodes.find((n) => n.id === nodeId);
        const angle = counter * angleStep;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        let newNode ={...node, x, y}
        newNode = augmentNode(newNode);
        graph.addItem('node', newNode);
        counter++;
    });
    // connectedEdges.forEach((edge) => {
    //   if (!graph.findById(edge.id)) {
    //     let newEdge = augmentEdge(edge)
    //     graph.addItem('edge', newEdge);
    //   }
    // });
    // graph.layout();
    // graph.refreshPositions();
    // graph.render();
}

function addEdgesAndApplyForceClustering(graph) {
    const selectedNodes = graph.findAllByState('node', 'selected');
    const nodeIds = new Set(selectedNodes.map(node => node.get('id')));

    if (selectedNodes.length > 0) {
        const newNodes = data.nodes.filter((node) => nodeIds.has(node.id))
        const newEdges = data.edges.filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target))
        const newData = {
            nodes: newNodes.map((node) => augmentNode(node)),
            edges: newEdges.map((edge) => augmentEdge(edge))
        }
        graph.changeData(newData);
        let ctr = 0;
        const newLayout =  {
            type: 'force',
            center: [200, 200], // The center of the graph by default
            linkDistance: 200, // Edge length
            nodeStrength: 10,
            edgeStrength: 0.01,
            collideStrength: 0.8,
            nodeSize: 30,
            alpha: 0.3,
            alphaDecay: 0.028,
            alphaMin: 0.01,
            forceSimulation: null,
            onTick: () => {
                if (ctr % 1 === 0) {
                    graph.fitView();
                }
                ctr += 1;
            },
            onLayoutEnd: () => {
                graph.fitView();
            },
        };
        graph.updateLayout(newLayout);
    }
}

export const menu = new G6.Menu({
    offsetX: 10,
    offsetY: 20,
    itemTypes: ['node'],
    getContent(e, graph) {
      const outDiv = document.createElement('div');
      outDiv.setAttribute('id', 'contextMenu')
      outDiv.innerHTML = `<ul>
          <li>Expand Selection</li>
          <li>Focus</li>
        </ul>`
      return outDiv
    },
    handleMenuClick(target, item, _) {
      const graph = menu.get("graph");
      if(target.innerHTML === 'Expand Selection') {
        radialExpansionAroundSelection(graph);
      } else {
        addEdgesAndApplyForceClustering(graph);
      }
      graph.fitView();
    },
  });