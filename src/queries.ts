import { gql } from "@apollo/client";

export const RAW_GET_SEASONAL_ANIME = `
  query ($page: Int = 1, $season: MediaSeason!, $year: Int!) {
    Page(page: $page) {
      pageInfo {
        currentPage
        hasNextPage
      }
      media(
        type: ANIME
        season: $season
        seasonYear: $year
        format_in: [TV]
        countryOfOrigin: "JP"
        sort: TITLE_ENGLISH
      ) {
        id,
        title {
          english,
          romaji,
          native
        },
        externalLinks {
          site
        },
        coverImage {
          large
        },
        airingSchedule {
          nodes {
            episode
            airingAt
          }
        }  
      }
    }
  }
`;

export const GET_SEASONAL_ANIME = gql(RAW_GET_SEASONAL_ANIME);