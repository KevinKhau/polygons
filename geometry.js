/* Contains all the geometry-related functions */

export const getAngle = (vertex, other) => Math.atan2(other[1] - vertex[1], other[0] - vertex[0]) * 180 / Math.PI;

const getCentroid = polygon => polygon.reduce((acc, vertex, _, {length}) => [acc[0] + vertex[0] / length, acc[1] + vertex[1] / length], [0, 0]);
const getLeftBottom = polygon => polygon.sort((a, b) => a[0] - b[0] !== 0 ? a[0] - b[0] : b[1] - a[1])[0];
export const getRef = getCentroid;

/* Sort the polygon vertices in clockwise order */
export function sort(polygon) {
    const centroid = getRef(polygon);
    return [...polygon].sort((u, v) => getAngle(centroid, u) - getAngle(centroid, v));
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
