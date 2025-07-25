import type { FC, ReactNode } from "react";

/**
 * This component renders logo.icon section
 * @param {IconProps} props
 * @returns {ReactNode} The Logo component
 */
const CloseRoundedIcon: FC<IconProps> = ({
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
        d="M12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12C1.25 6.06294 6.06294 1.25 12 1.25Z"
        fill={fill}
      />
      <path
        d="M14.3692 8.22436C14.7619 7.90402 15.3409 7.92663 15.707 8.29272C16.0732 8.65883 16.0958 9.23783 15.7754 9.63061L15.707 9.70678L13.4131 11.9997L15.7061 14.2927L15.7754 14.3689C16.0955 14.7617 16.0721 15.3408 15.7061 15.7068C15.3399 16.0728 14.7609 16.0956 14.3682 15.7751L14.292 15.7068L12 13.4138L9.70802 15.7068C9.31756 16.0973 8.68451 16.0972 8.29396 15.7068C7.90341 15.3163 7.90345 14.6833 8.29396 14.2927L10.5859 11.9997L8.29298 9.70678L8.22462 9.63061C7.90427 9.23783 7.92687 8.65883 8.29298 8.29272C8.6591 7.92663 9.23811 7.90402 9.63087 8.22436L9.70704 8.29272L12 10.5857L14.293 8.29272L14.3692 8.22436Z"
        fill="white"
      />
    </svg>
  );
};

export default CloseRoundedIcon;
