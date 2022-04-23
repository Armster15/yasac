export type RawShow = {
  __typename: string;
  id: number;
  title: {
    english: string | null;
    romaji: string | null;
    native: string | null;
  };
  externalLinks: {
    site: string;
  }[];
  coverImage: {
    /** 100x141 */
    medium: string;
  };
  airingSchedule: {
    nodes: {
      airingAt: EpochTimeStamp;
    }[];
  };
};

export type Status =
  | "no-status"
  | "will-watch"
  | "maybe"
  | "not-watching"
  | "hype";

export type DaysOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type Show = {
  id: number;
  title: {
    english: string | null;
    romaji: string | null;
    native: string | null;
    preferred: string;
  };
  streamingSites: string[];
  coverImage: {
    /** 100x141 */
    medium: string;
  };
  airingDayOfWeek: DaysOfWeek | "NoDayOfWeek";
  airingTime?: string;
  status: Status;
};

export type Seasons = "WINTER" | "SPRING" | "SUMMER" | "FALL";