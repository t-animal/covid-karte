import L from 'leaflet';
import { CityInfo } from './map-helpers';


export async function addCities(map: L.Map, preloadedCities: CityInfo[]): Promise<void> {
  const hugeCities: CityInfo[] = [];
  const largeCities: CityInfo[] = [];
  const mediumCities: CityInfo[] = [];
  const smallCities: CityInfo[] = [];

  const sortedCities = [...preloadedCities];
  sortedCities.sort((a, b) => b.population - a.population);

  function distance(a: CityInfo, b: CityInfo) {
    const [a1, a2] = a.coordinates;
    const [b1, b2] = b.coordinates;
    return Math.sqrt(Math.pow(a1 - b1, 2) + Math.pow(a2 - b2, 2));
  }
  const distanceTo = (a: CityInfo) => ((b: CityInfo) => distance(a, b));

  for (const city of sortedCities) {
    const alreadyIncluded = [...hugeCities];
    const isNotCloseToAnyIncluded = (city: CityInfo, minDistance: number) =>
      alreadyIncluded.map(distanceTo(city)).every(distance => distance > minDistance);

    if (city.population > 100000 && isNotCloseToAnyIncluded(city, 1.4)) {
      hugeCities.push(city);
      continue;
    }

    alreadyIncluded.push(...largeCities);
    if (city.population > 60000 && isNotCloseToAnyIncluded(city, 0.5)) {
      largeCities.push(city);
      continue;
    }

    alreadyIncluded.push(...mediumCities);
    if (city.population > 30000 && isNotCloseToAnyIncluded(city, 0.1)) {
      mediumCities.push(city);
      continue;
    }

    smallCities.push(city);
  }

  const hugeCitiesMarkers = new L.FeatureGroup();
  const largeCitiesMarkers = new L.FeatureGroup();
  const mediumCitiesMarkers = new L.FeatureGroup();
  const smallCitiesMarkers = new L.FeatureGroup();

  const cityToMarker = (city: CityInfo) => {
    const icon = new L.DivIcon({ className: 'city-label', html: `<div>${city.cityLabel}</div>` });
    return L.marker(city.coordinates, { icon });
  };

  hugeCities.map(cityToMarker).forEach(marker => hugeCitiesMarkers.addLayer(marker));
  largeCities.map(cityToMarker).forEach(marker => largeCitiesMarkers.addLayer(marker));
  mediumCities.map(cityToMarker).forEach(marker => mediumCitiesMarkers.addLayer(marker));
  smallCities.map(cityToMarker).forEach(marker => smallCitiesMarkers.addLayer(marker));

  map.addLayer(hugeCitiesMarkers);

  map.on('zoomend', function () {
    if (map.getZoom() > 6) {
      map.addLayer(largeCitiesMarkers);
    } else {
      map.removeLayer(largeCitiesMarkers);
    }
    if (map.getZoom() > 8) {
      map.addLayer(mediumCitiesMarkers);
    } else {
      map.removeLayer(mediumCitiesMarkers);
    }
    if (map.getZoom() > 10) {
      map.addLayer(smallCitiesMarkers);
    } else {
      map.removeLayer(smallCitiesMarkers);
    }
  });
}
