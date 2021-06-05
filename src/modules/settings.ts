import { getElementOrThrow } from './helpers';

export const enum LabelScheme {
  RKI = 'RKI',
  RiskLayer = 'RiskLayer',
  Bundesnotbremse = 'Bundesnotbremse'
}

export const enum Interpolation {
  None = 'None',
  Linear = 'Linear'
}

export type Settings = {
  labelScheme: LabelScheme,
  interpolate: Interpolation,
}

const defaultSettings: Settings = {
  labelScheme: LabelScheme.RKI,
  interpolate: Interpolation.None,
};

let currentSettings: Settings | null = null;

export function loadSettings(): Settings {
  if(currentSettings === null) {
    currentSettings = loadSettingsFromStorage();
  }
  return currentSettings;
}

export function initCallbacks(): void {
  const settingUiElem = Array.from(document.querySelectorAll<HTMLInputElement>('input.setting'));

  for(const uiElem of settingUiElem) {
    const key = uiElem.name;
    const value = uiElem.value;

    const isValidKey = (key: string): key is keyof Settings =>
      Object.keys(defaultSettings).indexOf(key) >= 0;

    if(!isValidKey(key)){
      continue;
    }

    uiElem.oninput = () => {
      updateSetting(key, value);
      storeSettings();
    };
  }
}

export function displayCurrentSettings(): void {
  const settingsForm = getElementOrThrow<HTMLFormElement>('.settings-form');
  const settings = loadSettings();

  for(const [key, value] of Object.entries(settings)){
    const item = settingsForm.elements.namedItem(key) as RadioNodeList | HTMLInputElement;
    if(item === null) {
      continue;
    }
    item.value = value;
  }
}

function updateSetting<Key extends keyof Settings>(key: Key, value: string) {
  loadSettings()[key] = defaultSettings[key];

  if (key === 'labelScheme') {
    const setScheme = (scheme: LabelScheme) => loadSettings()['labelScheme'] = scheme;
    console.log(value);
    switch(value){
      case 'RKI': return setScheme(LabelScheme.RKI);
      case 'RiskLayer': return setScheme(LabelScheme.RiskLayer);
      case 'Bundesnotbremse': return setScheme(LabelScheme.Bundesnotbremse);
    }
  }

  if (key === 'interpolate') {
    loadSettings()['interpolate'] = value === 'None' ? Interpolation.None : Interpolation.Linear;
  }
}

function storeSettings(): void {
  if(currentSettings === null) {
    return;
  }

  localStorage.setItem('settings', JSON.stringify(currentSettings));
}

function loadSettingsFromStorage(): Settings {
  const storedSettings = localStorage.getItem('settings');

  return storedSettings !== null ? JSON.parse(storedSettings) : defaultSettings;
}