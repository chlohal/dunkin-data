const DENSITY_RADIUS = 5000;
const RADIUS_OF_THE_EARTH_M = 6371000;

const data = require("./data/dunkin-location.json");
const pointInsidePolyline = require("./lib/point-inside-polyline");
const shuffle = require("./lib/shuffle");


const dunkins = data.features.filter(x=>x.properties.state == "MA");

const maTowns = require("./data/ma-towns-location.json").features;

const sparseDunkins = trimDenseDunkins(dunkins);

console.log(JSON.stringify({
    type: "FeatureCollection",
    features: sparseDunkins
}));

function trimDenseDunkins(dunkins) {
    const sparseDunkins = dunkins.slice(0);

    shuffle(sparseDunkins);

    for(const targetDunkin of sparseDunkins) {
        const neighbors = dunkinsWithinRadius(dunkins, targetDunkin, DENSITY_RADIUS);

        for(const neighborDunkin of neighbors) {
            if(neighborDunkin == targetDunkin) continue;
            
            const index = sparseDunkins.indexOf(neighborDunkin);
            if(index != -1) sparseDunkins.splice(index, 1);
        }
    }

    return sparseDunkins;
}

function dunkinsWithinRadius(dunkins, targetDunkin, radiusMeters) {
    return dunkins.filter(x=>distanceMeters(x.geometry, targetDunkin.geometry) < radiusMeters);
}

//https://en.wikipedia.org/wiki/Haversine_formula
function distanceMeters(pointA, pointB) {
    const [long1, lat1] = pointA.coordinates.map(x=>x*(Math.PI / 180)),
        [long2, lat2] = pointB.coordinates.map(x=>x*(Math.PI / 180));
    
    return 2 * RADIUS_OF_THE_EARTH_M * Math.asin(Math.sqrt(
        (Math.sin((lat2 - lat1) / 2) ** 2) 
        + Math.cos(lat1)
        * Math.cos(lat2)
        * Math.cos(lat2)
        * (Math.sin((long2 - long1) / 2) ** 2)
    ));
}