import { Button } from "antd";
import { useMemo, type ReactNode } from "react";
import { useDispatch } from "react-redux";
import { NavLink, Outlet, useParams } from "react-router";
import { AlertIcon } from "~/lib/icons";
import { useProjectsQuery } from "~/lib/server/services";
import { setProject, type AppDispatch } from "~/lib/store";
import { isValidMongoId } from "~/lib/utils";
import CenteredLayout from "./centered-layout";

/**
 * This component renders project-layout section
 * @returns {ReactNode} The ProjectLayout component
 */
const ProjectLayout = (): ReactNode => {
  const { projectId } = useParams();
  const { data } = useProjectsQuery();

  const dispatch: AppDispatch = useDispatch();

  const project = useMemo(() => {
    if (!isValidMongoId(projectId)) return undefined;
    var _project = data?.result?.find((p) => p.id === projectId);
    if (_project) dispatch(setProject(_project));
    return _project;
  }, [data, projectId]);

  return project ? (
    <Outlet />
  ) : (
    <CenteredLayout>
      <div style={{ textAlign: "center" }}>
        <AlertIcon size={44} />
        <p
          className="text-primary-dark font-bold"
          style={{
            fontSize: "1rem",
            marginBlockStart: "0.5rem",
          }}
        >
          The project does not exist
        </p>
        <NavLink to="/projects">
          <Button>View Projects</Button>
        </NavLink>
      </div>
    </CenteredLayout>
  );
};

export default ProjectLayout;
