
/**
 * This function returns the initials of a user's full name
 * @param {string} fullName The full name of the user
 * @returns {string} The initials of the user's full name
 */
export const getInitials = (fullName: string): string => {
  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 0) return "";

  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";

  return (first + last).toUpperCase();
};
