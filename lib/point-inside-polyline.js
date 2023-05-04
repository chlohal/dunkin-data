module.exports = function pointInsidePolyline(point, polyline) {
    const lineCoords = polyline.coordinates[0];
    const p = point.coordinates;

    let rayIntersects = 0;

    for (let i = 0; i < lineCoords.length - 1; i++) {
        if(rayFromPointIntersectsLine(p, [lineCoords[i], lineCoords[i + 1]])) {
            rayIntersects++;
        }
    }
    //check line from last point to first point
    if(rayFromPointIntersectsLine(p, [lineCoords[lineCoords.length - 1], lineCoords[0]])) {
        rayIntersects++;
    }

    return rayIntersects % 2 == 1;
}

function rayFromPointIntersectsLine(point, line) {
    const p = point;
    const [a, b] = line;

    const low = Math.min(a[1], b[1]), high = Math.max(a[1], a[1]);

    const m = (a[1] - b[1]) / (a[0] - b[0]);

    if (p[1] > low && p[1] < high) {
        if (p[1] - a[1] < m * (p[0] - a[0])) {
            return true;
        }
    }

    return false;
}