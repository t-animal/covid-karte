import L from 'leaflet';

export function addStateBoundaries(map: L.Map, preloadedMap: GeoJSON.FeatureCollection): void {
  L.geoJSON(preloadedMap, {
    style: {
      color: '#888',
      weight: 2,
      fill: false
    }
  }).addTo(map);
}

export function addEuropeanMap(map: L.Map, preloadedMap: GeoJSON.FeatureCollection): void {
  L.geoJSON(preloadedMap, {
    style: {
      color: '#313232',
      fillColor: '#393a3a',
      fillOpacity: 1,
      weight: 2,
    }
  }).addTo(map);
}
