import { atom } from "jotai";
import { Show, Status } from "$/types";

export const filterAtom = atom<Status[] | undefined>(undefined);
export const showsAtom = atom<Show[] | undefined>(undefined);
