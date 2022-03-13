import { getAnimationDate } from '../history-animation/date-selection';
import { DataLoader, ParametrizedDataLoader, PermanentlyCachingDataLoader } from './data-loaders';
import {
  RkiCountyFeatureAttributes, RkiDailyAggregatedData, RkiDailyNewCasesData, RkiDiffData,
  RkiFeatureData, RkiSummedDayData, RkiTotalCasesPerDay, RkiTotalRecoveredByCounty
} from './types';

/* eslint-disable max-len */
const AGGREGATED_DATA_URL= 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/rki_key_data_v/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=AdmUnitId%20asc&resultOffset=0&resultRecordCount=1&resultType=standard&cacheHint=true';
const COUNTY_DATA_URL = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=*&returnGeometry=false&outSR=4326&f=json';
const HISTORIC_COUNTY_DATA_URL_FACTORY = (year: number, month: number, day: number) => `/assets/historic-county-data/county-data-${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}.json`;

const TODAYS_SUMMED_DATA_URL = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?f=json&where=1=1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=[{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22cases%22,%22outStatisticFieldName%22:%22totalCases%22},{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22deaths%22,%22outStatisticFieldName%22:%22totalDeaths%22}]&resultType=standard&cacheHint=true';
const TODAYS_DEATHS_DIFF_BY_COUNTY_URL = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?f=json&groupByFieldsForStatistics=Landkreis&where=NeuerTodesfall%20IN(1%2C%20-1)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22AnzahlTodesfall%22%2C%22outStatisticFieldName%22%3A%22diff%22%7D%5D&resultType=standard&cacheHint=true';
const TODAYS_CASES_DIFF_BY_COUNTY_URL = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?f=json&groupByFieldsForStatistics=Landkreis&where=NeuerFall%20IN(1,%20-1)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=[{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22AnzahlFall%22,%22outStatisticFieldName%22:%22diff%22}]&resultType=standard&cacheHint=true';

const DAILY_INFECTIONS_URL = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=json&outStatistics=[%20{%20%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22AnzahlFall%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelle%22%20}%20]&groupByFieldsForStatistics=Refdatum,IstErkrankungsbeginn&orderByFields=Refdatum%20desc';
const DAILY_INFECTIONS_OF_COUNTY_URL_FACTORY = (county: string) => `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=Landkreis='${county}'&outFields=*&outSR=4326&f=json&outStatistics=[%20{%20%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22AnzahlFall%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelle%22%20}%20]&groupByFieldsForStatistics=Refdatum,IstErkrankungsbeginn&orderByFields=Refdatum%20desc`;
const TOTAL_INFECTIONS_PER_DAY_URL = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=AnzahlFall>0&outFields=*&outSR=4326&f=json&groupByFieldsForStatistics=Meldedatum,NeuerFall&outStatistics=[{%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22AnzahlFall%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelleTag%22}]&orderBy=Meldedatum';
const TOTAL_INFECTIONS_PER_DAY_OF_COUNTY_URL_FACTORY = (county: string) => `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=AnzahlFall>0 AND Landkreis='${county}'&outFields=*&outSR=4326&f=json&groupByFieldsForStatistics=Meldedatum,NeuerFall&outStatistics=[{%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22AnzahlFall%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelleTag%22}]&orderBy=Meldedatum`;

const TOTAL_RECOVERED_BY_COUNTY_URL = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_hubv/FeatureServer/0/query?where=AnzahlGenesen>0&outFields=*&outSR=4326&f=json&groupByFieldsForStatistics=Landkreis&outStatistics=[{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22AnzahlGenesen%22,%22outStatisticFieldName%22:%22SummeGenesen%22}]';

const countyDataLoader = new DataLoader<RkiFeatureData<RkiCountyFeatureAttributes>>(COUNTY_DATA_URL);
export const loadTodaysCountyData = countyDataLoader.createBoundLoadFunction();

const historicCountyDataLoader =
  PermanentlyCachingDataLoader.open<RkiFeatureData<RkiCountyFeatureAttributes>, [number, number, number]>('historicCountyData-v1', HISTORIC_COUNTY_DATA_URL_FACTORY);
export const loadHistoricCountyData =
  async (...args: [number, number, number]): Promise<RkiFeatureData<RkiCountyFeatureAttributes>> => (await historicCountyDataLoader).load(...args);

export function loadCountyData(): Promise<RkiFeatureData<RkiCountyFeatureAttributes>> {
  const date = getAnimationDate();
  return date == 'today' ? loadTodaysCountyData() : loadHistoricCountyData(...date);
}

const todaysAggregatedDataLoader = new DataLoader<RkiFeatureData<RkiDailyAggregatedData>>(AGGREGATED_DATA_URL);
export const loadTodaysAggregateData = todaysAggregatedDataLoader.createBoundLoadFunction();

const todaysSummedDataLoader = new DataLoader<RkiFeatureData<RkiSummedDayData>>(TODAYS_SUMMED_DATA_URL);
export const loadTodaysSummedData = todaysSummedDataLoader.createBoundLoadFunction();

const todaysCasesDiffLoader = new DataLoader<RkiFeatureData<RkiDiffData>>(TODAYS_CASES_DIFF_BY_COUNTY_URL);
export const loadTodaysCasesDiff = todaysCasesDiffLoader.createBoundLoadFunction();

const todaysDeathsDiffLoader = new DataLoader<RkiFeatureData<RkiDiffData>>(TODAYS_DEATHS_DIFF_BY_COUNTY_URL);
export const loadTodaysDeathsDiff = todaysDeathsDiffLoader.createBoundLoadFunction();

const dailyInfectionsLoader = new DataLoader<RkiFeatureData<RkiDailyNewCasesData>>(DAILY_INFECTIONS_URL);
export const loadDailyInfections = dailyInfectionsLoader.createBoundLoadFunction();

const totalCasesPerDayLoader = new DataLoader<RkiFeatureData<RkiTotalCasesPerDay>>(TOTAL_INFECTIONS_PER_DAY_URL);
export const loadTotalCasesReportedPerDay = totalCasesPerDayLoader.createBoundLoadFunction();

const dailyInfectionsOfCountyLoader = new ParametrizedDataLoader<RkiFeatureData<RkiDailyNewCasesData>, [string]>(DAILY_INFECTIONS_OF_COUNTY_URL_FACTORY);
export const loadDailyInfectionsOfCounty = dailyInfectionsOfCountyLoader.createBoundLoadFunction();

const totalCasesPerDayOfCountyLoader = new ParametrizedDataLoader<RkiFeatureData<RkiTotalCasesPerDay>, [string]>(TOTAL_INFECTIONS_PER_DAY_OF_COUNTY_URL_FACTORY);
export const loadTotalCasesReportedPerDayOfCounty = totalCasesPerDayOfCountyLoader.createBoundLoadFunction();

const totalRecoveredByCountyLoader = new DataLoader<RkiFeatureData<RkiTotalRecoveredByCounty>>(TOTAL_RECOVERED_BY_COUNTY_URL);
export const loadTotalRecoveredByCounty = totalRecoveredByCountyLoader.createBoundLoadFunction();
