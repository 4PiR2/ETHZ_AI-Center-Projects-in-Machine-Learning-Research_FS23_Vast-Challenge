import {select_by_rect} from "./graph";

export {selected_nodes};

// Define canvas and context
const canvas_graph = document.getElementById("graph") as HTMLCanvasElement;
const canvas = document.getElementById("overlay") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const selection_button = document.getElementById("select") as HTMLCanvasElement;

let selection_mode = false;
let selected_nodes: any = [];

function enable_selection() {
  if (selection_mode) {
    selection_mode = false;
    selection_button.innerHTML = 'Selection Mode';
    canvas.style.visibility = 'hidden';
  } else {
    selection_mode = true;
    selection_button.innerHTML = 'Exit Selection Mode';
    canvas.width = canvas_graph.width;
    canvas.height = canvas_graph.height;
    canvas.style.visibility = 'visible';
  }
}

selection_button.addEventListener("click", enable_selection);

// Define variables
let isDrawing = false;
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;

// Add event listeners
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);

// Handle mouse down event
function handleMouseDown(event: MouseEvent) {
  isDrawing = true;
  startX = event.clientX - canvas.offsetLeft;
  startY = event.clientY - canvas.offsetTop;
}

// Handle mouse move event
function handleMouseMove(event: MouseEvent) {
  if (!isDrawing) {
    return;
  }

  endX = event.clientX - canvas.offsetLeft;
  endY = event.clientY - canvas.offsetTop;

  canvas.width = canvas_graph.width;
  canvas.height = canvas_graph.height;

  // Clear canvas
  // @ts-ignore
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw rectangle
  // @ts-ignore
  ctx.strokeStyle = "red";
  // ctx.lineWidth = 2;
  // @ts-ignore
  ctx.strokeRect(startX, startY, endX - startX, endY - startY);
}

// Handle mouse up event
function handleMouseUp() {
  isDrawing = false;
  // @ts-ignore
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Perform any actions you want with the selected region
  // console.log("Selected region:", startX, startY, endX, endY);
  selected_nodes = select_by_rect(startX, startY, endX, endY);

  // Explicitly define the type of `window`
  // @ts-ignore
  const parentWindow: Window & typeof globalThis = window.parent;
  // Now you can access properties of `window.parent`
  // @ts-ignore
  parentWindow.selected_nodes = selected_nodes;

}
