import React, { useState } from "react";
import { useAtom } from "jotai";
import NoCrunchyrollIcon from "$/media/no-crunchyroll.webp";
import HidiveIcon from "$/media/hidive.webp";
import PlaceholderImage from "$/media/placeholder_100x141.png";

import { filterAtom } from "$/atoms";
import { Show as ShowType, Status as StatusType } from "$/types";
import { Status } from "./Status";
import { useShow } from "$/hooks/use-show";

export const Show = ({ showId }: { showId: ShowType["id"] }) => {
  const { show } = useShow(showId);
  const [filter] = useAtom(filterAtom);

  if(!show) return null;
  if (filter && !filter.includes(show.status)) return null;

  return (
    <>
      <div className="flex">
        <img
          src={show.coverImage.medium}
          width={100}
          alt={`Cover Image for ${show.title.preferred}`}
          loading="lazy"
          onError={(e) => {
            // If the placeholder does not load, this prevents an infinite loop of failing to load the placeholder
            if(e.currentTarget.src !== PlaceholderImage) {
              // Placeholder from https://plchldr.co
              e.currentTarget.src = PlaceholderImage
            }
          }}
        />
        <div className="flex-grow mx-3 my-[6px] space-y-1 block">
          <h2 className="font-semibold">{show.title.preferred}</h2>
          
          {show.airingTime && <p><span className="sr-only">Airs at </span>{show.airingTime}</p>}

          {!show.streamingSites.includes("Crunchyroll") && (
            <div>
              <div className="flex space-x-1 items-center">
                <img loading="lazy" aria-hidden={true} className="h-[1.25em]" src={NoCrunchyrollIcon} />
                <p>Not on Crunchyroll</p>
              </div>

              {show.streamingSites.includes("HIDIVE") && (
                <div className="flex space-x-1 items-center">
                  <img loading="lazy" aria-hidden={true} className="h-[1.25em]" src={HidiveIcon} />
                  <p>On HIDIVE</p>
                </div>
              )}
            </div>
          )}

          <Status showId={showId} />
        </div>
      </div>
      <hr />
    </>
  );
};
