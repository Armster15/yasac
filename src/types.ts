export type RawShow = {
  __typename: string;
  id: number;
  siteUrl: string;
  title: {
    english: string | null;
    romaji: string | null;
    native: string | null;
  };
  externalLinks: {
    site: string;
  }[];
  coverImage: {
    /** 230x327 */
    large: string;
  };
  airingSchedule: {
    nodes: {
      episode: number;
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
  url: string;
  title: {
    english: string | null;
    romaji: string | null;
    native: string | null;
    preferred: string;
  };
  streamingSites: string[];
  coverImage: {
    /** 230x327 */
    large: string;
  };
  airing: {
    dayOfWeek: DaysOfWeek | "NoDayOfWeek";
    time?: string;
    nextAiringEp?: {
      dateObj: Date,
      episode: number
    }
  }
  status: Status;
};

export type Seasons = "WINTER" | "SPRING" | "SUMMER" | "FALL";