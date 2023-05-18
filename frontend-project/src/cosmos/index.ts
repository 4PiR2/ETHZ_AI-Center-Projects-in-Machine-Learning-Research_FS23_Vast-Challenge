import {CosmosInputLink, CosmosInputNode, Graph, GraphConfigInterface} from "@cosmograph/cosmos";
import {LabelOptions, LabelRenderer} from "@interacta/css-labels";
import * as neo4j from 'neo4j-driver';
import "./styles.css";

type Node = {
    id: string;
    name: string;
    n: string;
    c: string;
    x?: number;
    y?: number;
    size?: number;
    m?: number;
    degree_in: number;
    degree_out: number;
    weight_in: number;
    weight_out: number;
    label?: string;
};

type Link = {
    source: string;
    target: string;
    weight: number;
    e: string;
};

class CosmosLabels<
    N extends CosmosInputNode,
    L extends CosmosInputLink
> {
    private labelRenderer: LabelRenderer;
    private labels: LabelOptions[] = [];
    private graph: Graph<N, L>;
    constructor(div: HTMLDivElement, graph: Graph<N, L>) {
        this.labelRenderer = new LabelRenderer(div, { pointerEvents: 'none' });
        this.graph = graph;
    }
    update(): void {
        const nodePositionsMap = this.graph.getNodePositionsMap();
        let labels: LabelOptions[] = [];
        graphNodes.forEach((n) => {
            // Get the node radius and convert it to the screen space value in pixels
            const nodePosition = nodePositionsMap.get(n.id);
            const screenPosition = this.graph.spaceToScreenPosition([
                nodePosition?.[0] ?? 0,
                nodePosition?.[1] ?? 0
            ]);
            const radius = this.graph.spaceToScreenRadius(
                this.graph.getNodeRadiusById(n.id) as number
            );
            // Set label properties
            if (n.label) {
                labels.push({
                    id: n.id,
                    text: n.label,
                    x: screenPosition[0],
                    y: screenPosition[1] - (radius + 2.),
                    opacity: 1.,
                    color: n.m? '#ff0000ff' : '#000000ff'
                });
            }
        });
        // Pass labels configuration to the renderer and draw them
        this.labels = labels;
        this.labelRenderer.setLabels(this.labels);
        this.labelRenderer.draw(true);
    }
}

const plot_colors_0 = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
];
const plot_colors_1 = [
    '#000000', '#ff0000', '#ffff00', '#777777', '#7f7f00', '#00ff00', '#0000ff', '#007f00', '#7f0000',
];

const config: GraphConfigInterface<Node, Link> = {
    backgroundColor: '#ffffffff',
    nodeSize: (n) => Math.sqrt(n.weight_in + n.weight_out),
    nodeColor: (n) => plot_colors_1[Number(n.n.substring(1))] + '77',
    nodeGreyoutOpacity: .1,
    linkWidth: (l) => l.weight,
    linkColor: (l) => plot_colors_0[Number(l.e.substring(1))] + Math.floor((Math.min(l.weight, .999) + 1.) * 256.).toString(16).substring(1),
    linkArrows: true,
    linkGreyoutOpacity: .1,
    simulation: {
        linkDistance: 20.,
        linkSpring: 2,
        repulsion: 0.2,
        gravity: 0.1,
        decay: 100000,
        onTick: () => cosmosLabels.update(),
    },
    events: {
        onZoom: () => cosmosLabels.update(),
        onClick: (node, i, pos, event) => onClick_event(node, i, pos, event),
    },
};

const driver: neo4j.Driver = neo4j.driver('bolt://' + location.hostname + ':7687', neo4j.auth.basic('neo4j', '12345678'), {/* encrypted: 'ENCRYPTION_OFF' */});
let graph: Graph<Node, Link> = new Graph(document.querySelector('canvas') as HTMLCanvasElement, config);
const cosmosLabels = new CosmosLabels<Node, Link>(document.querySelector('#labels') as HTMLDivElement, graph);
let graphNodes: Node[] = [];
let graphLinks: Link[] = [];
let nodes_all: Node[] = [];
let links_all: Link[] = [];
let isPaused = false;
let is_add_nodes = true;

function onClick_event(node: Node | undefined, i: number | undefined, pos: [number, number] | undefined, event: MouseEvent){
    if (node && i !== undefined) {
        // console.log('Clicked node: ', node);
        if (is_add_nodes) {
            let nodes_id_old: string[] = [];
            graphNodes.forEach((n) => {
                nodes_id_old.push(n.id);
            });
            let links_new = links_all.filter(
                (l) => (l.source == node.id && nodes_id_old.indexOf(l.target) < 0 || l.target == node.id && nodes_id_old.indexOf(l.source) < 0)
            );
            let nodes_id_new: string[] = [];
            links_new.forEach((l) => {
                if (l.source != node.id) {
                    if (nodes_id_old.indexOf(l.source) < 0) {
                        nodes_id_new.push(l.source);
                    }
                } else {
                    if (nodes_id_old.indexOf(l.target) < 0) {
                        nodes_id_new.push(l.target);
                    }
                }
            });
            nodes_all.forEach((n) => {
                if (nodes_id_new.indexOf(n.id) >= 0) {
                    graphNodes.push(n);
                    graphLinks = [...graphLinks, ...links_all.filter(
                        (l) => (l.source == n.id || l.target == n.id)
                    )];
                }
            });
            const nodePositionsMap = graph.getNodePositionsMap();
            graphNodes.forEach((n) => {
                const nodePosition = nodePositionsMap.get(n.id);
                if (nodePosition) {
                    n.x = nodePosition[0];
                    n.y = nodePosition[1];
                }
            });
        } else {
            graphNodes = graphNodes.filter((n) => n.id !== node.id);
            graphLinks = graphLinks.filter(
                (l) => l.source !== node.id && l.target !== node.id
            );
            const nodePositionsMap = graph.getNodePositionsMap();
            graphNodes.forEach((n) => {
                const nodePosition = nodePositionsMap.get(n.id);
                if (nodePosition) {
                    n.x = nodePosition[0];
                    n.y = nodePosition[1];
                }
            });
        }
        graph.setData(graphNodes, graphLinks, !isPaused);
        // graph.unselectNodes();
        // graph.selectNodeById(node.id);
        cosmosLabels.update();
    }
}

function exec_query(database: string, query: string, records_handler: (_: any) => any) {
    const session: neo4j.Session = driver.session({database: database});
    session
        .run(query)
        .then((result: neo4j.QueryResult) => {
            records_handler(result.records);
            // session.close();
            // driver.close();
                    // @ts-ignore
            document.getElementById('wait').style.visibility = 'hidden';
        })
        .catch((error) => {
            console.log(error);
        })
        .then(() => session.close())
    ;
    // driver.close();
}

function process_records(records: any) {
    let nodes = {}, links = {};
    // @ts-ignore
    records.forEach((record) => {
        record._fields.forEach((item: {}) => {
            if(item.constructor.name == 'Node') {
                // @ts-ignore
                nodes[item.identity.low] = item;
            } else if(item.constructor.name == 'Relationship') {
                // @ts-ignore
                links[item.identity.low] = item;
            }
        });
        // record.get("n");
        // record.get("r");
        // record.get("m");
    });
    nodes_all = [];
    for (let i in nodes) {
        // @ts-ignore
        const node = nodes[i].properties;
        nodes_all.push({
            id: node.u,
            name: node.name,
            n: node.n,
            c: node.c,
            m: node.m,
            degree_in: 0,
            degree_out: 0,
            weight_in: 1.,
            weight_out: 1.,
            label: (node.type ? '[' + node.type.substring(0, 2).toUpperCase() + '] ' : '') + node.name + (node.country ? ' (' + node.country + ')' : '')
        });
    }
    links_all = [];
    for (let i in links) {
        // @ts-ignore
        const link = links[i].properties;
        links_all.push({
            source: link.s,
            target: link.t,
            weight: link.weight,
            e: link.e,
        });
    }
    links_all = links_all.filter(
        (l) => nodes_all.filter((n) => n.id == l.source).length && nodes_all.filter((n) => n.id == l.target).length
    );
    graphNodes = nodes_all;
    graphLinks = links_all;
    const n_dummy: Node = {
        id: 'U9999',
        name: '',
        n: '',
        c: '',
        m: 0,
        degree_in: 0,
        degree_out: 0,
        weight_in: 0,
        weight_out: 0,
    }
    const e_dummy: Link = {
        source: n_dummy.id,
        target: n_dummy.id,
        weight: 0.,
        e: '',
    }
    graphNodes.push(n_dummy);
    graphLinks.push(e_dummy);
    graph.setData(graphNodes, graphLinks, !isPaused);
    graph.setZoomLevel(1.);
}

let query: string;
query = 'MATCH (n)-[r]-() WHERE n:M0 RETURN n, r;';
exec_query('neo4j', query, process_records);


/* ~ Demo Actions ~ */
// Start / Pause
const pauseButton = document.getElementById("pause") as HTMLDivElement;

function pause() {
    isPaused = true;
    pauseButton.textContent = "Start";
    graph.pause();
}

function start() {
    isPaused = false;
    pauseButton.textContent = "Pause";
    graph.start();
}

function togglePause() {
    if (isPaused) start();
    else pause();
}

pauseButton.addEventListener("click", togglePause);

const editButton = document.getElementById("edit") as HTMLDivElement;

function toggleEdit() {
    if (is_add_nodes) {
        is_add_nodes = false;
        editButton.textContent = "Removal Mode (Click to Toggle to Addition Mode)";
    } else {
        is_add_nodes = true;
        editButton.textContent = "Addition Mode (Click to Toggle to to Removal Mode)";
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
