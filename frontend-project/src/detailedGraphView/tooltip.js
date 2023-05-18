export const tooltip = new G6.Tooltip({
    offsetX: 10,
    offsetY: 20,
    getContent(e) {
      const outDiv = document.createElement('div');
      outDiv.innerHTML = `<p style="font-size: larger; font-weight: bold; margin: 0px">
      ${e.item.getModel().id.split('|')[0]}<br>${e.item.getModel().country ?? ""}</p>`
      return outDiv
    },
    itemTypes: ['node']
  });
