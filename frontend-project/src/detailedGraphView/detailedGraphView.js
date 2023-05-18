import {getInitialData} from './data.js';
import {menu} from './menu.js';
import {legend} from './legend.js';
import {tooltip} from './tooltip.js';

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
  defaultNode: {
    size: 40,
    type: 'circle',
    style: {
      fill: '#9EC9FF',
      stroke: '#111111',
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
  plugins: [menu, tooltip, legend]
});

function main() {
  graph.data(getInitialData());
  graph.render();
  graph.destroyLayout();
  window.parent.graph = graph;
  window.parent.savedGraphs[0] = JSON.parse(JSON.stringify(graph.save()));
}

main();
