import { atom } from "jotai";
import { GoogleLoginData } from "./functions/fetchUser";
import { JobsStruct } from "./functions/addJobMonth";
import { GroupsType, PendingGroupsType } from "./functions/fetchGroups";
import { MessageType } from "./components/PopDown";
import { Border, SlideUpData } from "./components/SlideUp";

export const globalLoadingAtom = atom(false);
export const loadingPopupAtom = atom<string | null>(null);
export const errorAtom = atom<{message: string, type: MessageType, show: boolean}>({message: "N/A", type: "default", show: false});

export const tokenAtom = atom<string | null>(null);
export const userDataAtom = atom<GoogleLoginData | null>(null);

export type Selected = "home" | "calendar" | "groups" | "addJob" | "account";

export const currentRouteAtom = atom<Selected>("home");
export const jobsAtom = atom<JobsStruct[]>([]);
export const groupsAtom = atom<GroupsType[]>([]);
export const pendingGroupsAtom = atom<PendingGroupsType[]>([]);
export const jobSelectedAtom = atom<{id: number, title: string} | null>(null);
export const slideUpAtom = atom<SlideUpData>({show: false, header: "N/A", children: null});
export const slideUpBorderColorAtom = atom<Border>("black");
export const clickGroupAtom = atom<string | null>(null);