// import 'leaflet/dist/leaflet.css'
import L from 'leaflet';

import {
  observeCountyChanges, selectedCountyRkiId, selectOrToggleCounty
} from '../county-selection';
import { loadCountyData, RkiCountyFeatureAttributes, RkiFeatureData } from '../data-loading';
import { getElementOrThrow } from '../helpers';
import {
  color, CountyMapInfo, loadCountyMap, loadEuMap, loadStateMap, rkiFeatureByMapId
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

export async function loadAndDisplayMap(): Promise<void> {
  const rkiDataResponse = loadCountyData();
  const countiesResponse = loadCountyMap();
  const preloadedStates = loadStateMap();
  const preloadedEurope = loadEuMap();

  const rkiData = await rkiDataResponse;
  const countiesGeoJson = await countiesResponse;

  addCountiesToMap(rkiData, countiesGeoJson);
  highlightCountyWhenSelected(rkiData, countiesGeoJson);

  addStateBoundaries(await preloadedStates);
  addEuropeanMap(await preloadedEurope);
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
  let highlightLayer: L.GeoJSON | null = null;
  observeCountyChanges(() => {
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
  });
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