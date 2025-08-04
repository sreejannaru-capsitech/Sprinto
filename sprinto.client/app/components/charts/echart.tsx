import { useEffect, useRef, type FC, type ReactNode } from "react";
import type { ReactEChartsProps } from ".";
import { getInstanceByDom, init, type ECharts } from "echarts";

/**
 * This component renders E Chart reusable config component
 * @param {ReactEChartsProps} props - The config props for the component
 * @returns {ReactNode} The EChart component
 */
const EChart: FC<ReactEChartsProps> = ({
  option,
  style,
  settings,
  loading,
  theme,
}: ReactEChartsProps): ReactNode => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chart
    let chart: ECharts | undefined;

    if (chartRef.current !== null) {
      chart = init(chartRef.current, theme);
    }

    // Add chart resize listener
    // ResizeObserver is leading to a bit janky UX
    function resizeChart() {
      chart?.resize();
    }
    window.addEventListener("resize", resizeChart);

    // Return cleanup function
    return () => {
      chart?.dispose();
      window.removeEventListener("resize", resizeChart);
    };
  }, [theme]);

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      if (chart === undefined) {
        return;
      }
      chart.setOption(option, settings);
    }
  }, [option, settings, theme]); // Whenever theme changes we need to add option and setting due to it being deleted in cleanup function

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      if (chart === undefined) {
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      loading === true ? chart.showLoading() : chart.hideLoading();
    }
  }, [loading, theme]);

  return (
    <div ref={chartRef} style={{ width: "100%", height: "100px", ...style }} />
  );
};

export default EChart;