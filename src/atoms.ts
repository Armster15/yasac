import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils'
import { Show, Status } from "$/types";

export const filterAtom = atomWithStorage<Status[] | undefined>("filters", undefined);
export const showsAtom = atom<Show[] | undefined>(undefined);
