import * as countyInfo from './modules/map/county-information';
import * as cumulativeCasesPerDay from './modules/charts/cumulative-cases-per-day';
import * as dailyCasesByReportday from './modules/charts/daily-cases-by-reportday';
import * as dailyCasesBySickday from './modules/charts/daily-cases-by-sickday';
import * as summedData from './modules/summed-data/summed-data.js';
import * as countyMapSorting from './modules/county-list/sorting';
import * as countySelectionPersistence from './modules/county-selection-persistence';
import * as settings from './modules/settings';
import * as historyAnimation from './modules/history-animation/controls';
import * as map from './modules/map/map';
import * as dataAge from './modules/data-age';

import { initNavigation } from './modules/charts/section-nav';
import { loadAndDisplayCountyList } from './modules/county-list/county-list';
import { loadAndDisplayCountyMapOverlay } from './modules/map/county-information';
import { loadAndDisplayDataAge } from './modules/data-age';
import { loadAndDisplayMap } from './modules/map/map.js';
import { loadAndDisplaySums } from './modules/summed-data/summed-data.js';
import { loadAndRenderDailyCasesBySickday } from './modules/charts/daily-cases-by-sickday';
import { restoreCountySelectionFromUrl } from './modules/county-selection-persistence';
import { renderColorScheme } from './modules/map/label-scheme';

restoreCountySelectionFromUrl();

loadAndDisplayMap();
loadAndDisplayCountyMapOverlay();
loadAndDisplayCountyList();
loadAndDisplayDataAge();
loadAndDisplaySums();
loadAndRenderDailyCasesBySickday();
renderColorScheme();

initNavigation();
countyInfo.initCallbacks();
countyMapSorting.initCallbacks();
map.initCallbacks();
dataAge.initCallbacks();
historyAnimation.initCallbacks();

settings.initCallbacks();
settings.displayCurrentSettings();

summedData.reactToCountySelection();
dailyCasesBySickday.reactToCountySelection();
dailyCasesByReportday.reactToCountySelection();
cumulativeCasesPerDay.reactToCountySelection();
countySelectionPersistence.reactToCountySelection();