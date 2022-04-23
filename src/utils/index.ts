/**
 * Checks if all elements in an array are the same
 * Derived from https://stackoverflow.com/a/35568895/5721784
 */
export const allEqual = (arr: any[]) =>
  arr.length === 0 ? false : arr.every((v) => v === arr[0]);

export const elementsWithOverflow = () => {
  let elements: HTMLElement[] = [];
  [...document.querySelectorAll<HTMLElement>("body *")].forEach((e) => {
    let overflowX = window.getComputedStyle(e)['overflowX'];
    if ((overflowX  === 'scroll' || overflowX  === 'auto') && (e.scrollHeight - e.clientHeight > 0)) elements.push(e);
  });
  return elements;
};

