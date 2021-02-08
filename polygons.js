import {battles} from './input.js';
import {changeRef, clip, getArea, getRef, sort} from './geometry.js';
import {drawCircle, drawGrid, drawLines, drawPolygon, drawVertices} from './canvas-util.js';

/* Global */
export const size = 400;
export let scale, A, B, sortedA, sortedB, clippedPolygon;

const initialCanvas = document.querySelector('.initial canvas').getContext("2d");
const sortingCanvas = document.querySelector('.sorting canvas').getContext("2d");
const clippingCanvas = document.querySelector('.clipping canvas').getContext("2d");
const areaCanvas = document.querySelector('.area canvas').getContext("2d");
const canvas = [initialCanvas, sortingCanvas, clippingCanvas, areaCanvas];


function drawRef(context, polygon) {
    const centroid = getRef(polygon);
    drawCircle(context, centroid, 10, 'red', true);
}

function select(battleName) {
    ({A, B} = battles[battleName]);
    setScale(A, B);
    canvas.forEach(c => c.clearRect(-size, -size, size * 2, size * 2));
    drawInitial();
    setSorted();
    drawSorting();
    drawClipping();
    drawArea();
}

function drawInitial() {
    drawGrid(initialCanvas);
    drawVertices(initialCanvas, A, '#88f');
    drawVertices(initialCanvas, B, '#8f8');
    document.querySelector('.initial .A span').textContent = display(A);
    document.querySelector('.initial .B span').textContent = display(B);
}

function drawSorting() {
    drawPolygon(sortingCanvas, sortedA, "#888", '#88f');
    drawRef(sortingCanvas, sortedA);
    drawLines(sortingCanvas, sortedA);
    document.querySelector('.sorting .A span').textContent = display(sortedA);
    document.querySelector('.sorting .B span').textContent = display(sortedB);
}

function drawClipping() {
    drawPolygon(clippingCanvas, sortedA, "#888", "#88f");
    drawPolygon(clippingCanvas, sortedB, '#888','#8f8');
    clippedPolygon = clip(sortedA, sortedB);
    if (clippedPolygon.length)
        drawPolygon(clippingCanvas, clippedPolygon, '#000','#0ff');
    document.querySelector('.clipping .clipped span').textContent = display(clippedPolygon);
}

function drawArea() {
    if (clippedPolygon.length)
        drawPolygon(areaCanvas, clippedPolygon, '#000','#0ff');
    drawGrid(areaCanvas);
    document.querySelector('.figure.area .clipped.area span').textContent = getArea(clippedPolygon).toFixed(2);
}

function display(polygon) {
    return polygon.map(vertex => vertex.map(coordinate => +(coordinate).toFixed(1))).join(' ; ');
}

function setCanvas() {
    canvas.forEach(c => {
            c.canvas.width = size;
            c.canvas.height = size;
            c.translate(size / 2, size / 2);
        }
    );
}

function setSorted() {
    sortedA = sort(A);
    sortedB = sort(B);
}

/**
 * Sets the scale, size in pixels of one unit, units ranging from -16 to +16.
 * @param A
 * @param B
 */
function setScale(A, B) {
    scale = size / Math.max(...A.flat(2).map(Math.abs), ...B.flat(2).map(Math.abs)) / 2;
}

const buttons = document.querySelectorAll('.buttons.polygons button');
Object.keys(battles).forEach((battleName, index) => {
    buttons[index].textContent = battleName.charAt(0).toUpperCase() + battleName.slice(1).replace(/([A-Z])/g, ' $1').trim();
    buttons[index].addEventListener("click", () => window.onload = select(battleName));
})
document.querySelector('button.ref').addEventListener('click', () => {
    changeRef();
    setSorted();
    sortingCanvas.clearRect(-size, -size, size * 2, size * 2);
    drawSorting();
})

setCanvas();
window.onload = select('firstContact');
