import React from "react";
import type { DivProps } from "react-html-props";
import { AccessibleButton, AccessibleButtonProps } from "accessible-button";
import cn from "classnames";
import { useCompositeState, Composite, CompositeItem, CompositeStateReturn } from "reakit/Composite";

export const Tabs = ({ className, children, ...props }: DivProps) => {
  const composite = useCompositeState();

  return (
  <Composite {...composite} className={cn("bg-gray-200 px-1 py-1 rounded-lg flex space-x-5", className)} {...props}>
    {/* This is to pass the composite state to all the Tabs passed as children */}
    {
      React.Children.map(children, (child) => {
        return React.cloneElement(child as React.ReactElement<TabProps>, {
          composite: composite
        });
      })
    }
  </Composite>
  )
}

export interface TabProps extends AccessibleButtonProps {
  selected?: boolean;
  composite?: CompositeStateReturn;
}

export const Tab = ({ className, selected, composite, ...props }: TabProps) => (
  <CompositeItem
    {...composite}
    className={cn(
      "flex-1 rounded duration-150 ring-offset-gray-200 h-full py-1 px-2 focus-ring",
      selected && "bg-white",
      selected ? "active:bg-opacity-70" : "active:bg-gray-300 focus-visible:bg-gray-300",
      className
    )}
    {...props}
  />
)