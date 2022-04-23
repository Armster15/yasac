import React from "react";
import cn from "classnames";
import { useShow } from "$/hooks/use-show";
import { Status as StatusType, Show } from "$/types";
import { StatusDropdown } from "./StatusDropdown";

export interface StatusProps {
  showId: Show["id"];
  // status: StatusType;
  // setStatus: React.Dispatch<React.SetStateAction<StatusType>>;
}

export const Status = ({ showId }: StatusProps) => {
  const { show, setShow } = useShow(showId);
  if (!show) return null;

  const styles = {
    hype: "text-white bg-blue-500 fire",
    "will-watch": "text-white bg-green-500",
    maybe: "text-white bg-yellow-500",
    "not-watching": "text-white bg-red-500",
    ["no-status"]: "bg-gray-200 opacity-50",
  };

  return (
    <div className="flex items-center space-x-1">
      <span
        className={cn(
          "rounded-lg px-2 py-1 text-xs uppercase",
          styles[show.status]
        )}
      >
        {show.status.replaceAll("-", " ")}
      </span>
      <StatusDropdown
        status={show.status}
        setStatus={(status: StatusType) => {
          // let rawStatuses = localStorage.getItem("statuses");
          // let statuses: { [key: Show["id"]]: StatusType } = rawStatuses ? JSON.parse(rawStatuses) : {};
          // statuses[show.id] = status;
          // localStorage.setItem("statuses", JSON.stringify(statuses))

          let _show = { ...show };
          _show.status = status;
          setShow(_show);
        }}
      />
    </div>
  );
};
