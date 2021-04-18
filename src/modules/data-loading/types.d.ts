
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

export type RkiTotalCasesPerDay = {
    'GesamtFaelleTag': number, 'Meldedatum': number, 'NeuerFall': number
};

export type RkiTotalRecoveredByCounty = { 'SummeGenesen': number, 'Landkreis': string };

export type RkiFeatureData<T> = {
    features: [{ attributes: T }]
}

export type RkiDailyAggregatedData = {
  'AdmUnitId': number,
  'BundeslandId': number,
  'AnzFall': number,
  'AnzTodesfall': number,
  'AnzFallNeu': number,
  'AnzTodesfallNeu': number,
  'AnzFall7T': number,
  'AnzGenesen': number,
  'AnzGenesenNeu': number,
  'AnzAktiv': number,
  'AnzAktivNeu': number,
  'Inz7T': number,
  'ObjectId': number
};