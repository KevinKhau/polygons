import {getAngle, getRef} from "./geometry.js";
import {scale, size} from "./polygons.js";

const x = vertex => vertex[0] * scale;
const y = vertex => vertex[1] * scale;

export function drawGrid(ctx) {
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

export function drawCircle(context, vertex, radius = 5, fill, stroke = false) {
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
export function drawLines(context, polygon) {
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

/**
 * Outlines the initial vertices in figure #1.
 *
 * @param context
 * @param polygon
 * @param strokeStyle
 */
export function drawVertices(context, polygon, strokeStyle) {
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

export function drawPolygon(context, polygon, strokeStyle, fillStyle) {
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
