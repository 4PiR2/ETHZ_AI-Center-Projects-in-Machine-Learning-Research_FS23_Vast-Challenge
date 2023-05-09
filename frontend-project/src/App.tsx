import { Graph } from '@cosmograph/cosmos'
import { nodes, links } from './data'

function App() {
  const canvas = document.querySelector('canvas')
  const config = {
    simulation: {
      repulsion: 0.5,
    },
    renderLinks: true,
    linkColor: (link: any) => link.color,
    nodeColor: (node: any) => node.color,
    events: {
      onClick: (node: any) => {
        console.log('Clicked node: ', node)
      },
    },
    /* ... */
  }

// @ts-ignore
  const graph = new Graph(canvas, config)

  graph.setData(nodes, links)
  return graph
}

export default App;
