import data from './data/MC1_preprocessed.json' assert { type: "json" };

const TIP1_ID = 'Mar de la Vida OJSC';
const FISHEYE_ID = 'FishEye International';

const typeToStroke = {
    'ownership': '#BBB09B',
    'partnership': '#543654',
    'family_relationship': '#A5C23A',
    'membership': '#E26D5A',
}

const illegalIDs = new Set([
    "Armed Robbery\u00e2",
    "Game Thief\u00e2",
    "\u00e2\u0080\u009cillegal\u00e2",
    "\u00e2\u0080\u009cIllegal",
    "\u00e2\u0080\u009cshabu\u00e2",
    "\u00e2\u0080\u009cshark fin\u00e2",
    "Deepwater Horizon",
    "Cartel Emergent Weaponry Use",
    "Dark Web Vendor Illegal Narcotics",
    "Heroin Cocaine Exchange Bitcoin",
    "Officer Pleads Guilty",
    "Bribes Exchange Smuggling Contraband"
])

const menu = new G6.Menu({
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
      if(target.innerHTML === 'Expand Selection') {
        const graph = menu.get("graph");
        const selectedNodes = graph.findAllByState('node', 'selected');
        const nodes = graph.getNodes();
        const nodeIds = new Set(nodes.map(node => node.get('id')));

        if (selectedNodes.length > 0) {
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
            graph.fitView();
            // graph.layout();
            // graph.refreshPositions();
            // graph.render();
        }
      } else {
        const graph = menu.get("graph");
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
            // graph.refreshPositions();
            // graph.render();
        }
      }
    },
  });

function augmentNode(node) {
    let type = node.type ?? "unknown"
    if (node.id == FISHEYE_ID) {
        type = "fisheye"
    }
    let fill = '#3399FF80'
    if (node.id == TIP1_ID) {
        fill = '#C875FF80'
    } else if (node.id == FISHEYE_ID) {
        fill = '#FFD700'
    } else if (illegalIDs.has(node.id)) {
        fill = '#F00'
    }
    const augmentedNode = {
        ...node,
        legendType: 'type1',
        style: {
            fill: fill,
        },
        icon: {
            show: true,
            width: 25,
            height: 25,
            img: `icons/${type}.png`
        }
    }
    return augmentedNode;
}

function augmentEdge(edge) {
    let augmentedEdge = {
        source: edge.source,
        target: edge.target,
        // label: edge.type[0].toUpperCase(),
        // labelCfg: {
        //     style: {
        //         fill: "#fff"
        //     }
        // },
        style: {
            lineWidth: edge.weight * 1.5,
            stroke: typeToStroke[edge.type],
        },
        type: 'quadratic',
        legendType: edge.type,
    }
    if (edge.type === 'ownership' || edge.type === 'membership') {
        augmentedEdge.style.endArrow = {
            path: 'M 0,0 L 6,3, M 0,0 L 6,-3'
        }
    }
    return augmentedEdge;
}


const typeConfigs = {
    'type1': {
        type: 'circle',
        style: {
          width: 20,
          lineWidth: 1,
          stroke: '#000'
        }
      },
    'ownership': {
      type: 'line',
      style: {
        width: 30,
        lineWidth: 10,
        stroke: typeToStroke['ownership'],
      }
    },
    'partnership': {
        type: 'line',
        style: {
          width: 30,
          lineWidth: 10,
          stroke: typeToStroke['partnership'],
        }
    },
    'family_relationship': {
        type: 'line',
        style: {
          width: 30,
          lineWidth: 10,
          stroke: typeToStroke['family_relationship'],
        }
    },
    'membership': {
        type: 'line',
        style: {
          width: 30,
          lineWidth: 10,
          stroke: typeToStroke['membership'],
        }
    }
  }
const legendData = {
    nodes: [{
      id: 'type1',
      label: 'Node',
      order: 4,
      ...typeConfigs['type1']
    }],
    edges: [{
      id: 'ownership',
      label: 'Ownership',
      order: 2,
      ...typeConfigs['ownership']
    }, {
      id: 'partnership',
      label: 'Partnership',
      ...typeConfigs['partnership']
    }, {
      id: 'family_relationship',
      label: 'Family relationship',
      ...typeConfigs['family_relationship']
    }, {
      id: 'membership',
      label: 'Membership',
      ...typeConfigs['membership']
    }]
  }
const legend = new G6.Legend({
    data: legendData,
    align: 'center',
    layout: 'horizontal', // vertical
    position: 'top-right',
    vertiSep: 12,
    horiSep: 24,
    offsetY: 24,
    offsetX: -44,
    padding: [4, 16, 8, 16],
    containerStyle: {
      fill: '#ccc',
      lineWidth: 1
    },
    title: ' ',
    titleConfig: {
      position: 'center',
      offsetX: 0,
      offsetY: -15,
    },
    filter: {
      enable: true,
      multiple: true,
      trigger: 'click',
      graphActiveState: 'selected',
      graphInactiveState: 'inactiveByLegend',
      filterFunctions: {
        'type1': (d) => {
          if (d.legendType === 'type1') return true;
          return false
        },
        'type2': (d) => {
          if (d.legendType === 'type2') return true;
          return false
        },
        'type3': (d) => {
          if (d.legendType === 'type3') return true;
          return false
        },
        'ownership': (d) => {
          if (d.legendType === 'ownership') return true;
          return false
        },
        'partnership': (d) => {
          if (d.legendType === 'partnership') return true;
          return false
        },
        'family_relationship': (d) => {
          if (d.legendType === 'family_relationship') return true;
          return false
        },
        'membership': (d) => {
          if (d.legendType === 'membership') return true;
          return false
        },
      }
    }
  });

const tooltip = new G6.Tooltip({
    offsetX: 10,
    offsetY: 20,
    getContent(e) {
      const outDiv = document.createElement('div');
    //   outDiv.style.width = '180px';
      outDiv.innerHTML = `<p style="font-size: larger; font-weight: bold; margin: 0px">
      ${e.item.getModel().id}<br>${e.item.getModel().country ?? ""}</p>`
      return outDiv
    },
    itemTypes: ['node']
  });

const graph = new G6.Graph({
  container: 'container',
  width: window.innerWidth,
  height: window.innerHeight,
  fitCenter: true,
  fitView: true,
  fitViewPadding: [200, 200, 200, 200],
  modes: {
    default: ['drag-node', 'drag-canvas', 'zoom-canvas', 'brush-select', 'click-select'],
  },
//   animate: true,
  autoPaint: true,
//   layout: {
    // type: 'radial',
    // center: [0, 0], // The center of the graph by default
//     // linkDistance: 50, // The edge length
//     // maxIteration: 1000,
//     // maxPreventOverlapIteration: 1000,
//     focusNode: TIP1_ID,
//     unitRadius: 100,
//     preventOverlap: true, // nodeSize or size in data is required for preventOverlap: true
//     // nodeSize: 10,
//     strictRadial: true,
//     workerEnabled: true, // Whether to activate web-worker
//   },
  defaultNode: {
    size: 40,
    type: 'circle',
    style: {
      fill: '#9EC9FF',
      stroke: '#5B8FF9',
    },
    labelCfg: {
      style: {
        fill: '#000',
        fontSize: 12,
      },
      position: 'bottom',
    },
  },
  defaultEdge: {
    type: 'quadratic',
    style: {
      stroke: '#5B8FF9',
      lineWidth: 2,
    },
  },
  nodeStateStyles: {
    selected: {
      stroke: '#111111',
      lineWidth: 4, // Custom border width for selected nodes
    },
  },
//   edgeStateStyles: {
//     activeByLegend: {
//       lineWidth: 3
//     },
//     inactiveByLegend: {
//       opacity: 0.5
//     }
//   },
  plugins: [menu, tooltip, legend]
});

function processData(data) {
  const newData = new Object();
  newData.nodes = data.nodes.filter(node => node.id === TIP1_ID);
  newData.nodes[0].x = 0;
  newData.nodes[0].y = 0;
  newData.nodes[0] = augmentNode(newData.nodes[0])
  newData.edges = [];
  return newData;
}


graph.data(processData(data));
graph.render();
