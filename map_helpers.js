function color(sevenDaysInfectionsPer100k) {
	if(sevenDaysInfectionsPer100k ==   0) return '#d2d2d2';
	if(sevenDaysInfectionsPer100k <=   5) return '#d7d3af';
	if(sevenDaysInfectionsPer100k <=  25) return '#d7d288';
	if(sevenDaysInfectionsPer100k <=  50) return '#cd9406';
	if(sevenDaysInfectionsPer100k <= 250) return '#af2632';
	if(sevenDaysInfectionsPer100k <= 500) return '#8c0619';
	return '#fff';
}

function mapIdToRkiObjectId(mapId) {
	switch(mapId) {
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
		case 61:  return 246; //"SK Landshut",
		case 63:  return 247; //"SK Passau",
		case 68:  return 248; //"SK Straubing",
		case 57:  return 249; //"LK Deggendorf",
		case 59:  return 250; //"LK Freyung-Grafenau",
		case 60:  return 251; //"LK Kelheim",
		case 62:  return 252; //"LK Landshut",
		case 64:  return 253; //"LK Passau",
		case 65:  return 254; //"LK Regen",
		case 66:  return 255; //"LK Rottal-Inn",
		case 67:  return 256; //"LK Straubing-Bogen",
		case 58:  return 257; //"LK Dingolfing-Landau",
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
		case  92: return 268; //"SK Bamberg",
		case  94: return 269; //"SK Bayreuth",
		case  96: return 270; //"SK Coburg",
		case  99: return 271; //"SK Hof",
		case  93: return 272; //"LK Bamberg",
		case  95: return 273; //"LK Bayreuth",
		case  97: return 274; //"LK Coburg",
		case  98: return 275; //"LK Forchheim",
		case 100: return 276; //"LK Hof",
		case 101: return 277; //"LK Kronach",
		case 102: return 278; //"LK Kulmbach",
		case 103: return 279; //"LK Lichtenfels",
		case 104: return 280; //"LK Wunsiedel i.Fichtelgebirge",
		case  45: return 281; //"SK Ansbach",
		case  48: return 282; //"SK Erlangen",
		case  49: return 283; //"SK Fürth",
		case  52: return 284; //"SK Nürnberg",
		case  55: return 285; //"SK Schwabach",
		case  46: return 286; //"LK Ansbach",
		case  47: return 287; //"LK Erlangen-Höchstadt",
		case  50: return 288; //"LK Fürth",
		case  53: return 289; //"LK Nürnberger Land",
		case  51: return 290; //"LK Neustadt a.d.Aisch-Bad Windsheim",
		case  54: return 291; //"LK Roth",
		case  56: return 292; //"LK Weißenburg-Gunzenhausen",
		default: return null;
	}
}

function rkiFeatureByMapId(mapId) {
	const rkiId = mapIdToRkiObjectId(mapId);
	return rkiData().features
		.map(feature => feature.attributes)
		.find(attribute => attribute.OBJECTID == rkiId) || null;
}