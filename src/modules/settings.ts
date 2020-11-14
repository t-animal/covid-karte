import { getElementOrThrow } from './helpers';

export const enum LabelScheme {
  RKI = 'RKI',
  RiskLayer = 'RiskLayer'
}

export type Settings = {
  labelScheme: LabelScheme,
}

const defaultSettings: Settings = {
  labelScheme: LabelScheme.RKI,
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
      loadSettings()[key] = parseSetting(key, value) ?? defaultSettings[key];
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

function parseSetting<Key extends keyof Settings>(key: Key, value: string): Settings[Key]  | null{
  if(key === 'labelScheme') {
    return value === 'RKI' ? LabelScheme.RKI : LabelScheme.RiskLayer;
  }
  return null;
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