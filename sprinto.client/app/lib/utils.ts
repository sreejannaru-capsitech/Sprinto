import { AxiosError } from "axios";
import type { NotificationApi } from "~/hooks/useAntNotification";

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

/**
 * This function handles API errors and displays appropriate messages
 * @param {Error} error The error object
 * @param {NotificationApi} _api The notification API
 * @param {string} message The message to display
 */
export const handleApiError = (
  error: Error,
  _api: NotificationApi,
  message: string
) => {
  if (error instanceof AxiosError) {
    _api({ message: error.message, type: "error" });
  } else {
    _api({ message: message, type: "error" });
  }
};

/**
 * Truncates a given string to a specified length, adding "..." if truncated.
 *
 * @param text - The input string to truncate.
 * @param limit - The maximum number of characters allowed before truncation.
 * @returns The original string if it's within the limit, or a truncated string with "..." appended.
 *
 * @example
 * truncateText("Hello World", 5); // "Hello..."
 * truncateText("Hi", 10);         // "Hi"
 */
export const truncateText = (text: string, limit: number): string => {
  if (text.length <= limit) return text;
  return text.slice(0, limit).trimEnd() + "...";
};
