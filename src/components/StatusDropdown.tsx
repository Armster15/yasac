import React, { useEffect } from "react";
import cn from "classnames";
import { IoPencilOutline, IoClose } from "react-icons/io5";
import { Menu, Transition, Portal } from "@headlessui/react";
import { usePopper } from "react-popper";

import { elementsWithOverflow } from "$/utils";
import { showScrollbar, hideScrollbar } from "$/utils/scrollbar";
import { Status } from "$/types";

export interface StatusDropdownProps {
  status: Status;
  setStatus: (status: Status) => void;
}

export const StatusDropdown = ({ status, setStatus }: StatusDropdownProps) => {
  const popperElRef = React.useRef(null);
  const [targetElement, setTargetElement] =
    React.useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = React.useState(null);
  const { styles, attributes } = usePopper(targetElement, popperElement, {
    placement: "bottom",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 8],
        },
      },
    ],
  });

  return (
    <div className="flex items-center justify-center">
      <div className="inline-block text-left">
        <Menu>
          {({ open }) => {
            useEffect(() => {
              if (open) {
                hideScrollbar();
                elementsWithOverflow().forEach((el) => hideScrollbar(el));
              } else {
                showScrollbar();
                elementsWithOverflow().forEach((el) => showScrollbar(el));
              }
            }, [open]);

            return (
              <>
                <div ref={setTargetElement} className="rounded-md shadow-sm">
                  <Menu.Button
                    className="relative white-btn !py-1 !rounded-lg focus-ring"
                    aria-label="Edit Status"
                  >
                    <IoPencilOutline />
                  </Menu.Button>
                </div>

                <Portal>
                  <div
                    className="z-20"
                    ref={popperElRef}
                    style={styles.popper}
                    {...attributes.popper}
                  >
                    <Transition
                      show={open}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                      beforeEnter={() => setPopperElement(popperElRef.current)}
                      afterLeave={() => setPopperElement(null)}
                    >
                      <Menu.Items
                        static
                        className="w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
                      >
                        <div className="px-1 py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => setStatus("hype")}
                                className={cn(
                                  "dropdown-btn",
                                  active
                                    ? "bg-blue-500 text-white"
                                    : "text-blue-600"
                                )}
                              >
                                HYPE!
                              </button>
                            )}
                          </Menu.Item>

                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => setStatus("will-watch")}
                                className={cn(
                                  "dropdown-btn",
                                  active
                                    ? "bg-green-500 text-white"
                                    : "text-emerald-600"
                                )}
                              >
                                Will Watch
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => setStatus("maybe")}
                                className={cn(
                                  "dropdown-btn",
                                  active
                                    ? "bg-yellow-500 text-white"
                                    : "text-yellow-600"
                                )}
                              >
                                Maybe Watching
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => setStatus("not-watching")}
                                className={cn(
                                  "dropdown-btn",
                                  active
                                    ? "bg-red-500 text-white"
                                    : "text-red-600"
                                )}
                              >
                                Not Watching
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                        <div className="px-1 py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => setStatus("no-status")}
                                className={cn(
                                  "dropdown-btn text-gray-900 !font-normal",
                                  active && "bg-gray-300"
                                )}
                              >
                                Clear Status
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={cn(
                                  "dropdown-btn text-gray-900 !font-normal",
                                  active && "bg-gray-300"
                                )}
                              >
                                Close
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </div>
                </Portal>
              </>
            );
          }}
        </Menu>
      </div>
    </div>
  );
};
