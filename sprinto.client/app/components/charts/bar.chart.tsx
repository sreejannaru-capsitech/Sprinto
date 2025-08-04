import type { FC, ReactNode } from "react";
import type { BarData, ReactEChartsProps } from ".";
import EChart from "./echart";

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
          color: "rgba(161, 164, 174, 1)"
        },
      },
    ],
  };
  return <EChart option={option} style={{ width: "350px", height: "350px" }} />;
};

export default BarChart;
