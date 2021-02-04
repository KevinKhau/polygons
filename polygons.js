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
    context.moveTo(polygon[0][0], polygon[0][1]); //first vertex
    for (var i = 1; i < polygon.length; i++)
        context.lineTo(polygon[i][0], polygon[i][1]);
    context.lineTo(polygon[0][0], polygon[0][1]); //back to start
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

const select = function(n) {
    var context = document.getElementById("canvas").getContext("2d");
    context.clearRect(0, 0, 500, 500);
    document.querySelector('.initial').textContent = polygons[n];
    const sortedPolygon = orderVertices ? sort(polygons[n]) : polygons[n];
    drawPolygon(context, sortedPolygon, "#888", "#88f");
    drawRef(context, polygons[n]);
    drawLines(context, polygons[n]);
    document.querySelector('.sorted').textContent = polygons[n];
};

const polygons = [
    [[400, 250], [100, 300], [100, 100], [300, 400], [300, 0]],
    [[300, 300], [300, 100], [-100, 400], [0, 0]],
    [[50, 150], [150, 350], [350, 150], [200, 50], [250, 320], [100, 250], [350, 250], [200, 250]],
    [[400, 300], [100, 100], [100, 300], [300, 100]]
];

const buttons = document.querySelectorAll("button");
for (let counter = 0; counter < buttons.length; counter++) {
    buttons[counter].addEventListener("click", function(){
        window.onload = select(counter);
    });
}
window.onload = select(0);
