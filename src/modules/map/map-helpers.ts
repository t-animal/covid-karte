import { feature, merge } from 'topojson';
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

type GeoDingsi = GeoJSON.FeatureCollection<GeoJSON.MultiPolygon, CountyMapInfo>;

let cachedCountyMap: ReturnType<loadCountyMap>;

export async function loadCountyMap()
  : Promise<GeoJSON.FeatureCollection<GeoJSON.MultiPolygon, CountyMapInfo>> {
  if (cachedCountyMap !== undefined) {
    return cachedCountyMap;
  }

  const topo: TopoJSON.Topology = await (await fetch('./map-data/county-map.topo.json')).json();
  const berlinTopoPromise = loadBerlinMap();
  const geo = feature(topo, topo.objects['county-map']) as GeoDingsi;

  function mergeCounties(targetId: number, sourceIds: number[]) {
    const needsFilter = (elem: GeoJSON.Feature) =>
      ([targetId, ...sourceIds].includes(elem?.properties?.ID_3));
    const merged = merge(
      topo,
      topo.objects['county-map']
        .geometries
        .filter(needsFilter)
    );

    const [source,] = geo.features.filter(needsFilter);
    geo.features = geo.features.filter(elem => !needsFilter(elem));
    geo.features.push({ ...source, geometry: merged as any });
  }

  mergeCounties(188, [191]);
  mergeCounties(192, [199]);
  mergeCounties(194, [193, 195, 189]);
  mergeCounties(197, [205]);
  mergeCounties(196, [203, 201]);
  mergeCounties(198, [204, 190]);

  mergeCounties(386, [384, 388]);
  mergeCounties(385, [382]);
  mergeCounties(390, [391]);
  mergeCounties(387, [389]);
  mergeCounties(392, [397]);
  mergeCounties(395, [396]);
  mergeCounties(377, [379]);
  mergeCounties(381, [380, 373]);
  mergeCounties(378, [371, 370, 375]);
  mergeCounties(393, [376, 374]);

  mergeCounties(353, [359]);
  mergeCounties(356, [357]);
  mergeCounties(355, [358]);
  mergeCounties(346, [350, 348]);
  mergeCounties(362, [366, 369]);
  mergeCounties(365, [361]);
  mergeCounties(352, [367, 347]);

  mergeCounties(209, [212]);

  mergeCounties(286, [285]);

  const berlinTopo = await berlinTopoPromise;
  const berlinTopoObjects = berlinTopo.objects['berliner-bezirke'] as
    TopoJSON.GeometryCollection<{ spatial_alias: string }>;


  geo.features = geo.features.filter(elem => elem.properties.NAME_3 !== 'Berlin');
  for (const [key, berlinCountyTopo] of Array.from(berlinTopoObjects.geometries.entries())) {
    const converted = feature(berlinTopo, berlinCountyTopo) as GeoJSON.Feature;
    geo.features.push({
      ...converted,
      id: 9000 + key,
      properties: {
        ENGTYPE_3: 'Rural district',
        ID_0: 86,
        ID_1: 9,
        ID_2: 23,
        ID_3: 9000 + key,
        ISO: 'DEU',
        NAME_0: 'Germany',
        NAME_1: 'Berlin',
        NAME_2: 'Berlin',
        NAME_3: converted.properties?.spatial_alias,
        NL_NAME_3: null,
        TYPE_3: 'Landkreise',
        VARNAME_3: null,
      }
    } as unknown as GeoJSON.Feature<GeoJSON.MultiPolygon, CountyMapInfo>);
  }

  cachedCountyMap = geo;
  return geo;
}

async function loadBerlinMap() {
  return await (await (fetch('./map-data/berlin-counties.topo.json'))).json();
}

export type CityInfo = { cityLabel: string, population: number, coordinates: [number, number] }
export async function loadCities(): Promise<CityInfo[]> {
  return await (await fetch('./map-data/cities-mid-large.json')).json();
}

export async function loadStateMap(): Promise<GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>> {
  const topo: TopoJSON.Topology = await (await fetch('./map-data/state-map.topo.json')).json();
  const geo = feature(topo, topo.objects['state-map']);

  return geo as GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>;
}

export async function loadEuMap(): Promise<GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>> {
  const topo: TopoJSON.Topology = await (await fetch('./map-data/eu-map.topo.json')).json();
  const geo = feature(topo, topo.objects['eu-map']);

  return geo as GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>;
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
  const idMap: { [key: number]: number } = {
    399: 1, //"SK Flensburg",
    400: 2, //"SK Kiel",
    402: 3, //"SK Lübeck",
    403: 4, //"SK Neumünster",
    398: 5, //"LK Dithmarschen",
    401: 6, //"LK Herzogtum Lauenburg",
    404: 7, //"LK Nordfriesland",
    405: 8, //"LK Ostholstein",
    406: 9, //"LK Pinneberg",
    407: 10, //"LK Plön",
    408: 11, //"LK Rendsburg-Eckernförde",
    409: 12, //"LK Schleswig-Flensburg",
    410: 13, //"LK Segeberg",
    411: 14, //"LK Steinburg",
    412: 15, //"LK Stormarn",

    161: 16, //	"SK Hamburg",

    206: 17, //	"SK Braunschweig",
    214: 18, //	"SK Salzgitter",
    216: 19, //	"SK Wolfsburg",
    207: 20, //	"LK Gifhorn",
    208: 21, //	"LK Goslar",
    210: 22, //	"LK Helmstedt",
    211: 23, //	"LK Northeim",
    213: 24, //	"LK Peine",
    215: 25, //	"LK Wolfenbüttel",
    209: 26, //	"LK Göttingen",
    219: 27, //	"Region Hannover",
    217: 28, //	"LK Diepholz",
    218: 29, //	"LK Hameln-Pyrmont",
    220: 30, //	"LK Hildesheim",
    221: 31, //	"LK Holzminden",
    222: 32, //	"LK Nienburg (Weser)",
    223: 33, //	"LK Schaumburg",
    224: 34, //	"LK Celle",
    225: 35, //	"LK Cuxhaven",
    8225: 63, //	"LK Cuxhaven",
    226: 36, //	"LK Harburg",
    227: 37, //	"LK Lüchow-Dannenberg",
    228: 38, //	"LK Lüneburg",
    229: 39, //	"LK Osterholz",
    230: 40, //	"LK Rotenburg (Wümme)",
    231: 41, //	"LK Heidekreis",
    232: 42, //	"LK Stade",
    233: 43, //	"LK Uelzen",
    234: 44, //	"LK Verden",
    8244: 45, //"SK Delmenhorst",
    238: 46, //	"SK Emden",
    243: 47, //	"SK Oldenburg",
    245: 48, //	"SK Osnabrück",
    249: 49, //	"SK Wilhelmshaven",
    235: 50, //	"LK Ammerland",
    236: 51, //	"LK Aurich",
    237: 52, //	"LK Cloppenburg",
    239: 53, //	"LK Emsland",
    240: 54, //	"LK Friesland",
    241: 55, //	"LK Grafschaft Bentheim",
    242: 56, //	"LK Leer",
    244: 57, //	"LK Oldenburg",
    246: 58, //	"LK Osnabrück",
    247: 59, //	"LK Vechta",
    248: 60, //	"LK Wesermarsch",
    250: 61, //	"LK Wittmund",
    160: 62, //	"SK Bremen",
    //      63: "SK, // Bremerhaven",

    272: 64, //	"SK Düsseldorf",
    271: 65, //	"SK Duisburg",
    273: 66, //	"SK Essen",
    274: 67, //	"SK Krefeld",
    276: 68, //	"SK Mönchengladbach",
    277: 69, //	"SK Mülheim a.d.Ruhr",
    278: 70, //	"SK Oberhausen",
    279: 71, //	"SK Remscheid",
    281: 72, //	"SK Solingen",
    284: 73, //	"SK Wuppertal",
    270: 74, //	"LK Kleve",
    275: 75, //	"LK Mettmann",
    280: 76, //	"LK Rhein-Kreis Neuss",
    282: 77, //	"LK Viersen",
    283: 78, //	"LK Wesel",
    287: 79, //	"SK Bonn",
    288: 80, //	"SK Köln",
    292: 81, //	"SK Leverkusen",
    285: 82, //	"StadtRegion Aachen",
    289: 83, //	"LK Düren",
    294: 84, //	"LK Rhein-Erft-Kreis",
    290: 85, //	"LK Euskirchen",
    291: 86, //	"LK Heinsberg",
    293: 87, //	"LK Oberbergischer Kreis",
    296: 88, //	"LK Rheinisch-Bergischer Kreis",
    295: 89, //	"LK Rhein-Sieg-Kreis",
    298: 90, //	"SK Bottrop",
    300: 91, //	"SK Gelsenkirchen",
    301: 92, //	"SK Münster",
    297: 93, //	"LK Borken",
    299: 94, //	"LK Coesfeld",
    302: 95, //	"LK Recklinghausen",
    303: 96, //	"LK Steinfurt",
    304: 97, //	"LK Warendorf",

    263: 98, //	"SK Bielefeld",
    264: 99, //	"LK Gütersloh",
    265: 100, //	"LK Herford",
    266: 101, //	"LK Höxter",
    267: 102, //	"LK Lippe",
    268: 103, //	"LK Minden-Lübbecke",
    269: 104, //	"LK Paderborn",
    251: 105, //	"SK Bochum",
    252: 106, //	"SK Dortmund",
    254: 107, //	"SK Hagen",
    255: 108, //	"SK Hamm",
    256: 109, //	"SK Herne",
    253: 110, //	"LK Ennepe-Ruhr-Kreis",
    257: 111, //	"LK Hochsauerlandkreis",
    258: 112, //	"LK Märkischer Kreis",
    259: 113, //	"LK Olpe",
    260: 114, //	"LK Siegen-Wittgenstein",
    261: 115, //	"LK Soest",
    262: 116, //	"LK Unna",

    310: 143, //	"SK Koblenz",
    305: 144, //	"LK Ahrweiler",
    306: 145, //	"LK Altenkirchen",
    307: 146, //	"LK Bad Kreuznach",
    308: 147, //	"LK Birkenfeld",
    309: 148, //	"LK Cochem-Zell",
    311: 149, //	"LK Mayen-Koblenz",
    312: 150, //	"LK Neuwied",
    313: 151, //	"LK Rhein-Hunsrück-Kreis",
    314: 152, //	"LK Rhein-Lahn-Kreis",
    315: 153, //	"LK Westerwaldkreis",
    338: 154, //	"SK Trier",
    335: 155, //	"LK Bernkastel-Wittlich",
    336: 156, //	"LK Bitburg-Prüm",
    339: 157, //	"LK Vulkaneifel",
    337: 158, //	"LK Trier-Saarburg",
    319: 159, //	"SK Frankenthal",
    321: 160, //	"SK Kaiserslautern",
    324: 161, //	"SK Landau i.d.Pfalz",
    325: 162, //	"SK Ludwigshafen",
    327: 163, //	"SK Mainz",
    328: 164, //	"SK Neustadt a.d.Weinstraße",
    //      165:	"SK, // Pirmasens",
    330: 166, //	"SK Speyer",
    333: 167, //	"SK Worms",
    334: 168, //	"SK Zweibrücken",
    316: 169, //	"LK Alzey-Worms",
    317: 170, //	"LK Bad Dürkheim",
    318: 171, //	"LK Donnersbergkreis",
    320: 172, //	"LK Germersheim",
    322: 173, //	"LK Kaiserslautern",
    323: 174, //	"LK Kusel",
    331: 175, //	"LK Südliche Weinstraße",
    329: 176, //	"LK Rhein-Pfalz-Kreis",
    326: 177, //	"LK Mainz-Bingen",
    332: 178, //	"LK Südwestpfalz",

    35: 179, //	"SK Stuttgart",
    23: 180, //	"LK Böblingen",
    24: 181, //	"LK Esslingen",
    25: 182, //	"LK Göppingen",
    30: 183, //	"LK Ludwigsburg",
    33: 184, //	"LK Rems-Murr-Kreis",
    27: 185, //	"SK Heilbronn",
    28: 186, //	"LK Heilbronn",
    29: 187, //	"LK Hohenlohekreis",
    34: 188, //	"LK Schwäbisch Hall",
    31: 189, //	"LK Main-Tauber-Kreis",
    26: 190, //	"LK Heidenheim",
    32: 191, //	"LK Ostalbkreis",
    11: 192, //	"SK Baden-Baden",
    16: 193, //	"SK Karlsruhe",
    17: 194, //	"LK Karlsruhe",
    21: 195, //	"LK Rastatt",
    15: 196, //	"SK Heidelberg",
    18: 197, //	"SK Mannheim",
    19: 198, //	"LK Neckar-Odenwald-Kreis",
    22: 199, //	"LK Rhein-Neckar-Kreis",
    20: 200, //	"SK Pforzheim",
    12: 201, //	"LK Calw",
    13: 202, //	"LK Enzkreis",
    14: 203, //	"LK Freudenstadt",
    3: 204, //	"SK Freiburg i.Breisgau",
    1: 205, //	"LK Breisgau-Hochschwarzwald",
    2: 206, //	"LK Emmendingen",
    6: 207, //	"LK Ortenaukreis",
    7: 208, //	"LK Rottweil",
    8: 209, //	"LK Schwarzwald-Baar-Kreis",
    9: 210, //	"LK Tuttlingen",
    4: 211, //	"LK Konstanz",
    5: 212, //	"LK Lörrach",
    10: 213, //	"LK Waldshut",
    40: 214, //	"LK Reutlingen",
    42: 215, //	"LK Tübingen",
    44: 216, //	"LK Zollernalbkreis",
    43: 217, //	"SK Ulm",
    36: 218, //	"LK Alb-Donau-Kreis",
    37: 219, //	"LK Biberach",
    38: 220, //	"LK Bodenseekreis",
    39: 221, //	"LK Ravensburg",
    41: 222, //	"LK Sigmaringen",

    79: 223, //"SK Ingolstadt",
    84: 224, //"SK München",
    87: 225, //"SK Rosenheim",
    69: 226, //"LK Altötting",
    71: 227, //"LK Berchtesgadener Land",
    70: 228, //"LK Bad Tölz-Wolfratshausen",
    72: 229, //"LK Dachau",
    73: 230, //"LK Ebersberg",
    74: 231, //"LK Eichstätt",
    75: 232, //"LK Erding",
    76: 233, //"LK Freising",
    77: 234, //"LK Fürstenfeldbruck",
    78: 235, //"LK Garmisch-Partenkirchen",
    80: 236, //"LK Landsberg a.Lech",
    81: 237, //"LK Miesbach",
    82: 238, //"LK Mühldorf a.Inn",
    83: 239, //"LK München",
    85: 240, //"LK Neuburg-Schrobenhausen",
    86: 241, //"LK Pfaffenhofen a.d.Ilm",
    88: 242, //"LK Rosenheim",
    89: 243, //"LK Starnberg",
    90: 244, //"LK Traunstein",
    91: 245, //"LK Weilheim-Schongau",

    61: 246, //"SK Landshut",
    63: 247, //"SK Passau",
    68: 248, //"SK Straubing",
    57: 249, //"LK Deggendorf",
    59: 250, //"LK Freyung-Grafenau",
    60: 251, //"LK Kelheim",

    62: 252, //"LK Landshut",
    64: 253, //"LK Passau",
    65: 254, //"LK Regen",
    66: 255, //"LK Rottal-Inn",
    67: 256, //"LK Straubing-Bogen",
    58: 257, //"LK Dingolfing-Landau",
    106: 258, //"SK Amberg",
    110: 259, //"SK Regensburg",
    114: 260, //"SK Weiden i.d.OPf.",
    105: 261, //"LK Amberg-Sulzbach",
    107: 262, //"LK Cham",
    108: 263, //"LK Neumarkt i.d.OPf.",
    109: 264, //"LK Neustadt a.d.Waldnaab",
    111: 265, //"LK Regensburg",
    112: 266, //"LK Schwandorf",
    113: 267, //"LK Tirschenreuth",

    92: 268, //"SK Bamberg",
    94: 269, //"SK Bayreuth",
    96: 270, //"SK Coburg",
    99: 271, //"SK Hof",
    93: 272, //"LK Bamberg",
    95: 273, //"LK Bayreuth",
    97: 274, //"LK Coburg",
    98: 275, //"LK Forchheim",
    100: 276, //"LK Hof",
    101: 277, //"LK Kronach",
    102: 278, //"LK Kulmbach",
    103: 279, //"LK Lichtenfels",
    104: 280, //"LK Wunsiedel i.Fichtelgebirge",

    45: 281, //"SK Ansbach",
    48: 282, //"SK Erlangen",
    49: 283, //"SK Fürth",
    52: 284, //"SK Nürnberg",
    55: 285, //"SK Schwabach",
    46: 286, //"LK Ansbach",
    47: 287, //"LK Erlangen-Höchstadt",
    50: 288, //"LK Fürth",
    53: 289, //"LK Nürnberger Land",
    51: 290, //"LK Neustadt a.d.Aisch-Bad Windsheim",
    54: 291, //"LK Roth",

    56: 292, //"LK Weißenburg-Gunzenhausen",
    129: 293, //"SK Aschaffenburg",
    137: 294, //"SK Schweinfurt",
    139: 295, //"SK Würzburg",
    130: 296, //"LK Aschaffenburg",
    131: 297, //"LK Bad Kissingen",
    136: 298, //"LK Rhön-Grabfeld",
    132: 299, //"LK Haßberge",
    133: 300, //"LK Kitzingen",
    135: 301, //"LK Miltenberg",
    134: 302, //"LK Main-Spessart",
    138: 303, //"LK Schweinfurt",
    140: 304, //"LK Würzburg",

    116: 305, //"SK Augsburg",
    121: 306, //"SK Kaufbeuren",
    122: 307, //"SK Kempten",
    124: 308, //"SK Memmingen",
    115: 309, //"LK Aichach-Friedberg",
    117: 310, //"LK Augsburg",
    118: 311, //"LK Dillingen a.d.Donau",
    120: 312, //"LK Günzburg",
    125: 313, //"LK Neu-Ulm",
    123: 314, //"LK Lindau",
    127: 315, //"LK Ostallgäu",
    128: 316, //"LK Unterallgäu",
    119: 317, //"LK Donau-Ries",
    126: 318, //"LK Oberallgäu",

    342: 319, //"LK Stadtverband Saarbrücken",
    340: 320, //"LK Merzig-Wadern",
    341: 321, //"LK Neunkirchen",
    343: 322, //"LK Saarlouis",
    344: 323, //"LK Saar-Pfalz-Kreis",
    345: 324, //"LK Sankt Wendel",

    143: 326, //"SK Brandenburg a.d.Havel",
    144: 327, //"SK Cottbus",
    147: 328, //"SK Frankfurt (Oder)",
    155: 329, //"SK Potsdam",
    142: 330, //"LK Barnim",
    145: 331, //"LK Dahme-Spreewald",
    146: 332, //"LK Elbe-Elster",
    148: 333, //"LK Havelland",
    149: 334, //"LK Märkisch-Oderland",
    150: 335, //"LK Oberhavel",
    151: 336, //"LK Oberspreewald-Lausitz",
    152: 337, //"LK Oder-Spree",
    153: 338, //"LK Ostprignitz-Ruppin",
    154: 339, //"LK Potsdam-Mittelmark",
    156: 340, //"LK Prignitz",
    157: 341, //"LK Spree-Neiße",
    158: 342, //"LK Teltow-Fläming",
    159: 343, //"LK Uckermark",

    200: 344, //	"SK Rostock",
    202: 345, //	"SK Schwerin",
    189: 346, //	"LK Mecklenburgische Seenplatte",
    188: 347, //	"LK Rostock",
    196: 348, //	"LK Vorpommern-Rügen",
    197: 349, //	"LK Nordwestmecklenburg",
    190: 350, //	"LK Vorpommern-Greifswald",
    192: 351, //	"LK Ludwigslust-Parchim",

    372: 352, //	"SK Chemnitz",
    370: 353, //	"LK Erzgebirgskreis",
    374: 354, //	"LK Mittelsachsen",
    377: 355, //	"LK Vogtlandkreis",
    373: 356, //	"LK Zwickau",
    383: 357, //	"SK Dresden",
    382: 358, //	"LK Bautzen",
    384: 359, //	"LK Görlitz",
    387: 360, //	"LK Meißen",
    390: 361, //	"LK Sächsische Schweiz-Osterzgebirge",
    394: 362, //	"SK Leipzig",
    395: 363, //	"LK Leipzig",
    392: 364, //	"LK Nordsachsen",

    349: 365, //	"SK Dessau-Roßlau",
    354: 366, //	"SK Halle",
    364: 367, //	"SK Magdeburg",
    360: 368, //	"LK Altmarkkreis Salzwedel",
    346: 369, //	"LK Anhalt-Bitterfeld",
    361: 370, //	"LK Börde",
    353: 371, //	"LK Burgenlandkreis",
    362: 372, //	"LK Harz",
    363: 373, //	"LK Jerichower Land",
    355: 374, //	"LK Mansfeld-Südharz",
    356: 375, //	"LK Saalekreis",
    347: 376, //	"LK Salzlandkreis",
    368: 377, //	"LK Stendal",
    351: 378, //	"LK Wittenberg",

    164: 117, //"SK Darmstadt",
    165: 118, //"SK Frankfurt am Main",
    171: 119, //"SK Offenbach",
    175: 120, //"SK Wiesbaden",
    162: 121, //"LK Bergstraße",
    163: 122, //"LK Darmstadt-Dieburg",
    166: 123, //"LK Groß-Gerau",
    167: 124, //"LK Hochtaunuskreis",
    168: 125, //"LK Main-Kinzig-Kreis",
    169: 126, //"LK Main-Taunus-Kreis",
    170: 127, //"LK Odenwaldkreis",
    172: 128, //"LK Offenbach",
    173: 129, //"LK Rheingau-Taunus-Kreis",
    174: 130, //"LK Wetteraukreis",
    176: 131, //"LK Gießen",
    177: 132, //"LK Lahn-Dill-Kreis",
    178: 133, //"LK Limburg-Weilburg",
    179: 134, //"LK Marburg-Biedenkopf",
    180: 135, //"LK Vogelsbergkreis",
    183: 136, //"SK Kassel",
    181: 137, //"LK Fulda",
    182: 138, //"LK Hersfeld-Rotenburg",
    184: 139, //"LK Kassel",
    185: 140, //"LK Schwalm-Eder-Kreis",
    186: 141, //"LK Waldeck-Frankenberg",
    187: 142, //"LK Werra-Meißner-Kreis",

    415: 379,	// "SK Erfurt",
    416: 380,	// "SK Gera",
    421: 381,	// "SK Jena",
    430: 382,	// "SK Suhl",
    433: 383,	// "SK Weimar",
    432: 384, // "SK  Eisenach",
    414: 385,	// "LK Eichsfeld",
    423: 386,	// "LK Nordhausen",
    8433: 387,	// "LK Wartburgkreis",
    431: 388,	// "LK Unstrut-Hainich-Kreis",
    422: 389,	// "LK Kyffhäuserkreis",
    427: 390,	// "LK Schmalkalden-Meiningen",
    417: 391,	// "LK Gotha",
    428: 392,	// "LK Sömmerda",
    419: 393,	// "LK Hildburghausen",
    420: 394,	// "LK Ilm-Kreis",
    434: 395,	// "LK Weimarer Land",
    429: 396,	// "LK Sonneberg",
    426: 397,	// "LK Saalfeld-Rudolstadt",
    424: 398,	// "LK Saale-Holzland-Kreis",
    425: 399,	// "LK Saale-Orla-Kreis",
    418: 400,	// "LK Greiz",
    413: 401,	// "LK Altenburger Land",

    9011: 404, // "SK Berlin Reinickendorf",
    9003: 405, // "SK Berlin Charlottenburg-Wilmersdorf",
    9008: 406, // "SK Berlin Treptow-Köpenick",
    9002: 407, // "SK Berlin Pankow",
    9007: 408, // "SK Berlin Neukölln",
    9010: 409, // "SK Berlin Lichtenberg",
    9009: 410, // "SK Berlin Marzahn-Hellersdorf",
    9004: 411, // "SK Berlin Spandau",
    9005: 412, // "SK Berlin Steglitz-Zehlendorf",
    9000: 413, // "SK Berlin Mitte",
    9001: 414, // "SK Berlin Friedrichshain-Kreuzberg",
    9006: 415, // "SK Berlin Tempelhof-Schöneberg",
  };

  return idMap[mapId] ?? null;
}
