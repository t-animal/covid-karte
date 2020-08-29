const COUNTY_DATA_URL = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=*&returnGeometry=false&outSR=4326&f=json';
const TODAYS_SUMMED_DATA_URL = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?f=json&where=1=1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=[{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22cases%22,%22outStatisticFieldName%22:%22totalCases%22},{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22deaths%22,%22outStatisticFieldName%22:%22totalDeaths%22}]&resultType=standard&cacheHint=true';
const TODAYS_CASES_DIFF_URL = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?f=json&where=NeuerFall%20IN(1%2C%20-1)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22AnzahlFall%22%2C%22outStatisticFieldName%22%3A%22diff%22%7D%5D&resultType=standard&cacheHint=true';
const TODAYS_DEATHS_DIFF_URL = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?f=json&where=NeuerTodesfall%20IN(1%2C%20-1)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22AnzahlTodesfall%22%2C%22outStatisticFieldName%22%3A%22diff%22%7D%5D&resultType=standard&cacheHint=true';
const DAILY_INFECTIONS_URL = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=json&outStatistics=[%20{%20%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22AnzahlFall%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelle%22%20}%20]&groupByFieldsForStatistics=Refdatum,IstErkrankungsbeginn&orderByFields=Refdatum%20desc';
const TOTAL_INFECTIONS_PER_DAY_URL = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_RKI_Sums/FeatureServer/0/query?f=json&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&resultType=standard&cacheHint=true&groupByFieldsForStatistics=Meldedatum&outStatistics=[{%22statisticType%22:%20%22sum%22,%20%22onStatisticField%22:%20%22SummeFall%22,%20%22outStatisticFieldName%22:%20%22GesamtFaelleTag%22%20%20}]&orderByFields=Meldedatum%20desc'

export type RkiCountyFeatureAttributes = {
	"OBJECTID": number,
	"ADE": number,
	"GF": number,
	"BSG": number,
	"RS": string,
	"AGS": string,
	"SDV_RS": string,
	"GEN": string,
	"BEZ": string,
	"IBZ": number,
	"BEM": string,
	"NBD": string,
	"SN_L": string,
	"SN_R": string,
	"SN_K": string,
	"SN_V1": string,
	"SN_V2": string,
	"SN_G": string,
	"FK_S3": string,
	"NUTS": string,
	"RS_0": string,
	"AGS_0": string,
	"WSK": string,
	"EWZ": number,
	"KFL": number,
	"DEBKG_ID": string,
	"Shape__Area": number,
	"Shape__Length": number,
	"death_rate": number,
	"cases": number,
	"deaths": number,
	"cases_per_100k": number,
	"cases_per_population": number,
	"BL": string,
	"BL_ID": string,
	"county": string,
	"last_update": string,
	"cases7_per_100k": number,
	"recovered": null
}

export type RkiSummedDayData =  {"totalCases":number, "totalDeaths":number};

export type RkiDiffData = {"diff": number};

export type RkiDailyNewCasesData = {"GesamtFaelle": number, "Refdatum": number, "IstErkrankungsbeginn": number};

export type RkiTotalCasesPerDay = {"GesamtFaelleTag": number, "Meldedatum": number};


export type RkiFeatureData<T> = {
	features: [{ attributes: T }]
}


type ResolveAndReject<T> = [(arg: T)=>void, (arg: any)=>void];

class DataLoader<T> {

	private isLoading = false;
	private listeners: ResolveAndReject<T>[] = []

	private loadedData: T | null = null;

	constructor(
		private url: string
	){}

	createBoundLoadFunction() {
		return this.load.bind(this);
	}

	load() {
		if(this.loadedData !== null) {
			return Promise.resolve(this.loadedData);
		}

		this.loadDataOnce();

		return new Promise<T>((resolve, reject) => {
			this.listeners.push([resolve, reject]);
		});
	}

	private async loadDataOnce() {
		if(this.isLoading){
			return;
		}
		this.isLoading = true;

		try {
			this.loadedData = await (await fetch(this.url)).json() as T;
			
			this.listeners.forEach(([resolve, reject]) => resolve(this.loadedData!));
		}catch(e) {
			this.listeners.forEach(([resolve, reject]) => reject(e));
		}
	}
}



let countyDataLoader = new DataLoader<RkiFeatureData<RkiCountyFeatureAttributes>>(COUNTY_DATA_URL);
export const loadCountyData = countyDataLoader.createBoundLoadFunction();

let todaysSummedDataLoader = new DataLoader<RkiFeatureData<RkiSummedDayData>>(TODAYS_SUMMED_DATA_URL);
export const loadTodaysSummedData = todaysSummedDataLoader.createBoundLoadFunction();

let todaysCasesDiffLoader = new DataLoader<RkiFeatureData<RkiDiffData>>(TODAYS_CASES_DIFF_URL);
export const loadTodaysCasesDiff = todaysCasesDiffLoader.createBoundLoadFunction();

let todaysDeathsDiffLoader = new DataLoader<RkiFeatureData<RkiDiffData>>(TODAYS_DEATHS_DIFF_URL);
export const loadTodaysDeathsDiff = todaysDeathsDiffLoader.createBoundLoadFunction();

let dailyInfectionsLoader = new DataLoader<RkiFeatureData<RkiDailyNewCasesData>>(DAILY_INFECTIONS_URL);
export const loadDailyInfections = dailyInfectionsLoader.createBoundLoadFunction();

let totalCasesPerDayLoader = new DataLoader<RkiFeatureData<RkiTotalCasesPerDay>>(TOTAL_INFECTIONS_PER_DAY_URL);
export const loadTotalCasesReportedPerDay = totalCasesPerDayLoader.createBoundLoadFunction();