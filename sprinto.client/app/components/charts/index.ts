import type { EChartsOption, SetOptionOpts } from "echarts";
import type { CSSProperties } from "react";

export interface ReactEChartsProps {
  option: EChartsOption;
  style?: CSSProperties;
  settings?: SetOptionOpts;
  loading?: boolean;
  theme?: "light" | "dark";
}
