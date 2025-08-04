import type { EChartsOption, SetOptionOpts } from "echarts";
import type { CSSProperties } from "react";

export interface ReactEChartsProps {
  option: EChartsOption;
  style?: CSSProperties;
  settings?: SetOptionOpts;
  loading?: boolean;
  theme?: "light" | "dark";
}

export interface PieData {
  value: number;
  name: string;
}

export interface BarData {
  value: number[];
  name: string[];
}
