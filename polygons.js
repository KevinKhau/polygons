import {battles} from './input.js';

console.log(battles);

const getAngle = (vertex, other) => Math.atan2(other[1] - vertex[1], other[0] - vertex[0]) * 180 / Math.PI;

const getCentroid = polygon => polygon.reduce((acc, vertex, _, {length}) => [acc[0] + vertex[0] / length, acc[1] + vertex[1] / length], [0, 0]);
const getLeftBottom = polygon => polygon.sort((a, b) => a[0] - b[0] !== 0 ? a[0] - b[0] : b[1] - a[1])[0];
/* Set reference vertex here */
const getRef = getCentroid; // getLeftBottom;
/* Set whether you want to display vertices ordered or not */
const orderVertices = true;

/* Sort the polygon vertices in clockwise order */
function sort(polygon) {
    const centroid = getRef(polygon);
    return [...polygon].sort((u, v) => getAngle(centroid, u) - getAngle(centroid, v));
}

function drawPolygon(context, polygon, strokeStyle, fillStyle) {
    context.strokeStyle = strokeStyle;
    context.fillStyle = fillStyle;
    context.beginPath();
    context.moveTo(polygon[0][0] * scale, polygon[0][1] * scale); //first vertex
    for (var i = 1; i < polygon.length; i++)
        context.lineTo(polygon[i][0] * scale, polygon[i][1] * scale);
    context.lineTo(polygon[0][0] * scale, polygon[0][1] * scale); //back to start
    context.fill();
    context.stroke();
    context.closePath();
}

function drawRef(context, polygon) {
    const centroid = getRef(polygon);
    context.beginPath();
    context.arc(centroid[0] * scale, centroid[1] * scale, 10, 0, 2 * Math.PI);
    context.fillStyle = 'red';
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = '#003300';
    context.stroke();
    context.closePath();
}


function avg(a, b) {
    return ~~((a + b)/2);
}
function drawLines(context, polygon) {
    const centroid = getRef(polygon);
    context.beginPath();
    for (const vertex of polygon) {
        context.moveTo(centroid[0] * scale, centroid[1] * scale);
        context.lineTo(vertex[0] * scale, vertex[1] * scale);
        context.font = "30px Arial";
        context.fillStyle = "green";
        context.fillText(`${Math.round(getAngle(centroid, vertex))}°`, avg(centroid[0], vertex[0]) * scale, avg(centroid[1], vertex[1]) * scale);
    }
    context.lineWidth = 2;
    context.strokeStyle = '#5de337';
    context.stroke();
    context.closePath();
}

function clip (subjectPolygon, clipPolygon) {
    var cp1, cp2, s, e;
    var inside = function (p) {
        return (cp2[0]-cp1[0])*(p[1]-cp1[1]) > (cp2[1]-cp1[1])*(p[0]-cp1[0]);
    };
    var intersection = function () {
        var dc = [ cp1[0] - cp2[0], cp1[1] - cp2[1] ],
            dp = [ s[0] - e[0], s[1] - e[1] ],
            n1 = cp1[0] * cp2[1] - cp1[1] * cp2[0],
            n2 = s[0] * e[1] - s[1] * e[0],
            n3 = 1.0 / (dc[0] * dp[1] - dc[1] * dp[0]);
        return [(n1*dp[0] - n2*dc[0]) * n3, (n1*dp[1] - n2*dc[1]) * n3];
    };
    var outputList = subjectPolygon;
    cp1 = clipPolygon[clipPolygon.length-1];
    for (var j in clipPolygon) {
        cp2 = clipPolygon[j];
        var inputList = outputList;
        outputList = [];
        s = inputList[inputList.length - 1]; //last on the input list
        for (var i in inputList) {
            e = inputList[i];
            if (inside(e)) {
                if (!inside(s)) {
                    outputList.push(intersection());
                }
                outputList.push(e);
            }
            else if (inside(s)) {
                outputList.push(intersection());
            }
            s = e;
        }
        cp1 = cp2;
    }
    return outputList;
}

let scale = 200;
function select(battleName) {
    const {A, B} = battles[battleName];
    setScale(A, B);
    canvas.forEach(c => c.clearRect(-size, -size, size * 2, size * 2));
    setGrids();
    console.log({A, B});
    const initialCanvas = document.querySelector('canvas.initial ').getContext("2d");
    drawPolygon(initialCanvas, A, "#888", "#88f");
    drawPolygon(initialCanvas, B, '#888','#8f8');

    document.querySelector('span.initial').textContent = A;
    const sortedA = sort(A), sortedB = sort(B);

    const sortingCanvas = document.querySelector('canvas.sorting').getContext("2d");
    drawPolygon(sortingCanvas, B, "#888", '#8f8');
    drawRef(sortingCanvas, B);
    drawLines(sortingCanvas, B);

    const resultCanvas = document.querySelector('canvas.result').getContext("2d");
    drawPolygon(resultCanvas, A, "#888", "#88f");
    drawRef(resultCanvas, A);
    drawLines(resultCanvas, A);
    drawPolygon(resultCanvas, B, '#888','#8f8');
    drawPolygon(resultCanvas, clip(sortedA, sortedB), '#000','#0ff');
    document.querySelector('span.sorted').textContent = sortedA;
}
const canvas = [...document.querySelectorAll('canvas')].map(c => c.getContext('2d'));
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
function setGrids() {
    grids.forEach(c => {
        c.strokeStyle = 'lightgrey';
        c.beginPath();
        for (let i = -200; i < 200; i += scale) {
            c.moveTo(-200, i);
            c.lineTo(200, i);
        }
        for (let i = -200; i < 200; i += scale) {
            c.moveTo(i, -200);
            c.lineTo(i, 200);
        }
        c.stroke();
        c.closePath();
    })
}

/**
 * Sets the scale, size in pixels of one unit, units ranging from -16 to +16.
 * @param A
 * @param B
 */
function setScale(A, B) {
    scale = size / Math.max(...A.flat(2).map(Math.abs), ...B.flat(2).map(Math.abs));
}

const buttons = document.querySelectorAll("button");
Object.keys(battles).forEach((battle, index) => {
    buttons[index].textContent = battle.charAt(0).toUpperCase() + battle.slice(1).replace(/([A-Z])/g, ' $1').trim();
    buttons[index].addEventListener("click", () => window.onload = select(battle));
})

setCanvas();
window.onload = select('firstContact');
