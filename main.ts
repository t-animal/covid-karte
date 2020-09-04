import { loadAndDisplayMap } from './modules/map/map.js';
import { loadAndDisplayCountyList } from './modules/county-list';
import { loadAndDisplayDataAge } from './modules/data-age';
import { loadAndDisplaySums } from './modules/summed-data.js';
import { loadAndRenderDailyCasesBySickday } from './modules/charts/daily-cases-by-sickday';
import { initNavigation } from './modules/charts/section-nav';

import * as countyInfo from './modules/map/county-information';
import * as summedData from './modules/summed-data.js';
import * as dailyCasesBySickday from './modules/charts/daily-cases-by-sickday';
import * as dailyCasesByReportday from './modules/charts/daily-cases-by-reportday';
import * as cmulativeCasesPerDay from './modules/charts/cumulative-cases-per-day';

loadAndDisplayMap();
loadAndDisplayCountyList();
loadAndDisplayDataAge();
loadAndDisplaySums();
loadAndRenderDailyCasesBySickday();

initNavigation();
countyInfo.initCallbacks();
summedData.reactToCountySelection();
dailyCasesBySickday.reactToCountySelection();
dailyCasesByReportday.reactToCountySelection();
cmulativeCasesPerDay.reactToCountySelection();