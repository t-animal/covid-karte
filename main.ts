import { loadAndDisplayMap } from './modules/map/map.js';
import { loadAndDisplayCountyList } from './modules/county-list';
import { loadAndDisplayDataAge } from './modules/data-age';
import { loadAndDisplaySums } from './modules/summed-data.js';
import { loadAndDisplayDailyInfections } from './modules/charts/daily-infections';
import { initNavigation } from './modules/charts/section-nav';

import * as countyInfo from './modules/map/county-information';
import * as summedData from './modules/summed-data.js';
import * as dailyInfections from './modules/charts/daily-infections';
import * as dailyReportedInfections from './modules/charts/daily-reported-infections';
import * as totalCumulativeCasesPerDay from './modules/charts/total-cases-per-day';

loadAndDisplayMap();
loadAndDisplayCountyList();
loadAndDisplayDataAge();
loadAndDisplaySums();
loadAndDisplayDailyInfections();

initNavigation();
countyInfo.initCallbacks();
summedData.reactToCountySelection();
dailyInfections.reactToCountySelection();
dailyReportedInfections.reactToCountySelection();
totalCumulativeCasesPerDay.reactToCountySelection();