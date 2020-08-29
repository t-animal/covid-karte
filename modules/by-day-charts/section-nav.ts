import { loadAndDisplayDailyInfections } from "./daily-infections";
import { loadAndDisplayTotalReportedCasesPerDay } from "./total-cases-per-day";
import { loadAndDisplayDailyReportedInfections } from "./daily-reported-infections";

export function initNavigation() {
    const navElements = Array.from(document.querySelectorAll('.section-nav [data-nav-target]'));

    for(const element of navElements) {
        element.addEventListener('click', (event: Event) => {
            const navTarget = (event.target as HTMLElement).dataset['navTarget'];
            const navGroup = (event.target as HTMLElement).dataset['navGroup'];
            if(navTarget !== undefined && navGroup !== undefined){
                navigate(navGroup, navTarget);
            }
        })
    }
}

function navigate(navGroup: string, navTarget: string) {
    const initDisplay = initiationFunction(navTarget);
    if(initDisplay == null) {
        return;
    }
    document
        .querySelectorAll(`.${navGroup} section, [data-nav-group=${navGroup}`)
        .forEach(node => node.classList.remove('active'));

    document
        .querySelectorAll(`.${navGroup} .${navTarget}, .${navGroup} [data-nav-target=${navTarget}]`)
        .forEach(node => node.classList.add('active'));
    initDisplay();    
}

function initiationFunction(navTarget: string) {
    switch(navTarget) {
        case 'new-cases-per-day-section': return loadAndDisplayDailyInfections;
        case 'total-reported-cases-per-day-section': return loadAndDisplayTotalReportedCasesPerDay;
        case 'newly-reported-cases-per-day-section': return loadAndDisplayDailyReportedInfections;
        default: return null;
    }
}