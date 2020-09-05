import { RkiCountyFeatureAttributes, RkiFeatureData } from '../data-loading';

export type CountyMapInfo = {
  'ID_0': number,
  'ISO': string,
  'NAME_0': string,
  'ID_1': number,
  'NAME_1': string,
  'ID_2': number,
  'NAME_2': string,
  'ID_3': number,
  'NAME_3': string,
  'NL_NAME_3': null,
  'VARNAME_3': null,
  'TYPE_3': string,
  'ENGTYPE_3': string
};

export async function loadCountyMap()
  : Promise<GeoJSON.FeatureCollection<GeoJSON.MultiPolygon, CountyMapInfo>>
{
  return (await fetch('./map-data/county-map.json')).json();
}

export async function loadStateMap(): Promise<GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>> {
  return (await fetch('./map-data/state-map.json')).json();
}

export async function loadEuMap(): Promise<GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>> {
  return (await fetch('./map-data/eu-map.json')).json();
}

export function color(sevenDaysInfectionsPer100k: number | undefined): string {
  if (sevenDaysInfectionsPer100k == undefined) return '#fff';

  if (sevenDaysInfectionsPer100k == 0) return '#d2d2d2';
  if (sevenDaysInfectionsPer100k <= 5) return '#d7d3af';
  if (sevenDaysInfectionsPer100k <= 25) return '#d7d288';
  if (sevenDaysInfectionsPer100k <= 50) return '#cd9406';
  if (sevenDaysInfectionsPer100k <= 250) return '#af2632';
  if (sevenDaysInfectionsPer100k <= 500) return '#8c0619';
  return '#fff';
}


export function rkiFeatureByMapId(
  rkiData: RkiFeatureData<RkiCountyFeatureAttributes>,
  mapId: number
): RkiCountyFeatureAttributes | null {
  const rkiId = mapIdToRkiObjectId(mapId);
  return rkiData.features
    .map(feature => feature.attributes)
    .find(attribute => attribute.OBJECTID == rkiId) ?? null;
}

function mapIdToRkiObjectId(mapId: number) {
  switch (mapId) {
    case 79: return 223; //"SK Ingolstadt",
    case 84: return 224; //"SK München",
    case 87: return 225; //"SK Rosenheim",
    case 69: return 226; //"LK Altötting",
    case 71: return 227; //"LK Berchtesgadener Land",
    case 70: return 228; //"LK Bad Tölz-Wolfratshausen",
    case 72: return 229; //"LK Dachau",
    case 73: return 230; //"LK Ebersberg",
    case 74: return 231; //"LK Eichstätt",
    case 75: return 232; //"LK Erding",
    case 76: return 233; //"LK Freising",
    case 77: return 234; //"LK Fürstenfeldbruck",
    case 78: return 235; //"LK Garmisch-Partenkirchen",
    case 80: return 236; //"LK Landsberg a.Lech",
    case 81: return 237; //"LK Miesbach",
    case 82: return 238; //"LK Mühldorf a.Inn",
    case 83: return 239; //"LK München",
    case 85: return 240; //"LK Neuburg-Schrobenhausen",
    case 86: return 241; //"LK Pfaffenhofen a.d.Ilm",
    case 88: return 242; //"LK Rosenheim",
    case 89: return 243; //"LK Starnberg",
    case 90: return 244; //"LK Traunstein",
    case 91: return 245; //"LK Weilheim-Schongau",

    case 61: return 246; //"SK Landshut",
    case 63: return 247; //"SK Passau",
    case 68: return 248; //"SK Straubing",
    case 57: return 249; //"LK Deggendorf",
    case 59: return 250; //"LK Freyung-Grafenau",
    case 60: return 251; //"LK Kelheim",

    case 62: return 252; //"LK Landshut",
    case 64: return 253; //"LK Passau",
    case 65: return 254; //"LK Regen",
    case 66: return 255; //"LK Rottal-Inn",
    case 67: return 256; //"LK Straubing-Bogen",
    case 58: return 257; //"LK Dingolfing-Landau",
    case 106: return 258; //"SK Amberg",
    case 110: return 259; //"SK Regensburg",
    case 114: return 260; //"SK Weiden i.d.OPf.",
    case 105: return 261; //"LK Amberg-Sulzbach",
    case 107: return 262; //"LK Cham",
    case 108: return 263; //"LK Neumarkt i.d.OPf.",
    case 109: return 264; //"LK Neustadt a.d.Waldnaab",
    case 111: return 265; //"LK Regensburg",
    case 112: return 266; //"LK Schwandorf",
    case 113: return 267; //"LK Tirschenreuth",

    case 92: return 268; //"SK Bamberg",
    case 94: return 269; //"SK Bayreuth",
    case 96: return 270; //"SK Coburg",
    case 99: return 271; //"SK Hof",
    case 93: return 272; //"LK Bamberg",
    case 95: return 273; //"LK Bayreuth",
    case 97: return 274; //"LK Coburg",
    case 98: return 275; //"LK Forchheim",
    case 100: return 276; //"LK Hof",
    case 101: return 277; //"LK Kronach",
    case 102: return 278; //"LK Kulmbach",
    case 103: return 279; //"LK Lichtenfels",
    case 104: return 280; //"LK Wunsiedel i.Fichtelgebirge",

    case 45: return 281; //"SK Ansbach",
    case 48: return 282; //"SK Erlangen",
    case 49: return 283; //"SK Fürth",
    case 52: return 284; //"SK Nürnberg",
    case 55: return 285; //"SK Schwabach",
    case 46: return 286; //"LK Ansbach",
    case 47: return 287; //"LK Erlangen-Höchstadt",
    case 50: return 288; //"LK Fürth",
    case 53: return 289; //"LK Nürnberger Land",
    case 51: return 290; //"LK Neustadt a.d.Aisch-Bad Windsheim",
    case 54: return 291; //"LK Roth",

    case 56: return 292; //"LK Weißenburg-Gunzenhausen",
    case 129: return 293; //"SK Aschaffenburg",
    case 137: return 294; //"SK Schweinfurt",
    case 139: return 295; //"SK Würzburg",
    case 130: return 296; //"LK Aschaffenburg",
    case 131: return 297; //"LK Bad Kissingen",
    case 136: return 298; //"LK Rhön-Grabfeld",
    case 132: return 299; //"LK Haßberge",
    case 133: return 300; //"LK Kitzingen",
    case 135: return 301; //"LK Miltenberg",
    case 134: return 302; //"LK Main-Spessart",
    case 138: return 303; //"LK Schweinfurt",
    case 140: return 304; //"LK Würzburg",

    case 116: return 305; //"SK Augsburg",
    case 121: return 306; //"SK Kaufbeuren",
    case 122: return 307; //"SK Kempten",
    case 124: return 308; //"SK Memmingen",
    case 115: return 309; //"LK Aichach-Friedberg",
    case 117: return 310; //"LK Augsburg",
    case 118: return 311; //"LK Dillingen a.d.Donau",
    case 120: return 312; //"LK Günzburg",
    case 125: return 313; //"LK Neu-Ulm",
    case 123: return 314; //"LK Lindau",
    case 127: return 315; //"LK Ostallgäu",
    case 128: return 316; //"LK Unterallgäu",
    case 119: return 317; //"LK Donau-Ries",
    case 126: return 318; //"LK Oberallgäu",

    case 164: return 117; //"SK Darmstadt",
    case 165: return 118; //"SK Frankfurt am Main",
    case 171: return 119; //"SK Offenbach",
    case 175: return 120; //"SK Wiesbaden",
    case 162: return 121; //"LK Bergstraße",
    case 163: return 122; //"LK Darmstadt-Dieburg",
    case 166: return 123; //"LK Groß-Gerau",
    case 167: return 124; //"LK Hochtaunuskreis",
    case 168: return 125; //"LK Main-Kinzig-Kreis",
    case 169: return 126; //"LK Main-Taunus-Kreis",
    case 170: return 127; //"LK Odenwaldkreis",
    case 172: return 128; //"LK Offenbach",
    case 173: return 129; //"LK Rheingau-Taunus-Kreis",
    case 174: return 130; //"LK Wetteraukreis",
    case 176: return 131; //"LK Gießen",
    case 177: return 132; //"LK Lahn-Dill-Kreis",
    case 178: return 133; //"LK Limburg-Weilburg",
    case 179: return 134; //"LK Marburg-Biedenkopf",
    case 180: return 135; //"LK Vogelsbergkreis",
    case 183: return 136; //"SK Kassel",
    case 181: return 137; //"LK Fulda",
    case 182: return 138; //"LK Hersfeld-Rotenburg",
    case 184: return 139; //"LK Kassel",
    case 185: return 140; //"LK Schwalm-Eder-Kreis",
    case 186: return 141; //"LK Waldeck-Frankenberg",
    case 187: return 142; //"LK Werra-Meißner-Kreis",

    case 415: return 379;	// "SK Erfurt",
    case 416: return 380;	// "SK Gera",
    case 421: return 381;	// "SK Jena",
    case 430: return 382;	// "SK Suhl",
    case 433: return 383;	// "SK Weimar",
    //     384: return "SK  Eisenach",
    case 414: return 385;	// "LK Eichsfeld",
    case 423: return 386;	// "LK Nordhausen",
    case 432: return 387;	// "LK Wartburgkreis",
    case 431: return 388;	// "LK Unstrut-Hainich-Kreis",
    case 422: return 389;	// "LK Kyffhäuserkreis",
    case 427: return 390;	// "LK Schmalkalden-Meiningen",
    case 417: return 391;	// "LK Gotha",
    case 428: return 392;	// "LK Sömmerda",
    case 419: return 393;	// "LK Hildburghausen",
    case 420: return 394;	// "LK Ilm-Kreis",
    case 434: return 395;	// "LK Weimarer Land",
    case 429: return 396;	// "LK Sonneberg",
    case 426: return 397;	// "LK Saalfeld-Rudolstadt",
    case 424: return 398;	// "LK Saale-Holzland-Kreis",
    case 425: return 399;	// "LK Saale-Orla-Kreis",
    case 418: return 400;	// "LK Greiz",
    case 413: return 401;	// "LK Altenburger Land",
    default: return null;
  }
}