/**
 * Capitalizes the first letter in a string
 * From https://www.digitalocean.com/community/tutorials/js-capitalizing-strings
 */
export const capitalize = (str: string) =>
  str
    .trim()
    .toLowerCase()
    .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
