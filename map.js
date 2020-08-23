
const map = L
	.map(document.querySelector('div'))
	.setView([51.163361, 10.447683], 6);

L.geoJSON(data(), {
	style: function (feature) {
		const data = rkiFeatureByMapId(feature.properties.ID_3);
		return {
			color: '#888',
			weight: 0.5,
			fillColor: color(data?.cases7_per_100k),
			fillOpacity: 1,
			stroke: true,
		};
	}
}).bindPopup(function (layer) {
	const data = rkiFeatureByMapId(layer.feature.properties.ID_3);
	if(data == null){
		const prop = layer.feature.properties;
		return `<b>${prop.NAME_3}, ${prop.NAME_2}</b><br>
		Noch nicht den RKI Daten zugeordnet<br><br>

		<b>Mithelfen?</b> Bitte finde in den RKI Daten den passenden Datensatz.<br>
		Bitte teile mir die ID des RKI Datensatzes und die Zahl <b>'${prop.ID_3}'</b> mit.`;
	}
	return data.county;
}).bindTooltip(function (layer) {
	const data = rkiFeatureByMapId(layer.feature.properties.ID_3);
	if(data == null){
		const prop = layer.feature.properties;
		return `<b>${prop.NAME_3}, ${prop.NAME_2}</b><br>
		Noch nicht den RKI Daten zugeordnet<br><br>

		<b>Mithelfen?</b> Bitte finde in den RKI Daten den passenden Datensatz.<br>
		Bitte teile mir die ID des RKI Datensatzes und die Zahl <b>'${prop.ID_3}'</b> mit.`;
	}
	return data.county;
}).addTo(map);

L.geoJSON(states(), {
	style: {
		color: '#888',
		weight: 2,
		fill: false
	}
}).addTo(map);