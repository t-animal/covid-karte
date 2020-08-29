import { loadAndDisplayMap } from './modules/map/map.js';
import { loadAndDisplayCountyList } from './modules/county-list';
import { loadAndDisplayDataAge } from './modules/data-age';
import { loadAndDisplaySums } from './modules/summed-data.js';
import { loadAndDisplayDailyInfections } from './modules/by-day-charts/daily-infections';
import { initNavigation } from './modules/by-day-charts/section-nav';

import * as countyInfo from './modules/county-information';

loadAndDisplayMap();
loadAndDisplayCountyList();
loadAndDisplayDataAge();
loadAndDisplaySums();
loadAndDisplayDailyInfections();

initNavigation();
countyInfo.initCallbacks();