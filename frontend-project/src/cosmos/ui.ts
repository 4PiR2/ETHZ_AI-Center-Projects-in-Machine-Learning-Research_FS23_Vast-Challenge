import {set_paused, set_is_add_nodes, exec_query} from "./graph";

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
