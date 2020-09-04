import * as countyInfo from './modules/map/county-information';
import * as cumulativeCasesPerDay from './modules/charts/cumulative-cases-per-day';
import * as dailyCasesByReportday from './modules/charts/daily-cases-by-reportday';
import * as dailyCasesBySickday from './modules/charts/daily-cases-by-sickday';
import * as summedData from './modules/summed-data.js';

import { initNavigation } from './modules/charts/section-nav';
import { loadAndDisplayCountyList } from './modules/county-list';
import { loadAndDisplayDataAge } from './modules/data-age';
import { loadAndDisplayMap } from './modules/map/map.js';
import { loadAndDisplaySums } from './modules/summed-data.js';
import { loadAndRenderDailyCasesBySickday } from './modules/charts/daily-cases-by-sickday';

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
cumulativeCasesPerDay.reactToCountySelection();