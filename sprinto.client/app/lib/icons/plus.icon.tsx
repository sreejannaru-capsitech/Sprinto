import type { FC, ReactNode } from "react";

/**
 * This component renders logo.icon section
 * @param {IconProps} props
 * @returns {ReactNode} The Logo component
 */
const PlusIcon: FC<IconProps> = ({
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
        d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12Z"
        fill={fill}
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 7C12.5523 7 13 7.44772 13 8V11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H13V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V13H8C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11H11V8C11 7.44772 11.4477 7 12 7Z"
        fill="white"
      />
    </svg>
  );
};

export default PlusIcon;
