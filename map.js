const map = L
	.map(document.querySelector('div.map'))
	.setView([51.163361, 10.447683], 6);

async function loadRkiData() {
	return (await fetch('./RKI_Corona_Landkreise.json')).json();
}

async function loadCountyMap() {
	return (await fetch('./county-map.json')).json();
}

async function loadStateMap() {
	return (await fetch('./state-map.json')).json();
}

async function loadAndDisplayMap() {
	const rkiDataResponse = loadRkiData();
	const countiesResponse = loadCountyMap();
	const statesResponse = loadStateMap();

	const rkiData = await rkiDataResponse;

	function getCountyPopup(layer) {
		const data = rkiFeatureByMapId(rkiData, layer.feature.properties.ID_3);
		if(data == null){
			const prop = layer.feature.properties;
			return `<b>${prop.NAME_3}, ${prop.NAME_2}</b><br>
			Noch nicht den RKI Daten zugeordnet<br><br>

			<b>Mithelfen?</b> Bitte finde in den RKI Daten den passenden Datensatz.<br>
			Bitte teile mir die ID des RKI Datensatzes und die Zahl <b>'${prop.ID_3}'</b> mit.`;
		}
		return data.county;
	}

	L.geoJSON(await countiesResponse, {
		style: function (feature) {
			const data = rkiFeatureByMapId(rkiData, feature.properties.ID_3);
			return {
				color: '#888',
				weight: 0.5,
				fillColor: color(data?.cases7_per_100k),
				fillOpacity: 1,
				stroke: true,
			};
		}
	}).bindPopup(getCountyPopup)
	  .bindTooltip(getCountyPopup)
	  .addTo(map);

	L.geoJSON(await statesResponse, {
		style: {
			color: '#888',
			weight: 2,
			fill: false
		}
	}).addTo(map);
}