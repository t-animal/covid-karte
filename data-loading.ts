const DATA_URL = './RKI_Corona_Landkreise.json';

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

export type RkiData = {
	features: [{ attributes: RkiCountyFeatureAttributes }]
}

let rkiData: RkiData;
let loading = false;
let dataListeners: ResolveAndReject[] = [];
type ResolveAndReject = [(arg: RkiData)=>void, (arg: any)=>void];

export function loadRkiData(): Promise<RkiData> {
    if(rkiData !== undefined) {
        return Promise.resolve(rkiData);
    }

    loadDataOnce();

    return new Promise<RkiData>((resolve, reject) => {
        dataListeners.push([resolve, reject]);
    });
}

async function loadDataOnce() {
	if(loading){
		return;
	}
	loading= true;
    try {
        rkiData = await (await fetch(DATA_URL)).json();

        dataListeners.forEach(([resolve, reject]) => resolve(rkiData));
    }catch(e) {
        dataListeners.forEach(([resolve, reject]) => reject(e));
    }
}