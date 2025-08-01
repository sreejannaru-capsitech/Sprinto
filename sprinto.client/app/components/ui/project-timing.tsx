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
          <span>
            {proj.startDate
              ? dayjs.utc(proj.startDate).format("Do MMMM")
              : "Not Started"}
          </span>
          <span style={{ margin: "0 4px" }}>—</span>
          <span>
            {proj.deadline
              ? dayjs.utc(proj.deadline).format("Do MMMM")
              : "Not Decided"}
          </span>
        </>
      ) : (
        <span>Not Started Yet</span>
      )}
    </>
  );
};

export default ProjectTiming;
