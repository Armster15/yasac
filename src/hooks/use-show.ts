import { useEffect, useState } from "react";
import { showsAtom } from "$/atoms";
import { useAtom } from "jotai";

import type { Show } from "$/types";
import { setShowInBackend } from "$/utils/format-shows";

export const useShow = (showId: Show["id"]) => {
    const [shows, setShows] = useAtom(showsAtom);
    const [showState, setShowState] = useState<Show | undefined>(undefined);

    // Whenever the `shows` atom is updated, "refetch" the show
    useEffect(() => {
        if(!shows) return;
        let show = shows.find(show => show.id === showId);
        if(!show) throw new Error("A show was not found in the `useShow` hook. This was not supposed to happen, so this is a logic error")
        setShowState(show)
    }, [shows])

    const setShow = (show: Show) => {
        // 1. Update hook's `show` state
        setShowState(show);

        // 2. Update show for the global `shows` atom
        setShows(shows => {
            return shows?.map((_show) => _show.id === show.id ? show : _show);
        })

        // 3. Update backend
        setShowInBackend(show);
    }

    return {
        show: showState,
        setShow
    };
}