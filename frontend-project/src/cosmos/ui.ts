import {set_paused, set_is_add_nodes, exec_query, process_records} from "./graph";

// Start / Pause
const pauseButton = document.getElementById("pause") as HTMLDivElement;
let isPaused = false;

function togglePause() {
    isPaused = !isPaused;
    set_paused(isPaused);
    if (isPaused) {
        pauseButton.textContent = "Start";
    } else {
        pauseButton.textContent = "Pause";
    }
}

pauseButton.addEventListener("click", togglePause);

const editButton = document.getElementById("edit") as HTMLDivElement;
let is_add_nodes = true;

function toggleEdit() {
    is_add_nodes = !is_add_nodes;
    set_is_add_nodes(is_add_nodes);
    if (is_add_nodes) {
        editButton.textContent = "Addition Mode (Click to Toggle to to Removal Mode)";
    } else {
        editButton.textContent = "Removal Mode (Click to Toggle to Addition Mode)";
    }
}

editButton.addEventListener("click", toggleEdit);

const canvas_graph = document.getElementById("graph") as HTMLCanvasElement;
const canvas = document.getElementById("overlay") as HTMLCanvasElement;
const selection_button = document.getElementById("select") as HTMLCanvasElement;
let selection_mode = false;
function enable_selection() {
    selection_mode = !selection_mode;
    if (selection_mode) {
        selection_button.innerHTML = 'Exit Lasso Mode';
        canvas.width = canvas_graph.width;
        canvas.height = canvas_graph.height;
        canvas.style.visibility = 'visible';
    } else {
        selection_button.innerHTML = 'Lasso Mode';
        canvas.style.visibility = 'hidden';
    }
}

selection_button.addEventListener("click", enable_selection);

const queryButton = document.getElementById('submit_query') as HTMLDivElement;
function submit_query() {
    const textbox = document.getElementById('freeform');
    if (textbox) {
        // @ts-ignore
        exec_query('neo4j', textbox.value, process_records);
        // @ts-ignore
        document.getElementById('wait').style.visibility = 'visible';
    }
}
queryButton.addEventListener('click', () =>  submit_query());

const filter_button = document.getElementById('filter_button') as HTMLDivElement;

function filter_query() {
    const filter_src = document.getElementById('filter_src');
    const filter_tgt = document.getElementById('filter_tgt');
    const filter_edge = document.getElementById('filter_edge');
    // @ts-ignore
    const query = "MATCH (n" + filter_src.value + ")-[r" + filter_edge.value + "]-(m" + filter_tgt.value + ") RETURN n, r, m;";
    exec_query('neo4j', query, process_records);
    // @ts-ignore
    document.getElementById('wait').style.visibility = 'visible';
}

filter_button.addEventListener('click', () => filter_query())
