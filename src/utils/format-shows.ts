import type { RawShow, Show, DaysOfWeek, Status } from "$/types";
import { allEqual } from "$/utils";

/**
 * Turns an array of `RawShow` objects to an array of `Show` objects
 * More specifically this adds, edits, and removes data from the
 * raw AniList response to make data management nicer
 */
export const formatShows = (rawShows: RawShow[]) => {
  // 1. Create new base structure
  const shows: Show[] = [];
  // console.log(YAML)

  rawShows.forEach((rawShow, index) => {
    // ====== 1. Get airing day of week and time of airing ======
    let airingDaysOfWeek: DaysOfWeek[] = [] // ["Monday", "Monday", "Monday", "Tuesday", "Monday", ...]
    let airingTimes: string[] = []
    let allAiringDayInfo: {dateObj: Date; episode: number}[] = []

    rawShow.airingSchedule.nodes.map((node) => {
      // a. Retrieve epoch time
      let epochTime = node.airingAt;

      // b. Convert epoch time to a `Date` object
      let date = new Date(0);
      date.setUTCSeconds(epochTime);

      // c. Retrieve day of week from the `Date` object
      const dayOfWeek = date.toLocaleString("en", {
        weekday: "long",
      }) as DaysOfWeek;

      // d. Retrieve time of airing from the `Date` object
      const airingTime = date.toLocaleTimeString(navigator.language, {hour: 'numeric', minute:'2-digit'})


      airingDaysOfWeek.push(dayOfWeek);
      airingTimes.push(airingTime);
      allAiringDayInfo.push({
         dateObj: date,
         episode: node.episode
      });
    });

    let airingDayOfWeek: DaysOfWeek | "NoDayOfWeek"
    let airingTime: string | undefined = undefined;
    let nextAiringDayInfo: {dateObj: Date; episode: number} | undefined;

    airingDayOfWeek = allEqual(airingDaysOfWeek) ? airingDaysOfWeek[0] : "NoDayOfWeek"
    airingTime = allEqual(airingTimes) ? airingTimes[0] : undefined
    nextAiringDayInfo = allAiringDayInfo.length >= 1 ? allAiringDayInfo[0] : undefined

    // ====== 2. Retrieve status ======
    let showInBackend = getShowInBackend(rawShow.id);

    // ====== 3. Format `externalLinks` ======
    const streamingSites = rawShow.externalLinks.map((v) => v.site);

    // ====== 4. Add data new formatted structure ======
    shows.push({
      id: rawShow.id,
      url: rawShow.siteUrl,
      title: {
        ...rawShow.title,
        preferred:
          rawShow.title.english ??
          (rawShow.title.romaji ?? rawShow.title.native)!,
      },
      coverImage: rawShow.coverImage,
      airing: {
        dayOfWeek: airingDayOfWeek,
        time: airingTime,
        nextAiringEp: nextAiringDayInfo
      },
      status: showInBackend?.status ?? "no-status",
      streamingSites: streamingSites,
    });
  });

  return shows;
};

/**
 * Returns a `Map` with each show organized within its respective
 * airing day of week
 */
export const organizeShowsByDayOfWeek = (shows: Show[]) => {
  let showsByDayOfWeek: Map<DaysOfWeek | "NoDayOfWeek", Show[]> = new Map([
    ["Monday", []],
    ["Tuesday", []],
    ["Wednesday", []],
    ["Thursday", []],
    ["Friday", []],
    ["Saturday", []],
    ["Sunday", []],
    ["NoDayOfWeek", []],
  ]);

  shows.forEach((show) => {
    // Copy of list of the shows for that specific day of week (ex. all the shows for Monday)
    let showsForDayOfWeek = showsByDayOfWeek.get(show.airing.dayOfWeek)!;
    showsForDayOfWeek.push(show);
    showsByDayOfWeek.set(show.airing.dayOfWeek, showsForDayOfWeek);
  });

  return showsByDayOfWeek;
};


export const getShowInBackend = (showId: Show["id"]): ShowInBackend | undefined => {
  let rawShows = localStorage.getItem("shows");
  let shows: ShowsInBackend = rawShows ? JSON.parse(rawShows) : {};
  return shows[showId]
}

export const setShowInBackend = (show: Show) => {
  let rawShows = localStorage.getItem("shows");
  let shows: ShowsInBackend = rawShows ? JSON.parse(rawShows) : {};

  if(show.status === "no-status") {
    delete shows[show.id]
  }

  else {
    shows[show.id] = {
      status: show.status
    }
  }

  localStorage.setItem("shows", JSON.stringify(shows))

  return true;
}

type ShowsInBackend = {
  [id: Show["id"]]: ShowInBackend
};

type ShowInBackend = {
  status: Status;
}

// export const getShowInBackend = (showId: Show["id"]) => {
//   let rawShows = localStorage.getItem("shows");

//   /*
//     {
//       "Show 1": { "id": 1, "status": "hype" },
//       "Show 2": { "id": 2, "status": "not-watching" },
//     }
//   */
//   let shows: ShowsInBackend = rawShows ? JSON.parse(rawShows) : {};

//   /*
//     [
//       { "id": 1, "status": "hype" }, 
//       { "id": 2, "status": "not-watching" }
//     ]
//   */
//   let values = Object.values(shows);

//   /* { "id": 2, "status": "not-watching" } */
//   let show = values.find((v) => v.id === showId);

//   return show;
// };


// export const setShowInBackend = (show: Show) => {
//   let rawShows = localStorage.getItem("shows");

//   /*
//     {
//       "Show 1": { "id": 1, "status": "hype" },
//       "Show 2": { "id": 2, "status": "not-watching" },
//     }
//   */
//   let shows: ShowsInBackend = rawShows ? JSON.parse(rawShows) : {};
  
//   // If show has no status, remove it from the storage as there is no point in storing it
//   if(show.status !== "no-status") {
//     shows[show.title.preferred] = {
//         status: show.status,
//         id: show.id
//     }
//   }

//   else {
//     Object.entries(shows).forEach(function ([ name, { id } ]) {
//       if (id === show.id) {
//         delete shows[name]
//       }
//     })
//   }

//   localStorage.setItem("shows", JSON.stringify(shows))
  
//   return true;
// }
