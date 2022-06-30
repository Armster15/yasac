import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useAtom } from "jotai";
import { Portal, Disclosure } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import cn from "classnames";
import { IoChevronUp, IoChevronDown } from "react-icons/io5";

import { showsAtom, filterAtom } from "./atoms";
import type { RawShow, Status, Seasons } from "./types";
import { Show } from "./components/Show";
import { LoadingIcon } from "./components/LoadingIcon";
import { formatShows, organizeShowsByDayOfWeek } from "./utils/format-shows";
import { Tabs, Tab } from "./components/Tabs";
import { SeasonPicker } from "./components/SeasonPicker";
import { useFetchShows } from "./hooks/use-fetch-shows";

const filterSelectLabels: { [key in Status]: string } = {
  hype: "Hype",
  "will-watch": "Will Watch",
  maybe: "Maybe",
  "not-watching": "Not Watching",
  "no-status": "No Status",
};

export const App: React.FC = () => {
  const [year, setYear] = useState<number | undefined>(undefined);
  const [season, setSeason] = useState<Seasons | undefined>(undefined);
  const [filter, setFilter] = useAtom(filterAtom);
  const [display, setDisplay] = useState<"grid" | "legacy">("grid");
  const [shows, setShows] = useAtom(showsAtom);
  const {
    fetch: fetchFromApi,
    result: { loading, data, error },
  } = useFetchShows();

  useEffect(() => {
    let date = new Date();
    setYear(date.getFullYear());

    let month = new Date().toLocaleString("en-US", { month: "long" });

    if (month === "December" || month === "January" || month === "February")
      setSeason("WINTER");
    else if (month === "March" || month === "April" || month === "May")
      setSeason("SPRING");
    else if (month === "June" || month === "July" || month === "August")
      setSeason("SUMMER");
    else if (
      month === "September" ||
      month === "October" ||
      month === "November"
    )
      setSeason("FALL");
    else throw new Error("Invalid month (not supposed to happen)");
  }, []);

  useEffect(() => {
    if (season && year) {
      fetchFromApi(season, year);
    }
  }, [season, year]);

  useEffect(() => {
    const rawShows: RawShow[] | undefined = data
      ?.map((item) => item.Page.media)
      .flat();
    const _shows = formatShows(rawShows);
    setShows(_shows);
  }, [data]);

  // Page background color
  useEffect(
    () => document.querySelector("html")!.classList.add("bg-gray-300"),
    []
  );

  if (loading || error)
    return (
      <Portal>
        <div className="fixed inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-white p-12">
          {(loading && !error) && <LoadingIcon className="h-[20vh]" />}
          {error && (
            <>
              <IoClose className="text-[35vh]" />
              <p>An unexpected error occured. Please report this error.</p>
              <Disclosure>
                <Disclosure.Button className="border-2 rounded px-2 py-1 mt-5 active:bg-gray-100 active:bg-opacity-30 focus-ring ring-offset-[#929599]">
                  Show Error
                </Disclosure.Button>
                <Disclosure.Panel>
                  <pre className="overflow-auto max-h-[60vh] whitespace-pre-wrap border-2 rounded bg-white text-black mt-5">
                    {JSON.stringify(error, null, 2)}
                  </pre>
                </Disclosure.Panel>
              </Disclosure>
            </>
          )}
        </div>
      </Portal>
    );
  return (
    <div className="min-h-screen p-6 md:p-8 space-y-3">
      <h1 className="text-2xl font-medium">
        <span className="font-bold">Y</span>et{" "}
        <span className="font-bold">A</span>nother{" "}
        <span className="font-bold">S</span>easonal{" "}
        <span className="font-bold">A</span>nime{" "}
        <span className="font-bold">C</span>hart{" "}
      </h1>
      <SeasonPicker
        season={season}
        setSeason={setSeason}
        year={year}
        setYear={setYear}
      />

      <div className="flex space-x-3">
        <Select
          className="flex-1"
          placeholder="Filter"
          menuPortalTarget={document.body}
          isMulti
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 15 }) }}
          onChange={(e) => {
            let newFilters = e.map((v) => v.value) as Status[];
            if (newFilters.length === 0) setFilter(undefined);
            else setFilter(newFilters);
          }}
          value={
            filter
              ? filter.map((status) => ({
                  value: status,
                  label: filterSelectLabels[status],
                }))
              : []
          }
          options={[
            { value: "hype", label: "Hype" },
            { value: "will-watch", label: "Will Watch" },
            { value: "maybe", label: "Maybe" },
            { value: "not-watching", label: "Not Watching" },
            { value: "no-status", label: "No Status" },
          ]}
        />

        <Tabs>
          <Tab selected={display == "grid"} onClick={() => setDisplay("grid")}>
            Grid
          </Tab>
          <Tab
            onClick={() => setDisplay("legacy")}
            selected={display == "legacy"}
          >
            Legacy
          </Tab>
        </Tabs>
      </div>
      
      {display === "grid" && 
        <div className="pt-2">
          {shows &&
            Array.from(organizeShowsByDayOfWeek(shows)).map(
              ([dayOfWeek, shows]) => {
                if (dayOfWeek === "NoDayOfWeek" && shows.length === 0) {
                  return null;
                }

                return (
                  <Disclosure defaultOpen={true}>
                    {({ open }) => (
                      <div className="space-y-3 mb-8">
                        <div className="flex items-start space-x-3">
                          <Disclosure.Button className={cn(
                            "duration-150 rounded border-2 !p-1 border-gray-400",
                            "hover:shadow active:bg-gray-400 not-focus-visible:not-active:focus:ring-2",
                            "focus-ring ring-gray-500 ring-offset-gray-300"
                          )}>
                            {open ? <IoChevronUp /> : <IoChevronDown />}
                          </Disclosure.Button>

                          <h2 className="font-semibold text-2xl">
                            {dayOfWeek === "NoDayOfWeek"
                              ? "No Airing Day Yet"
                              : dayOfWeek}
                          </h2>
                        </div>

                        <Disclosure.Panel className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                          {shows?.map((show) => (
                            <Show showId={show.id} key={show.id} />
                          ))}
                        </Disclosure.Panel>
                      </div>
                    )}
                  </Disclosure>
                );
              }
            )}
        </div>
      }

      {display === "legacy" && 
        <div
          className={cn(
            "grid-cols-1 grid gap-6",
            "md:grid-cols-2"
          )}
        >
          {shows &&
            Array.from(organizeShowsByDayOfWeek(shows)).map(
              ([dayOfWeek, shows], index) => {
                if (dayOfWeek === "NoDayOfWeek" && shows.length === 0)
                  return null;
                return (
                  <div key={index} className="bg-white rounded">
                    <h1 className="sticky top-0 bg-white border-b-2 z-10 font-bold py-2 px-3 mt-1">
                      {dayOfWeek === "NoDayOfWeek"
                        ? "No Airing Day Yet"
                        : dayOfWeek}
                    </h1>
                    <div
                      className={cn(
                        "overflow-y-auto",
                        "md:max-h-[67vh] "
                      )}
                    >
                      {shows.map((show) => (
                        <Show showId={show.id} key={show.id} />
                      ))}
                    </div>
                  </div>
                );
              }
            )}
        </div>
      }
    </div>
  );
};
