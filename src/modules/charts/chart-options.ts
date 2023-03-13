import { ChartOptions, ChartTypeRegistry, TooltipItem } from 'chart.js';

import { nowPlus12Hours } from '../helpers';

export type TooltipLabelGenerator = (data: TooltipItem<keyof ChartTypeRegistry> ) => string;
export function commonChartOptions(
  stacked: boolean,
  tooltipLabelGenerator: TooltipLabelGenerator,
  limits: number | undefined,
): ChartOptions {
  const commonAxisSettings = {
    gridLines: {
      color: 'rgba(255, 255, 255, 0.1)',
      borderDash: [5]
    },
    stacked
  };

  return {
    animation: { duration: 0 },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month',
          tooltipFormat: 'EEE dd.MM.yyyy',
          minUnit: 'day'
        },
        min: new Date(2020, 2, 1).getTime(),
        max: nowPlus12Hours().getTime(),
        ...commonAxisSettings
      },
      y: {
        min: 0,
        max: limits,
        ...commonAxisSettings
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        callbacks: {
          label:  tooltipLabelGenerator
        }
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x'
        },
        zoom: {
          mode: 'x',
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          // onZoom: (...args) => console.log(args),
          // onZoomComplete: (...args) => console.log(args),
        },
        limits: {
          y: {
            min: limits,
            max: limits,
          },
          x: {
            min: new Date(2020, 2).getTime(),
            max: nowPlus12Hours().getTime()
          },
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
  };

}