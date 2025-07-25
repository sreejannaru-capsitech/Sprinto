import type { FC, ReactNode } from "react";

/**
 * This component renders logo.icon section
 * @param {IconProps} props
 * @returns {ReactNode} The Logo component
 */
const UserIcon: FC<IconProps> = ({
  fill = "#141B34",
  size = 24,
}: IconProps): ReactNode => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        opacity="0.4"
        d="M7.25 7C7.25 4.37665 9.37665 2.25 12 2.25C14.6234 2.25 16.75 4.37665 16.75 7C16.75 9.62335 14.6234 11.75 12 11.75C9.37665 11.75 7.25 9.62335 7.25 7Z"
        fill={fill}
      />
      <path
        d="M4.25 19C4.25 15.8244 6.82436 13.25 10 13.25H14C17.1756 13.25 19.75 15.8244 19.75 19C19.75 20.5188 18.5188 21.75 17 21.75H7C5.48122 21.75 4.25 20.5188 4.25 19Z"
        fill={fill}
      />
    </svg>
  );
};

export default UserIcon;
