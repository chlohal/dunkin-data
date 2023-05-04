const { readFileSync } = require("fs");

const data = JSON.parse(readFileSync("./data.json").toString()).data.storeAttributes;

const geoJSON = {
    type:"FeatureCollection",
    features: data.map(x=>({
        type: "Feature",
        geometry: swapCoords(JSON.parse(x.geoJson)),
        properties: x
    }))
};

console.log(JSON.stringify(geoJSON));


function swapCoords(dunkinGeoJSON) {
    if(dunkinGeoJSON.type != "Point") throw new Error("what bad");
    return {
        type: "Point",
        coordinates: [dunkinGeoJSON.longitude, dunkinGeoJSON.latitude]
    }
}