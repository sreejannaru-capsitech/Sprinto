import type { FC, ReactNode } from "react";

/**
 * This component renders logo.icon section
 * @param {IconProps} props
 * @returns {ReactNode} The Logo component
 */
const DownArrow: FC<IconProps> = ({
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
        xmlns="http://www.w3.org/2000/svg"
        d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DownArrow;
