import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  observeCountyChanges, selectedCountyRkiId, selectOrToggleCounty
} from '../county-selection';
import { loadCountyData } from '../data-loading';
import { RkiCountyFeatureAttributes, RkiFeatureData } from '../data-loading/types';
import { getElementOrThrow } from '../helpers';
import { observeDateChanges } from '../history-animation/date-selection';
import { addEuropeanMap, addStateBoundaries } from './background';
import { addCities } from './cities';
import { colorForIncidence } from './label-scheme';
import {
  CountyMapInfo, loadCities, loadCountyMap, loadEuMap, loadStateMap, rkiFeatureByMapId
} from './map-helpers';


type CountyFeature = GeoJSON.Feature<GeoJSON.Polygon, CountyMapInfo>;
type CountyMap = GeoJSON.FeatureCollection<GeoJSON.MultiPolygon, CountyMapInfo>;

const map = L
  .map(getMapElement())
  .setView([51.163361, 10.447683], 6);

map.zoomControl.setPosition('bottomright');

let countiesLayer: L.GeoJSON<CountyMapInfo>;

function getMapElement() {
  return getElementOrThrow<HTMLDivElement>('div.map');
}

export function loadAndDisplayMap(): void {
  renderData(loadData());
}

async function rerenderWithUpdatedData() {
  const rkiData: RkiFeatureData<RkiCountyFeatureAttributes> = await loadCountyData();
  const countiesGeoJson = await loadCountyMap();

  addCountiesToMap(rkiData, countiesGeoJson);

  highlightSelectedCounty(rkiData, countiesGeoJson);
}

async function loadData() {
  const rkiDataResponse = loadCountyData();
  const countiesResponse = loadCountyMap();

  const rkiData = await rkiDataResponse;
  const countiesGeoJson = await countiesResponse;

  return { rkiData, countiesGeoJson };
}

async function renderData(data: ReturnType<typeof loadData>) {
  const { rkiData, countiesGeoJson } = await data;

  addCountiesToMap(rkiData, countiesGeoJson);

  highlightSelectedCounty(rkiData, countiesGeoJson);
  highlightCountyWhenSelected(rkiData, countiesGeoJson);

  window.setTimeout(drawBackground, 0);
  window.setTimeout(drawCities, 0);
}

async function drawBackground() {
  addStateBoundaries(map, await loadStateMap());
  addEuropeanMap(map, await loadEuMap());
}

async function drawCities() {
  addCities(map, await loadCities());
}

export function addCountiesToMap(
  rkiData: RkiFeatureData<RkiCountyFeatureAttributes>,
  countiesGeoJson: CountyMap
): void {

  const colorByFeature: L.StyleFunction<CountyMapInfo> = (feature) => {
    if (feature?.properties == undefined) {
      return {};
    }
    const data = rkiFeatureByMapId(rkiData, feature?.properties.ID_3);
    return {
      color: '#888',
      weight: 0.5,
      fillColor: colorForIncidence(data?.cases7_per_100k),
      fillOpacity: 1,
      stroke: true,
    };
  };

  if (countiesLayer) {
    countiesLayer.setStyle(colorByFeature);
    return;
  }

  countiesLayer = L.geoJSON<CountyMapInfo>(countiesGeoJson, {
    style: colorByFeature,
    onEachFeature: function (feature, layer) {
      const rkiId = rkiFeatureByMapId(rkiData, feature?.properties.ID_3)?.OBJECTID;
      layer.on('click', () => {
        if (rkiId) {
          selectOrToggleCounty(rkiId);
        }
      });
    },
  }).bindTooltip(getCountyTooltip, { direction: 'top' })
    .addTo(map)
    .bringToBack();


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
export function highlightSelectedCounty(
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

export function initCallbacks() {
  observeDateChanges(rerenderWithUpdatedData);
}
