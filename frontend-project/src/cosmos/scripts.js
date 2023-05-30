import {getAllData} from '../detailedGraphView/data'

export function sync0() {
    const right_panel = window.parent.document.getElementById('right_panel');
    right_panel.style.visibility = 'visible';
    var all_data = getAllData();
    var selected_nodes = window.parent.selected_nodes;
    var nodes = [];
    for (let i = 0; i < all_data.nodes.length; ++i) {
        for (let j = 0; j < selected_nodes.length; ++j) {
            if (parseInt(all_data.nodes[i].id.split('|')[1]) === parseInt(selected_nodes[j].substring(1))) {
                nodes.push(all_data.nodes[i]);
                break;
            }
        }
    }
    all_data.nodes = nodes;
    var graph = window.parent.graph;
    graph.data(all_data);
    graph.render();
    graph.destroyLayout();
}

window.parent.document.getElementById('detailed_button').addEventListener('click', () =>  sync0());
