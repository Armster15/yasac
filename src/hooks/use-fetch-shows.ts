import { useEffect, useState, useRef } from "react";
import { useLazyQuery, QueryResult } from "@apollo/client";
import { GET_SEASONAL_ANIME } from "$/queries";
import type { RawShow, Seasons } from "$/types";

interface RawGraphQLResult {
  Page: {
    pageInfo: {
      currentPage: number;
      hasNextPage: boolean;
    };
    media: RawShow[];
  };
}

/**
 * The problem with AniList's API is it only returns 50 media,
 * so to get all media, we need to send multiple requests.
 * This is what this hook is for.
 */
export const useFetchShows = () => {
  const [yearState, setYear] = useState<number | undefined>(undefined);
  const [seasonState, setSeason] = useState<Seasons | undefined>(undefined);
  const [loading, setLoading] = useState<QueryResult["loading"]>(true);
  const [data, setData] = useState<RawGraphQLResult[]>([]);
  const page = useRef(1);

  const [query, queryResult] =
    useLazyQuery<RawGraphQLResult>(GET_SEASONAL_ANIME);

  
  // Fetch function for lazy fetching
  const fetch = (season: Seasons, year: number) => {
    // If the season/year changes, reset all the data
    if((season !== seasonState) || (year !== yearState)) {
      setData([])
    }

    setSeason(season);
    setYear(year);
    setLoading(true);

    query({
      variables: {
        year: year,
        season: season,
        page: page.current,
      },
    });
  };


  // Gets called when a query is completed successfully (this is where we push data to the array)
  useEffect(() => {
    if (!queryResult.data) return;

    setData((data) => {
      for (const item of data) {
        if (
          item.Page.pageInfo.currentPage ===
          queryResult.data!.Page.pageInfo.currentPage
        ) {
          return [...data];
        }
      }

      data.push(queryResult.data!);
      return [...data];
    });

    if (queryResult.data.Page.pageInfo.hasNextPage) {
      page.current += 1;
      fetch(seasonState!, yearState!);
    } else {
      setLoading(false);
    }
  }, [queryResult.data, queryResult.loading]);

  return {
    fetch,
    result: {
      ...queryResult,
      loading: loading,
      data: data,
    },
  };
};

// export const useFetchShows = () => {
//   const [loading, setLoading] = useState(true);
//   const [dataState, setData] = useState<RawGraphQLResult[]>([]);
//   const [error, setError] = useState<any | undefined>();
//   const page = useRef(1);

//   const fetchData = async() => {
//     const variables = {
//       season: "SPRING",
//       year: 2022,
//       page: page.current
//     }

//     const url = "https://graphql.anilist.co";
//     const options: RequestInit = {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       },
//       body: JSON.stringify({
//         query: RAW_GET_SEASONAL_ANIME,
//         variables: variables
//       }),
//     }

//     let res: Response | undefined = undefined;
//     try {
//       res = await fetch(url, options)
//     }
//     catch (e) {
//       return {"error": e}
//     }

//     if(res) {
//       if(res.ok) {
//         let json: RawGraphQLResult = await res.json();
//         return {"success": json};
//       }
//       else {
//         let json = await res.json();
//         return {"error": json}
//       }
//     }
//   }

//   useEffect(() => {
//     (async() => {
//       let data = await fetchData();

//       if(data?.error) setError(data.error)
//       else if(data?.success) {
//         setData(dataState => {
//           for(const item of dataState) {
//             if(item.data.Page.pageInfo.currentPage === data?.success!.data.Page.pageInfo.currentPage) {
//               return [...dataState]
//             }
//           }
//           dataState.push(data?.success!)
//           return [...dataState]
//         })
//       }
//       else {
//         setError("Unknown Error")
//       }

//       setLoading(false);
//     })()
//   }, [])

//   return {
//     data: dataState,
//     error,
//     loading
//   }
// }
