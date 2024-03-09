/* eslint-disable no-underscore-dangle,no-unused-vars */
import React, { useEffect, useRef } from 'react';
import { Chart, registerables, Title } from 'chart.js';
import { useSelector } from 'react-redux';

const ChartPie = () => {
  const { themeValues } = useSelector((state) => state.settings);
  const chartContainer = useRef(null);

  const LegendLabels = React.useMemo(() => {
    return {
      font: {
        size: 14,
        family: themeValues.font,
      },
      padding: 20,
      usePointStyle: true,
      boxWidth: 8,
    };
  }, [themeValues]);
  const ChartTooltip = React.useMemo(() => {
    return {
      enabled: true,
      position: 'nearest',
      backgroundColor: themeValues.foreground,
      titleColor: themeValues.primary,
      titleFont: themeValues.font,
      bodyColor: themeValues.body,
      bodyFont: themeValues.font,
      bodySpacing: 10,
      padding: 15,
      borderColor: themeValues.separator,
      borderWidth: 1,
      cornerRadius: parseInt(themeValues.borderRadiusMd, 10),
      displayColors: false,
      intersect: true,
    };
  }, [themeValues]);

  const randomIntArrayInRange = (min, max, n = 1) =>
      Array.from(
          { length: n },
          () => Math.floor(Math.random() * (max - min + 1)) + min
      );

  const data = React.useMemo(() => {
    return {
      labels: ['Desktop', 'Tablet', 'Mobile'],
      datasets: [
        {
          label: '',
          borderColor: [themeValues.primary, themeValues.secondary, themeValues.tertiary],
          backgroundColor: [`rgba(${themeValues.primaryrgb},0.1)`, `rgba(${themeValues.secondaryrgb},0.1)`, `rgba(${themeValues.tertiaryrgb},0.1)`],
          borderWidth: 2,
          data: randomIntArrayInRange(10000, 70000, 3)
          // data: [15, 20, 40],
        },
      ],
    };
  }, [themeValues]);
  const config = React.useMemo(() => {
    return {
      type: 'pie',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: false,
        plugins: {
          crosshair: false,
          datalabels: true,
          tooltip: ChartTooltip,
          legend: {
            position: 'bottom',
            labels: LegendLabels,
          },
          streaming: false,
        },
      },
      data,
    };
  }, [data, LegendLabels, ChartTooltip]);

  useEffect(() => {
    let myChart = null;
    if (chartContainer && chartContainer.current) {
      Chart.register(...registerables);
      myChart = new Chart(chartContainer.current, config);
      Chart.register(Title);
    }
    return () => {
      if (myChart) {
        myChart.destroy();
      }
    };
  }, [config]);

  return <canvas ref={chartContainer} />;
};

export default React.memo(ChartPie);
