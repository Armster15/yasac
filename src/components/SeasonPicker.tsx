import React, { useState } from "react";
import Select from "react-select";
import { IoSnowOutline, IoLeafOutline, IoSunnyOutline } from "react-icons/io5";
import { RiSeedlingLine } from "react-icons/ri";

import type { Seasons } from "$/types";
import { Tabs, Tab } from "$/components/Tabs";
import { capitalize } from "$/utils/capitalize";
import { range } from "$/utils/range";

export interface SeasonPickerProps {
  season: Seasons | undefined
  setSeason: React.Dispatch<React.SetStateAction<Seasons | undefined>>
  year: number | undefined;
  setYear: React.Dispatch<React.SetStateAction<number | undefined>>
}

export const SeasonPicker = ({ season: seasonState, setSeason, year, setYear }: SeasonPickerProps) => {
  const seasons: {season: Seasons; icon: JSX.Element}[] = [
    { season: "WINTER", icon: <IoSnowOutline /> },
    { season: "SPRING", icon: <RiSeedlingLine /> },
    { season: "SUMMER", icon: <IoSunnyOutline /> },
    { season: "FALL", icon: <IoLeafOutline /> },
  ];

  const [yearInputValue, setYearInputValue] = useState(year);

  return (
    <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
      <Tabs className="flex-1">
        {seasons.map((({ season, icon }) => (
          <Tab
            key={season}
            selected={seasonState === season}
            onClick={() => setSeason(season)}
          >
            <span className="flex flex-col sm:flex-row space-x-1 items-center justify-center">
              <span className="text-2xl">{icon}</span>
              <span className="text-sm">{capitalize(season)}</span>
            </span>
          </Tab>
        )))}
      </Tabs>
      
      <Select
        className="min-h-full w-full sm:w-28 focus-ring"
        options={range(new Date().getFullYear() + 2, 2006, -1).map(year => ({ value: year, label: year }))}
        isSearchable={false}
        menuPortalTarget={document.body}
        value={{label: year, value: year}}
        onChange={(e) => e?.value && setYear(e.value)}
        styles={{
          control: (base) => ({
            ...base,
            height: "100%",
            background: "rgb(229 231 235)",
            borderRadius: "0.5rem",
            border: "0",
          }),
          menuPortal: (base) => ({ ...base, zIndex: 15 })
        }}
      /> 
    </div>
  )
}
