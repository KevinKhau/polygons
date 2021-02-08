/* Contains all the geometry-related functions */

export const getAngle = (vertex, other) => Math.atan2(other[1] - vertex[1], other[0] - vertex[0]) * 180 / Math.PI;

export const getCentroid = polygon => polygon.reduce((acc, vertex, _, {length}) => [acc[0] + vertex[0] / length, acc[1] + vertex[1] / length], [0, 0]);
export const getLeftBottom = polygon => polygon.sort((a, b) => a[0] - b[0] !== 0 ? a[0] - b[0] : b[1] - a[1])[0];

export let getRef = getCentroid;
export function changeRef() {
    getRef = getRef === getLeftBottom ? getCentroid : getLeftBottom;
}

/* Sort the polygon vertices in clockwise order */
export function sort(polygon) {
    const ref = getRef(polygon);
    return [...polygon].sort((u, v) => {
        if (u === ref) return -180;
        else if (v === ref) return 180;
        else return getAngle(ref, u) - getAngle(ref, v)
    });
}

/**
 * Sutherland - Hodgman clipping algorithm
 *
 * @param subjectPolygon
 * @param clipPolygon
 * @return {*[]}
 */
export function clip (subjectPolygon, clipPolygon) {
    let cp1, cp2, s, e;
    let inside = function (p) {
        return (cp2[0]-cp1[0])*(p[1]-cp1[1]) > (cp2[1]-cp1[1])*(p[0]-cp1[0]);
    };
    let intersection = function () {
        let dc = [ cp1[0] - cp2[0], cp1[1] - cp2[1] ],
            dp = [ s[0] - e[0], s[1] - e[1] ],
            n1 = cp1[0] * cp2[1] - cp1[1] * cp2[0],
            n2 = s[0] * e[1] - s[1] * e[0],
            n3 = 1.0 / (dc[0] * dp[1] - dc[1] * dp[0]);
        return [(n1*dp[0] - n2*dc[0]) * n3, (n1*dp[1] - n2*dc[1]) * n3];
    };
    let outputList = subjectPolygon;
    cp1 = clipPolygon[clipPolygon.length-1];
    for (let j in clipPolygon) {
        cp2 = clipPolygon[j];
        let inputList = outputList;
        outputList = [];
        s = inputList[inputList.length - 1]; //last on the input list
        for (let i in inputList) {
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

/**
 * Get area of a polygon/surface.
 */
export function getArea(polygon) {
    let total = 0;
    for (let i = 0; i < polygon.length; i++) {
        const addX = polygon[i][0]; // x
        const addY = polygon[i === polygon.length - 1 ? 0 : i + 1][1];
        const subX = polygon[i === polygon.length - 1 ? 0 : i + 1][0];
        const subY = polygon[i][1]; //y
        total += (addX * addY * 0.5) - (subX * subY * 0.5);
    }
    return Math.abs(total);
}
