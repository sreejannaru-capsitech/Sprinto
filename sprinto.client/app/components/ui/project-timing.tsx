import { Flex } from "antd";
import dayjs from "dayjs";
import type { FC, ReactNode } from "react";
import { CalenderIcon } from "~/lib/icons";

import "~/styles/items.css";
import CustomTooltip from "./tooltip";

interface ProjectTimingProps {
  proj: Project;
  gap?: number;
  small?: boolean;
}

/**
 * This component renders project-timing section
 * @param {ProjectTimingProps} props
 * @returns {ReactNode} The ProjectTiming component
 */
const ProjectTiming: FC<ProjectTimingProps> = ({
  proj,
  gap = 2,
  small = false,
}: ProjectTimingProps): ReactNode => {
  const biggerFormat = "Do MMM YYYY";
  const format = small ? "DD-MM-YY" : biggerFormat;

  return (
    <Flex align="center" gap={gap}>
      <CalenderIcon size={15} />
      {proj.startDate || proj.deadline ? (
        <span className={small ? "smaller-text" : ""}>
          {proj.startDate ? (
            <CustomTooltip
              title={dayjs.utc(proj.startDate).format(biggerFormat)}
            >
              <span>{dayjs.utc(proj.startDate).format(format)}</span>
            </CustomTooltip>
          ) : (
            small ? "Not Set" : "Not Started"
          )}
          <span style={{ margin: "0 4px" }}>—</span>
          {proj.deadline ? (
            <CustomTooltip
              title={dayjs.utc(proj.deadline).format(biggerFormat)}
            >
              <span
                style={{
                  color: dayjs.utc(proj.deadline).isBefore(dayjs.utc(), "day")
                    ? "var(--color-red)"
                    : "",
                }}
              >
                {dayjs.utc(proj.deadline).format(format)}
              </span>
            </CustomTooltip>
          ) : (
            small ? "Not Set" : "Not Decided"
          )}
        </span>
      ) : (
        <span>Not Started Yet</span>
      )}
    </Flex>
  );
};

export default ProjectTiming;
