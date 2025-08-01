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
 * Extracts 3-letter initials from a name string.
 *
 * @param name - Full name string to extract initials from.
 * @returns A string of 3 uppercase letters based on name structure.
 *
 * @example
 * getInitialsFromName("ecommerce") → "ECE"
 * getInitialsFromName("play ball") → "PYL"
 * getInitialsFromName("rice bubble gum") → "RBM"
 */
export const getAliasFromTitle = (name: string): string => {
  if (!name.trim()) return "";

  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    const word = words[0];
    return word.length >= 3
      ? (word[0] + word[1] + word[word.length - 1]).toUpperCase()
      : word.toUpperCase();
  } else if (words.length === 2) {
    const [first, second] = words;
    return (first[0] + second[0] + second[second.length - 1]).toUpperCase();
  } else {
    const [first, second] = words;
    const last = words[words.length - 1];
    return (first[0] + second[0] + last[last.length - 1]).toUpperCase();
  }
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

/**
 * This function checks if a given string is a valid MongoDB ObjectId.
 * @param {string} id The string to check.
 * @returns {boolean} True if the string is a valid MongoDB ObjectId, false otherwise.
 */
export const isValidMongoId = (id: string | undefined): boolean => {
  if (typeof id !== "string") return false;
  return /^[a-fA-F0-9]{24}$/.test(id);
};
