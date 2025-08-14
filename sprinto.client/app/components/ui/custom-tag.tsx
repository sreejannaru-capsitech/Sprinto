import { Tag } from "antd";
import type { CSSProperties, FC, ReactNode } from "react";
import { USER_ADMIN, USER_EMPLOYEE, USER_TEAM_LEAD } from "~/lib/const";

interface CustomTagProps {
  large?: boolean;
  role?: UserRole;
  text?: string;
}

/**
 * This component renders custom-tag section
 * @param {CustomTagProps} props
 * @returns {ReactNode} The CustomTag component
 */
const CustomTag: FC<CustomTagProps> = ({
  large,
  role,
  text,
}: CustomTagProps): ReactNode => {
  const tagStyles: CSSProperties = {
    padding: "4px 8px",
    fontSize: 14,
    borderRadius: 8,
  };

  const getColor = (role: UserRole) => {
    switch (role) {
    //   case USER_TEAM_LEAD:
    //     return "purple";
      case USER_ADMIN:
        return "var(--color-red)";
      case USER_TEAM_LEAD:
        return "DodgerBlue";
      default:
        return "";
    }
  };

  return (
    <Tag
      //   color={role ? getColor(role) : undefined}
      style={large ? tagStyles : undefined}
      className="capitalize"
    >
      {role ? (
        <span style={{ color: getColor(role) }}>
          {role === USER_TEAM_LEAD ? "Team Lead" : role}
        </span>
      ) : (
        <span>{text}</span>
      )}
    </Tag>
  );
};

export default CustomTag;
