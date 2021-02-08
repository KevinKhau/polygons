import {battles} from './input.js';
/* Set reference vertex for clockwise sorting here */
import {clip, sort, getAngle, getArea, getRef, changeRef} from './geometry.js';

const x = vertex => vertex[0] * scale;
const y = vertex => vertex[1] * scale;
let scale, A, B, sortedA, sortedB, clippedPolygon;
const initialCanvas = document.querySelector('.initial canvas').getContext("2d");
const sortingCanvas = document.querySelector('.sorting canvas').getContext("2d");
const clippingCanvas = document.querySelector('.clipping canvas').getContext("2d");
const areaCanvas = document.querySelector('.area canvas').getContext("2d");
const canvas = [initialCanvas, sortingCanvas, clippingCanvas, areaCanvas];
const size = 400;

/**
 * Outlines the initial vertices in figure #1.
 *
 * @param context
 * @param polygon
 * @param strokeStyle
 */
function drawVertices(context, polygon, strokeStyle) {
    context.strokeStyle = strokeStyle;
    for (const vertex of polygon) {
        drawCircle(context, vertex, 5, strokeStyle);
    }
    context.beginPath();
    context.moveTo(x(polygon[0]), y(polygon[0])); //first vertex
    for (const vertex of polygon) {
        context.lineTo(x(vertex), y(vertex));
    }
    context.lineWidth = 3;
    context.stroke();
    context.closePath();
}

function drawPolygon(context, polygon, strokeStyle, fillStyle) {
    context.strokeStyle = strokeStyle;
    context.beginPath();
    context.moveTo(x(polygon[0]), y(polygon[0])); //first vertex
    for (let i = 1; i < polygon.length; i++)
        context.lineTo(x(polygon[i]), y(polygon[i]));
    if (fillStyle) {
        context.lineTo(x(polygon[0]), y(polygon[0])); //back to start
        context.fillStyle = fillStyle;
        context.fill();
    } else {
        context.lineWidth = 5;
    }
    context.stroke();
    context.closePath();
}

function drawRef(context, polygon) {
    const centroid = getRef(polygon);
    drawCircle(context, centroid, 10, 'red', true);
}
function drawCircle(context, vertex, radius = 5, fill, stroke = false) {
    context.beginPath();
    context.arc(x(vertex), y(vertex), radius, 0, 2 * Math.PI);
    context.fillStyle = fill;
    context.fill();
    if (stroke) {
        context.lineWidth = 1;
        context.strokeStyle = '#003300';
        context.stroke();
    }
    context.closePath();
}

function avg(a, b) {
    return ~~((a + b)/2);
}
function drawLines(context, polygon) {
    const ref = getRef(polygon);
    context.beginPath();
    for (const vertex of polygon) {
        context.moveTo(x(ref), y(ref));
        context.lineTo(x(vertex), y(vertex));
        context.font = "18px Arial";
        context.fillStyle = '#5a5ce0';
        context.fillText(`${Math.round(getAngle(ref, vertex))}°`, avg(x(ref), x(vertex)), avg(y(ref), y(vertex)));
    }
    context.lineWidth = 2;
    context.strokeStyle = '#5a5ce0';
    context.stroke();
    context.closePath();
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

function drawGrid(ctx) {
    ctx.strokeStyle = 'lightgrey';
    ctx.fillStyle = 'lightgrey';
    ctx.font = '18px Arial';
    ctx.fillText('0', 2, -2);
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = -size / 2; i < size / 2; i += scale) {
        ctx.moveTo(-size / 2, i);
        ctx.lineTo(size / 2, i);
    }
    for (let i = -size / 2; i < size / 2; i += scale) {
        ctx.moveTo(i, -size / 2);
        ctx.lineTo(i, size / 2);
    }
    ctx.stroke();
    ctx.closePath();
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
