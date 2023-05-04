const { readFileSync } = require("fs");
const BoundingBox = require("./lib/bounding-box");

const POINT_RADIUS = 0.2;

const SIZE_SCALE_FACTOR = 40;
const RENDER_SCALE_FACTOR = 10;

const viewBox = new BoundingBox();

const svgComponents = [];

for (const set of process.argv.slice(2)) {
    const [name, ...params] = set.split("@");

    const featureSet = JSON.parse(readFileSync(`./data/${name}.json`));

    const { boundingBox, svg } = renderFeatureSetSVG(featureSet, parseParams(params.join(",")));

    svgComponents.push(svg);
    viewBox.merge(boundingBox);
}

shuffle(svgComponents);

viewBox.margin(viewBox.width() * 0.1);

const svg = `<svg 
xmlns="http://www.w3.org/2000/svg" 
version="1.1" 
xmlns:xlink="http://www.w3.org/1999/xlink" width="${viewBox.width()*SIZE_SCALE_FACTOR}" height="${viewBox.height()*SIZE_SCALE_FACTOR}" viewBox="${viewBox.toViewBox()}"> 
    ${svgComponents.join("")}
</svg>`;

console.log(svg);

function parseParams(text) {
    const r = {};

    for(const param of text.split(",")) {
        const [k, v] = param.split(/[:=]/);
        r[k] = v;
    }
    return r;
}

function renderFeatureSetSVG(featureSet, params) {
    const box = new BoundingBox();
    const svgs = [];

    for (const feature of featureSet.features) {
        const { boundingBox, svg } = renderFeature(feature, params);
        svgs.push(...svg);
        box.merge(boundingBox);
    }

    return { boundingBox: box, svg: svgs };
}

function renderFeature(feature, params) {
    return renderGeometry(feature.geometry, params);
}

function renderGeometry(geometry, params) {
    switch (geometry.type) {
        case "Polygon": return renderPolygon(geometry, params);
        case "Point": return renderPoint(geometry, params);
        case "MultiPolygon": return renderMultiPolygon(geometry, params);
        default: console.error(geometry.type);
    }
}

function renderMultiPolygon(mPolygon, params) {
    const box = new BoundingBox();

    const svgs = [];

    for (const polyCoords of mPolygon.coordinates) {
        const { boundingBox, svg } = renderPolygon({ coordinates: polyCoords }, params);

        box.merge(boundingBox);
        svgs.push(svg);
    }

    return {
        svg: svgs,
        boundingBox: box
    }
}

function renderPoint(point, params) {
    const [svgX, svgY] = coordToSVGCoords(point.coordinates);
    return {
        svg: [`<circle cx="${svgX}" cy="${svgY}" r="${params.radius || POINT_RADIUS}" fill="${params.color}"/>`],
        boundingBox: new BoundingBox(svgX, svgY, 0, 0)
    }
}

function renderPolygon(polygon, params) {
    const box = new BoundingBox();
    return {
        svg: [`<path 
            fill="${params.fill || params.color}"
            stroke-width="${params["stroke-width"] || (POINT_RADIUS / 2)}"
            stroke="${params.stroke || params.color}"
            d="${polygon.coordinates.map(ring =>
            `M${coordToSVGCoords(ring[0])} ${ring.map(coord => {
                const svgCoord = coordToSVGCoords(coord);
                box.expandToPoint(...svgCoord);
                return `L${svgCoord}`;
            }).join(" ")
            }`
        )}"/>`],
        boundingBox: box
    }
}

function coordToSVGCoords(coord) {
    return [coord[0]*RENDER_SCALE_FACTOR, -coord[1]*RENDER_SCALE_FACTOR];
}