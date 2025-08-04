import type { FC, ReactNode } from "react";
import EChart from "./echart";
import type { PieData, ReactEChartsProps } from ".";

interface PieChartProps {
  data: PieData[];
}

/**
 * This component renders Pie Chart component
 * @returns {ReactNode} The PieChart component
 */
const PieChart: FC<PieChartProps> = ({ data }: PieChartProps): ReactNode => {
  const option: ReactEChartsProps["option"] = {
    color: [
      "rgba(20, 27, 52, 0.24)",
      "rgba(20, 27, 52, 0.6)",
      "rgba(161, 164, 174, 1)",
      "rgba(114, 118, 133, 1)",
      "rgba(5, 5, 5, 0.06)",
    ], // your custom colors
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "5%",
      left: "center",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: true,
        padAngle: 5,
        itemStyle: {
          borderRadius: 10,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "normal",
          },
        },
        labelLine: {
          show: false,
        },
        data: data,
      },
    ],
  };
  return <EChart option={option} style={{ width: "250px", height: "350px" }} />;
};

export default PieChart;
