import dayjs from "dayjs";
import type { FC, ReactNode } from "react";
import { CalenderIcon } from "~/lib/icons";

interface ProjectTimingProps {
  proj: Project;
}

/**
 * This component renders project-timing section
 * @param {ProjectTimingProps} props
 * @returns {ReactNode} The ProjectTiming component
 */
const ProjectTiming: FC<ProjectTimingProps> = ({
  proj,
}: ProjectTimingProps): ReactNode => {
  return (
    <>
      <CalenderIcon size={15} />
      {proj.startDate || proj.deadline ? (
        <>
          {proj.startDate ? (
            <span>{dayjs.utc(proj.startDate).format("Do MMM YYYY")}</span>
          ) : (
            "Not Started"
          )}
          <span style={{ margin: "0 4px" }}>—</span>
          {proj.deadline ? (
            <span
              style={{
                color: dayjs.utc(proj.deadline).isBefore(dayjs.utc(), "day")
                  ? "var(--color-red)"
                  : "",
              }}
            >
              {dayjs.utc(proj.deadline).format("Do MMM YYYY")}
            </span>
          ) : (
            "Not Decided"
          )}
        </>
      ) : (
        <span>Not Started Yet</span>
      )}
    </>
  );
};

export default ProjectTiming;
