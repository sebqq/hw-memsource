import customParseFormat from "dayjs/plugin/customParseFormat";
import utcPlugin from "dayjs/plugin/utc";
import dayjs from "dayjs";

dayjs.extend(customParseFormat);
// utcPlugin provides us ability seamlessly switch between UTC nad Locale
dayjs.extend(utcPlugin);

/**
 * I've noticed that on Memsource dashboard they are using different
 * timezone formatting for 'Due' is using local timestamp and 'created'
 * is using UTC timestamp.
 *
 * I've decided to use dates across the in consistent fashion so in this app we
 * will always provide Local datetime to our "End users".
 */

export const SERVER_DATE_FORMAT = "YYYY-MM-DDTHH:mm:ssZZ";
export const DISPLAY_DATE_FORMAT = "MMMM D, YYYY HH:mm";

/**
 * Accepts datetime string in UTC format and returns localized Dayjs object.
 *
 * @param date string in UTC format
 */
export function str2UtcDate(date: string) {
  return dayjs(date, SERVER_DATE_FORMAT);
}

/**
 * Accepts datetime string in Local format and returns UTC Dayjs object.
 *
 * @param date string in UTC format
 */
export function str2LocalDate(date: string) {
  return dayjs.utc(date, SERVER_DATE_FORMAT);
}

export function displayFromLocalString(date: string) {
  return str2LocalDate(date).format(DISPLAY_DATE_FORMAT);
}

export function displayFromUtcString(date: string) {
  return str2UtcDate(date).format(DISPLAY_DATE_FORMAT);
}
