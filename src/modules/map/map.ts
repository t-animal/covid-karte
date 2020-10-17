import 'leaflet/dist/leaflet.css';

import L from 'leaflet';

import {
  observeCountyChanges, selectedCountyRkiId, selectOrToggleCounty
} from '../county-selection';
import { loadCountyData, RkiCountyFeatureAttributes, RkiFeatureData } from '../data-loading';
import { getElementOrThrow } from '../helpers';
import {
  CityInfo, color, CountyMapInfo, loadCities, loadCountyMap, loadEuMap, loadStateMap,
  rkiFeatureByMapId
} from './map-helpers';

type CountyFeature = GeoJSON.Feature<GeoJSON.Polygon, CountyMapInfo>;
type CountyMap = GeoJSON.FeatureCollection<GeoJSON.MultiPolygon, CountyMapInfo>;

const map = L
  .map(getMapElement())
  .setView([51.163361, 10.447683], 6);

map.zoomControl.setPosition('bottomright');

function getMapElement() {
  return getElementOrThrow<HTMLDivElement>('div.map');
}

export function loadAndDisplayMap(): void {
  renderData(loadData());
}

async function loadData() {
  const rkiDataResponse = loadCountyData();
  const countiesResponse = loadCountyMap();

  const rkiData = await rkiDataResponse;
  const countiesGeoJson = await countiesResponse;

  return {rkiData, countiesGeoJson};
}

async function renderData(data: ReturnType<typeof loadData>) {
  const {rkiData, countiesGeoJson} = await data;

  addCountiesToMap(rkiData, countiesGeoJson);

  highlightSelectedCounty(rkiData, countiesGeoJson);
  highlightCountyWhenSelected(rkiData, countiesGeoJson);

  window.setTimeout(drawBackground, 0);
  window.setTimeout(drawCities, 0);
}

async function drawBackground() {
  addStateBoundaries(await loadStateMap());
  addEuropeanMap(await loadEuMap());
}

async function drawCities() {
  addCities(await loadCities());
}

function addCountiesToMap(
  rkiData: RkiFeatureData<RkiCountyFeatureAttributes>,
  countiesGeoJson: CountyMap
) {
  L.geoJSON<CountyMapInfo>(countiesGeoJson, {
    style: function (feature) {
      if (feature?.properties == undefined) {
        return {};
      }
      const data = rkiFeatureByMapId(rkiData, feature?.properties.ID_3);
      return {
        color: '#888',
        weight: 0.5,
        fillColor: color(data?.cases7_per_100k),
        fillOpacity: 1,
        stroke: true,
      };
    },
    onEachFeature: function (feature, layer) {
      const rkiId = rkiFeatureByMapId(rkiData, feature?.properties.ID_3)?.OBJECTID;
      layer.on('click', () => {
        if (rkiId) {
          selectOrToggleCounty(rkiId);
        }
      });
    },
  }).bindTooltip(getCountyTooltip, { direction: 'top' })
    .addTo(map);


  function getCountyTooltip(layer: L.Layer & { feature?: CountyFeature }): string {
    if (layer?.feature?.properties == undefined) {
      return '';
    }
    const data = rkiFeatureByMapId(rkiData, layer.feature.properties.ID_3);
    if (data == null) {
      const prop = layer.feature.properties;
      return `<b>${prop.NAME_3}, ${prop.NAME_2}</b><br>
			Noch nicht den RKI Daten zugeordnet<br><br>

			<b>Mithelfen?</b> Bitte finde in den RKI Daten den passenden Datensatz.<br>
			Bitte teile mir die ID des RKI Datensatzes und die Zahl <b>'${prop.ID_3}'</b> mit.`;
    }
    return data.county;
  }
}

function highlightCountyWhenSelected(
  rkiData: RkiFeatureData<RkiCountyFeatureAttributes>,
  counties: CountyMap
) {
  observeCountyChanges(() => highlightSelectedCounty(rkiData, counties));
}

let highlightLayer: L.GeoJSON | null = null;
function highlightSelectedCounty(
  rkiData: RkiFeatureData<RkiCountyFeatureAttributes>,
  counties: CountyMap
): void {
  const countyId = selectedCountyRkiId();
  highlightLayer?.remove();
  if (countyId == null) {
    return;
  }
  for (const county of counties.features) {
    const rkiId = rkiFeatureByMapId(rkiData, county.properties.ID_3)?.OBJECTID;
    if (countyId == rkiId) {
      highlightLayer = new L.GeoJSON(county, { 
        style: { color: '#2f52a0', weight: 3, stroke: true, fill: false }
      });
      highlightLayer.addTo(map);
    }
  }
}


async function addStateBoundaries(preloadedMap: GeoJSON.FeatureCollection) {
  L.geoJSON(preloadedMap, {
    style: {
      color: '#888',
      weight: 2,
      fill: false
    }
  }).addTo(map);
}

async function addEuropeanMap(preloadedMap: GeoJSON.FeatureCollection) {
  L.geoJSON(preloadedMap, {
    style: {
      color: '#313232',
      fillColor: '#393a3a',
      fillOpacity: 1,
      weight: 2,
    }
  }).addTo(map);

  getMapElement().style.background = '#1d2224';
}

async function addCities(preloadedCities: CityInfo[]){
  const hugeCities: CityInfo[] = [];
  const largeCities: CityInfo[] = [];
  const mediumCities: CityInfo[] = [];
  const smallCities: CityInfo[] = [];

  const sortedCities = [...preloadedCities];
  sortedCities.sort((a, b) => b.population - a.population);

  function distance(a:CityInfo, b: CityInfo) {
    const [a1, a2] = a.coordinates;
    const [b1, b2] = b.coordinates;
    return Math.sqrt(Math.pow(a1 - b1, 2) + Math.pow(a2 - b2, 2));
  }
  const distanceTo = (a: CityInfo) => ((b: CityInfo) => distance(a, b));

  for(const city of sortedCities) {
    const alreadyIncluded = [...hugeCities];
    const isNotCloseToAnyIncluded = (city: CityInfo, minDistance: number) =>
      alreadyIncluded.map(distanceTo(city)).every(distance => distance > minDistance);

    if(city.population > 100000 && isNotCloseToAnyIncluded(city, 1.4)) {
      hugeCities.push(city);
      continue;
    }

    alreadyIncluded.push(...largeCities);
    if(city.population > 60000 && isNotCloseToAnyIncluded(city, 0.5)) {
      largeCities.push(city);
      continue;
    }

    alreadyIncluded.push(...mediumCities);
    if(city.population > 30000 && isNotCloseToAnyIncluded(city, 0.1)) {
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
    const icon = new L.DivIcon({className: 'city-label', html: `<div>${city.cityLabel}</div>`});
    return L.marker(city.coordinates, {icon});
  };
  
  hugeCities.map(cityToMarker).forEach(marker => hugeCitiesMarkers.addLayer(marker));
  largeCities.map(cityToMarker).forEach(marker => largeCitiesMarkers.addLayer(marker));
  mediumCities.map(cityToMarker).forEach(marker => mediumCitiesMarkers.addLayer(marker));
  smallCities.map(cityToMarker).forEach(marker => smallCitiesMarkers.addLayer(marker));

  map.addLayer(hugeCitiesMarkers);

  map.on('zoomend', function() {
    if (map.getZoom() > 6){
      map.addLayer(largeCitiesMarkers);
    } else {
      map.removeLayer(largeCitiesMarkers);
    }
    if (map.getZoom() > 8){
      map.addLayer(mediumCitiesMarkers);
    } else {
      map.removeLayer(mediumCitiesMarkers);
    }
    if (map.getZoom() > 10){
      map.addLayer(smallCitiesMarkers);
    } else {
      map.removeLayer(smallCitiesMarkers);
    }
  });
}