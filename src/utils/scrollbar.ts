export const getScrollbarWidth = (element?: HTMLElement) => {
  if (element) return element.offsetWidth - element.clientWidth;
  else return window.innerWidth - document.querySelector("html")!.clientWidth;
};

export const hideScrollbar = (element?: HTMLElement) => {
  let scrollbarWidth = getScrollbarWidth(element);
  element = element ?? document.body;

  element.style.paddingRight = `${
    parseInt(
      element.style.paddingRight === "" ? "0" : element.style.paddingRight
    ) + scrollbarWidth
  }px`;
  element.style.overflow = "hidden";
};

export const showScrollbar = (element?: HTMLElement) => {
  (element ?? document.body).style.overflow = "auto";
  let scrollbarWidth = getScrollbarWidth(element);
  element = element ?? document.body;
  element.style.paddingRight = `${
    parseInt(element.style.paddingRight) - scrollbarWidth
  }px`;
};
