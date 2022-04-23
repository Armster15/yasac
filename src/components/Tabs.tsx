import React from "react";
import type { DivProps } from "react-html-props";
import { AccessibleButton, AccessibleButtonProps } from "accessible-button";
import cn from "classnames";

export const Tabs = ({ className, ...props }: DivProps) => (
  <div className={cn("bg-gray-200 px-1 py-1 rounded-lg flex space-x-1", className)} {...props}></div>
)

export interface TabProps extends AccessibleButtonProps {
  selected?: boolean;
}
export const Tab = ({ className, selected, ...props }: TabProps) => (
  <AccessibleButton
    className={cn(
      "flex-1 rounded duration-150 ring-offset-gray-200 h-full py-1 px-2",
      selected && "bg-white",
      selected ? "active:bg-opacity-70" : "active:bg-gray-300 focus-visible:bg-gray-300",
      className
    )}
    {...props}
  />
)