import chroma from 'chroma-js';

import { getElementOrThrow } from '../helpers';
import { Interpolation, LabelScheme, loadSettings } from '../settings';

type TransitionPoint = { max: number, color: string };
type ColorSchemeData = TransitionPoint[];
type ColorRange = { min: TransitionPoint, max: TransitionPoint };

const rkiScheme: ColorSchemeData = [
  { max: 0,    color: '#ccf5c4' },
  { max: 5,    color: '#faf7c9' },
  { max: 25,   color: '#faee7d' },
  { max: 50,   color: '#fab133' },
  { max: 100,  color: '#d03523' },
  { max: 250,  color: '#921214' },
  { max: 500,  color: '#651212' },
  { max: 1000, color: '#d80182' }
];

const riskLayerScheme: ColorSchemeData = [
  { max: 0,    color: '#2c83b9' },
  { max: 5,    color: '#25ba94' },
  { max: 15,   color: '#80d38d' },
  { max: 25,   color: '#feffb1' },
  { max: 35,   color: '#feca81' },
  { max: 50,   color: '#f1894a' },
  { max: 100,  color: '#eb1a1f' },
  { max: 200,  color: '#ac1316' },
  { max: 350,  color: '#b275dd' },
  { max: 500,  color: '#5b189b' },
  { max: 1000, color: '#222222' }
];

const bundesnotbremseScheme: ColorSchemeData = [
  { max: 0,    color: '#228231' },
  { max: 10,   color: '#80d38d' },
  { max: 35,   color: '#fffc65' },
  { max: 50,   color: '#ffc14a' },
  { max: 100,  color: '#ef7405' },
  { max: 165,  color: '#ff1b1b' },
  { max: 1000, color: '#ac1316' }
];

const defaultColorSchemeEntry = {
  max: 0,
  color: '#fff',
};

export function colorForIncidence(sevenDaysInfectionsPer100k: number | undefined): string {

  if (sevenDaysInfectionsPer100k === undefined) {
    return defaultColorSchemeEntry.color;
  }

  const colorRange = getColor(getSelectedColorScheme(), sevenDaysInfectionsPer100k);
  if (colorRange === undefined) {
    return defaultColorSchemeEntry.color;
  }

  const colorFunction = getColorFunction();
  return colorFunction(colorRange, sevenDaysInfectionsPer100k);
}

export function renderColorScheme(): void {
  const renderBox = (color: string) =>  {
    const div = document.createElement('div');
    div.style.backgroundColor = color;
    div.classList.add('legend-color');
    return div;
  };
  const renderListEntry = (min: number | undefined, max: number, color: string) => {
    const div = document.createElement('div');
    div.textContent = (min !== undefined ? `> ${min}, ` : '') + `<= ${max}`;
    div.appendChild(renderBox(color));
    return div;
  };

  const elem = getElementOrThrow('.label-container');
  const colorScheme = getSelectedColorScheme();

  let min;
  for(const entry of colorScheme){
    elem.appendChild(renderListEntry(min, entry.max, entry.color));
    min = entry.max;
  }
}

function colorWithInterpolation(colorRange: ColorRange, sevenDaysInfectionsPer100k: number): string {
  const { min: lowerBoundColor, max: upperBoundColor } = colorRange;

  const interpolationFunction = chroma.scale([lowerBoundColor.color, upperBoundColor.color]);

  const factor = (sevenDaysInfectionsPer100k - lowerBoundColor.max) / (upperBoundColor.max - lowerBoundColor.max);
  return interpolationFunction(factor).css();
}

function colorWithoutInterpolation(colorRange: ColorRange, sevenDaysInfectionsPer100k: number): string {
  return colorRange.max.color;
}

function getSelectedColorScheme() {
  switch(loadSettings().labelScheme) {
    case LabelScheme.RiskLayer: return riskLayerScheme;
    case LabelScheme.Bundesnotbremse: return bundesnotbremseScheme;
    case LabelScheme.RKI: // fallthrough
    default: return rkiScheme;

  }
  if (loadSettings().labelScheme === LabelScheme.RiskLayer) {
    return riskLayerScheme;
  }
  return rkiScheme;
}

function getColorFunction() {
  if (loadSettings().interpolate == Interpolation.Linear) {
    return colorWithInterpolation;
  }
  return colorWithoutInterpolation;
}

function getColor(scheme: ColorSchemeData, incidence: number | undefined): ColorRange | undefined {
  if (incidence === undefined) {
    return undefined;
  }

  let min = defaultColorSchemeEntry;
  for (const entry of scheme) {
    if (incidence <= entry.max) {
      return {
        min,
        max: entry,
      };
    }
    min = entry;
  }

  return undefined;
}
