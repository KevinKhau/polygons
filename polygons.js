import {battles} from './input.js';
/* Set reference vertex for clockwise sorting here */
import {clip, sort, getRef, getAngle} from './geometry.js';

console.log(battles);

const x = vertex => vertex[0] * scale;
const y = vertex => vertex[1] * scale;

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
        context.lineWidth = 2;
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
        context.fillStyle = "green";
        context.fillText(`${Math.round(getAngle(ref, vertex))}°`, avg(x(ref), x(vertex)), avg(y(ref), y(vertex)));
    }
    context.lineWidth = 2;
    context.strokeStyle = '#5de337';
    context.stroke();
    context.closePath();
}

function select(battleName) {
    const {A, B} = battles[battleName];
    document.querySelector('span.initial').textContent = A;

    setScale(A, B);
    canvas.forEach(c => c.clearRect(-size, -size, size * 2, size * 2));
    drawGrids();

    drawVertices(initialCanvas, A, '#88f');
    drawVertices(initialCanvas, B, '#8f8');

    const sortedA = sort(A), sortedB = sort(B);

    drawPolygon(sortingCanvas, sortedB, "#888", '#8f8');
    drawRef(sortingCanvas, sortedB);
    drawLines(sortingCanvas, sortedB);

    drawPolygon(clippingCanvas, A, "#888", "#88f");
    drawRef(clippingCanvas, A);
    drawLines(clippingCanvas, A);
    drawPolygon(clippingCanvas, B, '#888','#8f8');
    drawPolygon(clippingCanvas, clip(sortedA, sortedB), '#000','#0ff');
    document.querySelector('span.sorted').textContent = sortedA;
}

let scale = 200;
const initialCanvas = document.querySelector('canvas.initial ').getContext("2d");
const sortingCanvas = document.querySelector('canvas.sorting').getContext("2d");
const clippingCanvas = document.querySelector('canvas.clipping').getContext("2d");
const areaCanvas = document.querySelector('canvas.area').getContext("2d");

const canvas = [initialCanvas, sortingCanvas, clippingCanvas, areaCanvas];
const grids = [...document.querySelectorAll('canvas.grid')].map(c => c.getContext('2d'));
const size = 400;

function setCanvas() {
    canvas.forEach(c => {
            c.canvas.width = size;
            c.canvas.height = size;
            c.translate(size / 2, size / 2);
        }
    );
}
function drawGrids() {
    grids.forEach(ctx => {
        ctx.strokeStyle = 'lightgrey';
        ctx.fillStyle = 'blue';
        ctx.font = '12px';
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
    })
}

/**
 * Sets the scale, size in pixels of one unit, units ranging from -16 to +16.
 * @param A
 * @param B
 */
function setScale(A, B) {
    scale = size / Math.max(...A.flat(2).map(Math.abs), ...B.flat(2).map(Math.abs)) / 2;
}

const buttons = document.querySelectorAll("button");
Object.keys(battles).forEach((battle, index) => {
    buttons[index].textContent = battle.charAt(0).toUpperCase() + battle.slice(1).replace(/([A-Z])/g, ' $1').trim();
    buttons[index].addEventListener("click", () => window.onload = select(battle));
})

setCanvas();
window.onload = select('firstContact');
