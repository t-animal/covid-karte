/* eslint-disable max-len */
const COUNTY_DATA_URL = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=*&returnGeometry=false&outSR=4326&f=json';

const TODAYS_SUMMED_DATA_URL = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?f=json&where=1=1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=[{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22cases%22,%22outStatisticFieldName%22:%22totalCases%22},{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22deaths%22,%22outStatisticFieldName%22:%22totalDeaths%22}]&resultType=standard&cacheHint=true';
const TODAYS_DEATHS_DIFF_BY_COUNTY_URL = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?f=json&groupByFieldsForStatistics=Landkreis&where=NeuerTodesfall%20IN(1%2C%20-1)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22AnzahlTodesfall%22%2C%22outStatisticFieldName%22%3A%22diff%22%7D%5D&resultType=standard&cacheHint=true';
const TODAYS_CASES_DIFF_BY_COUNTY_URL = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?f=json&groupByFieldsForStatistics=Landkreis&where=NeuerFall%20IN(1,%20-1)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=[{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22AnzahlFall%22,%22outStatisticFieldName%22:%22diff%22}]&resultType=standard&cacheHint=true';

const DAILY_INFECTIONS_URL = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=json&outStatistics=[%20{%20%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22AnzahlFall%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelle%22%20}%20]&groupByFieldsForStatistics=Refdatum,IstErkrankungsbeginn&orderByFields=Refdatum%20desc';
const DAILY_INFECTIONS_OF_COUNTY_URL_FACTORY = (county: string) => `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=Landkreis='${county}'&outFields=*&outSR=4326&f=json&outStatistics=[%20{%20%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22AnzahlFall%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelle%22%20}%20]&groupByFieldsForStatistics=Refdatum,IstErkrankungsbeginn&orderByFields=Refdatum%20desc`;
const TOTAL_INFECTIONS_PER_DAY_URL = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=AnzahlFall>0&outFields=*&outSR=4326&f=json&groupByFieldsForStatistics=Meldedatum&outStatistics=[{%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22AnzahlFall%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelleTag%22}]&orderBy=Meldedatum';
const TOTAL_INFECTIONS_PER_DAY_OF_COUNTY_URL_FACTORY = (county: string) => `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=AnzahlFall>0 AND Landkreis='${county}'&outFields=*&outSR=4326&f=json&groupByFieldsForStatistics=Meldedatum&outStatistics=[{%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22AnzahlFall%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelleTag%22}]&orderBy=Meldedatum`;

const TOTAL_RECOVERED_BY_COUNTY_URL = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=AnzahlGenesen>0&outFields=*&outSR=4326&f=json&groupByFieldsForStatistics=Landkreis&outStatistics=[{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22AnzahlGenesen%22,%22outStatisticFieldName%22:%22SummeGenesen%22}]';

export type RkiCountyFeatureAttributes = {
  'OBJECTID': number,
  'ADE': number,
  'GF': number,
  'BSG': number,
  'RS': string,
  'AGS': string,
  'SDV_RS': string,
  'GEN': string,
  'BEZ': string,
  'IBZ': number,
  'BEM': string,
  'NBD': string,
  'SN_L': string,
  'SN_R': string,
  'SN_K': string,
  'SN_V1': string,
  'SN_V2': string,
  'SN_G': string,
  'FK_S3': string,
  'NUTS': string,
  'RS_0': string,
  'AGS_0': string,
  'WSK': string,
  'EWZ': number,
  'KFL': number,
  'DEBKG_ID': string,
  'Shape__Area': number,
  'Shape__Length': number,
  'death_rate': number,
  'cases': number,
  'deaths': number,
  'cases_per_100k': number,
  'cases_per_population': number,
  'BL': string,
  'BL_ID': string,
  'county': string,
  'last_update': string,
  'cases7_per_100k': number,
  'recovered': null
}

export type RkiSummedDayData = { 'totalCases': number, 'totalDeaths': number };

export type RkiDiffData = { 'diff': number, 'Landkreis': string };

export type RkiDailyNewCasesData = {
  'GesamtFaelle': number, 'Refdatum': number, 'IstErkrankungsbeginn': number
};

export type RkiTotalCasesPerDay = { 'GesamtFaelleTag': number, 'Meldedatum': number };

export type RkiTotalRecoveredByCounty = { 'SummeGenesen': number, 'Landkreis': string };

export type RkiFeatureData<T> = {
  features: [{ attributes: T }]
}


type ResolveAndReject<T> = [(arg: T) => void, (arg: unknown) => void];

class DataLoader<T> {

  private isLoading = false;
  private listeners: ResolveAndReject<T>[] = []

  private loadedData: T | null = null;

  constructor(
    private url: string
  ) { }

  createBoundLoadFunction() {
    return this.load.bind(this);
  }

  load() {
    if (this.loadedData !== null) {
      return Promise.resolve(this.loadedData);
    }

    this.loadDataOnce();

    return new Promise<T>((resolve, reject) => {
      this.listeners.push([resolve, reject]);
    });
  }

  private async loadDataOnce() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;

    try {
      this.loadedData = await (await fetch(this.url)).json() as T;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.listeners.forEach(([resolve,]) => resolve(this.loadedData!));
    } catch (e) {
      this.listeners.forEach(([, reject]) => reject(e));
    }
  }
}

type Parameters = readonly unknown[];

class ParametrizedDataLoader<T, P extends Parameters>{
  private loaders: { [key: string]: DataLoader<T> } = {};

  constructor(
    private urlBuilder: (...args: P) => string,
  ) { }

  load(...args: P): Promise<T> {
    const url = this.urlBuilder(...args);

    if (this.loaders[url] == undefined) {
      this.loaders[url] = new DataLoader<T>(url);
    }

    return this.loaders[url].load();
  }
}


const countyDataLoader = new DataLoader<RkiFeatureData<RkiCountyFeatureAttributes>>(COUNTY_DATA_URL);
export const loadCountyData = countyDataLoader.createBoundLoadFunction();

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
export const loadDailyInfectionsOfCounty = (county: string): Promise<RkiFeatureData<RkiDailyNewCasesData>> => dailyInfectionsOfCountyLoader.load(county);

const totalCasesPerDayOfCountyLoader = new ParametrizedDataLoader<RkiFeatureData<RkiTotalCasesPerDay>, [string]>(TOTAL_INFECTIONS_PER_DAY_OF_COUNTY_URL_FACTORY);
export const loadTotalCasesReportedPerDayOfCounty = (county: string): Promise<RkiFeatureData<RkiTotalCasesPerDay>> => totalCasesPerDayOfCountyLoader.load(county);

const totalRecoveredByCountyLoader = new DataLoader<RkiFeatureData<RkiTotalRecoveredByCounty>>(TOTAL_RECOVERED_BY_COUNTY_URL);
export const loadTotalRecoveredByCounty = totalRecoveredByCountyLoader.createBoundLoadFunction();