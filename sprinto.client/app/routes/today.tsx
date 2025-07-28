import type { ReactNode } from "react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { Flex, Space, Typography } from "antd";

import "~/styles/today-page.css";
import type { MetaArgs } from "react-router";

export const meta = ({}: MetaArgs) => {
  return [
    { title: "Today — Sprinto" },
    { name: "description", content: "Stay focused on what matters" },
  ];
}

dayjs.extend(advancedFormat);

/**
 * This component renders today section
 * @returns {ReactNode} The TodayPage component
 */
const TodayPage = (): ReactNode => {
  const fullOrdinal = dayjs().format("Do");
  const day = fullOrdinal.slice(0, -2);
  const suffix = fullOrdinal.slice(-2);
  const month = dayjs().format("MMMM");

  return (
    <Space direction="vertical">
      <Flex align="end">
        <h1 className="text-primary today-text-day">{day}</h1>

        <Typography.Text className="today-text-suffix">
          {suffix}
        </Typography.Text>

        <Typography.Text className="today-text-suffix today-text-month">
          {month}
        </Typography.Text>
      </Flex>
    </Space>
  );
};

export default TodayPage;
