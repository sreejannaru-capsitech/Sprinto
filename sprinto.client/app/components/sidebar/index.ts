
/**
 * The isCurrentPath function checks if the current path matches the given path.
 * @param {string} path - The path to check against.
 * @returns {string} The CSS class to apply to the menu item.
 */
export const isCurrentPath = (path: string): string => {
  if (window.location.pathname.split("/")[1] === path) {
    return "ant-menu-item-selected";
  }
  return "";
};
