import ReactEcharts from "echarts-for-react";
import type { FC, ReactNode } from "react";
import type { ReactEChartsProps } from ".";

interface BarChartProps {
  data: BarData;
}

/**
 * This component renders bar.chart section
 * @param {BarChartProps} props
 * @returns {ReactNode} The BarChart component
 */
const BarChart: FC<BarChartProps> = ({ data }: BarChartProps): ReactNode => {
  const option: ReactEChartsProps["option"] = {
    yAxis: {
      type: "category",
      data: data.name,
    },
    xAxis: {
      type: "value",
    },
    series: [
      {
        data: data.value,
        type: "bar",
        itemStyle: {
          color: "rgba(161, 164, 174, 1)",
        },
      },
    ],
  };
  return (
    <ReactEcharts
      style={{ width: "100%", height: 350, overflow: "auto" }}
      opts={{ renderer: "svg" }}
      option={option}
    />
  );
};

export default BarChart;
