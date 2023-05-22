function getSelectedCombos() {
    const graph = window.parent.graph;
    const allCombos = graph.getCombos();
    const selectedCombos = allCombos.filter(combo => {
      return combo.hasState('selected');
    });
  
    return selectedCombos.map(combo => combo.getID());
}

export function showContextMenu(x, y, combo) {
    // Create context menu if it doesn't exist
    let contextMenu = document.getElementById('contextMenuCombo');
    if (!contextMenu) {
      contextMenu = document.createElement('div');
      contextMenu.id = 'contextMenuCombo';
      document.body.appendChild(contextMenu);
    }
    
    // Update context menu content based on the combo
    contextMenu.innerHTML = `
    <button onclick="removeCombos()">Ungroup</button>
    <button onclick="selectNodesInCombos()">Select Nodes</button>
    `;
    
    // Position the context menu
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    
    // Show the context menu
    contextMenu.style.display = 'block';
}



window.removeCombos = function() {
    const comboIds = getSelectedCombos();
    console.log("comboIds", comboIds);
    comboIds.forEach(comboId => {
        const combo = window.parent.graph.findById(comboId);
        const comboNodes = combo.getNodes();
        
        // uncombo and unselect the nodes
        comboNodes.forEach((node) => {
        window.parent.graph.updateItem(node, {
            comboId: null
        });
        window.parent.graph.setItemState(node, 'selected', false);
        });
        const graph = window.parent.graph;
        const comboNodeIds = new Set(comboNodes.map(n => n.getModel().id));
        console.log("comboNodeIds", comboNodeIds)
        const newEdges = graph.save().edges.filter(e =>
            comboNodeIds.has(e.source) ||
            comboNodeIds.has(e.target)).map(e => structuredClone(e));
        const nodesToReadd = [...comboNodeIds].map(nodeId => {
            return structuredClone(graph.findById(nodeId).getModel());
        });
        // then remove the combo
        window.parent.graph.removeItem(comboId);
        nodesToReadd.forEach(nodeToReadd => {
            graph.addItem('node', {...nodeToReadd, comboId: undefined});
        });
        newEdges.forEach(edge => graph.addItem('edge', edge));
    });
    
  };

window.selectNodesInCombos = function() {
  const comboIds = getSelectedCombos();
  comboIds.forEach(comboId => {
    const combo = window.parent.graph.findById(comboId);
    const comboNodes = combo.getNodes();
    comboNodes.forEach((node) => {
        window.parent.graph.setItemState(node, 'selected', true);
    });
  });
};