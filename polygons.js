import {battles} from './input.js';


const polygons = [
    [[400, 250], [100, 300], [100, 100], [300, 400], [300, 0]],
    [[300, 300], [300, 100], [-100, 400], [0, 0]],
    [[50, 150], [150, 350], [350, 150], [200, 50], [250, 320], [100, 250], [350, 250], [200, 250]],
    [[400, 300], [100, 100], [100, 300], [300, 100]]
];
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
    context.arc(centroid[0], centroid[1], 10, 0, 2 * Math.PI);
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
        context.moveTo(centroid[0], centroid[1]);
        context.lineTo(vertex[0], vertex[1]);
        context.font = "30px Arial";
        context.fillStyle = "green";
        context.fillText(`${Math.round(getAngle(centroid, vertex))}°`, avg(centroid[0], vertex[0]), avg(centroid[1], vertex[1]));
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
    console.log({A, B});
    const context = document.getElementById("canvas").getContext("2d");
    context.clearRect(0, 0, 500, 500);
    document.querySelector('.initial').textContent = A;
    const sortedA = sort(A), sortedB = sort(B);
    scale = 50;
    drawPolygon(context, A, "#888", "#88f");
    drawRef(context, A);
    drawLines(context, A);
    drawPolygon(context, B, '#888','#8f8');
    drawPolygon(context, clip(sortedA, sortedB), '#000','#0ff');
    document.querySelector('.sorted').textContent = sortedA;
}

const buttons = document.querySelectorAll("button");
Object.keys(battles).forEach((battle, index) => {
    buttons[index].textContent = battle.charAt(0).toUpperCase() + battle.slice(1).replace(/([A-Z])/g, ' $1').trim();
    buttons[index].addEventListener("click", function(){
        window.onload = select(battle);
    });
})

window.onload = select('firstContact');
