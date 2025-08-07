import { Avatar } from "antd";
import type { FC, ReactNode } from "react";
import { usePictureQuery } from "~/lib/server/services";
import { getInitials } from "~/lib/utils";
import ToolTip from "./tooltip";

interface AvatarPicProps {
  user: User | Assignee | Creation;
  size?: number;
}

interface AssigneeAvatarProps {
  assignee: Assignee | Creation;
  size?: number;
}

/**
 * This component renders avatar-pic section
 * @param {AvatarPicProps} props
 * @returns {ReactNode} The AvatarPic component
 */
const AvatarPic: FC<AvatarPicProps> = ({
  user,
  size,
}: AvatarPicProps): ReactNode => {
  const isUserType = (user: User | Assignee | Creation): user is User =>
    user.hasOwnProperty("displayPic");

  return (
    <>
      {!isUserType(user) ? (
        <AssigneeAvatar size={size} assignee={user} />
      ) : (
        <Avatar size={size} src={user.displayPic}>
          <ToolTip title={user.name}>
            <span>{getInitials(user.name)}</span>
          </ToolTip>
        </Avatar>
      )}
    </>
  );
};

const AssigneeAvatar: FC<AssigneeAvatarProps> = ({
  assignee,
  size,
}: AssigneeAvatarProps): ReactNode => {
  const isAssigneeType = (
    assignee: Assignee | Creation
  ): assignee is Assignee =>
    assignee.hasOwnProperty("id") && assignee.hasOwnProperty("name");

  const { id, name } = isAssigneeType(assignee)
    ? assignee
    : { id: assignee.userId, name: assignee.userName };

  const { data } = usePictureQuery(id);
  return (
    <Avatar size={size} src={data}>
      <ToolTip title={name}>
        <span>{getInitials(name)}</span>
      </ToolTip>
    </Avatar>
  );
};

export default AvatarPic;
