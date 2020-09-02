import { loadAndDisplayMap } from './modules/map/map.js';
import { loadAndDisplayCountyList } from './modules/county-list';
import { loadAndDisplayDataAge } from './modules/data-age';
import { loadAndDisplaySums, syncSumDisplayToCountySelection } from './modules/summed-data.js';
import { loadAndDisplayDailyInfections } from './modules/charts/daily-infections';
import { initNavigation } from './modules/charts/section-nav';

import * as countyInfo from './modules/county-information';

loadAndDisplayMap();
loadAndDisplayCountyList();
loadAndDisplayDataAge();
loadAndDisplaySums();
loadAndDisplayDailyInfections();

initNavigation();
countyInfo.initCallbacks();
syncSumDisplayToCountySelection();