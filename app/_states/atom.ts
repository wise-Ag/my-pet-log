import { ImagesType } from "@/app/diary/_components/Input/ImageInput";
import { atom } from "jotai";

export const diaryImagesAtom = atom<ImagesType[]>([]);

export const deletedVideoIdsAtom = atom<number[]>([]);

export const userAccessTokenAtom = atom(null);

export const userRefreshTokenAtom = atom(null);

export const isLoggedInAtom = atom(false);

export const loadDiaryDraftAtom = atom(false);

export const saveDiaryDraftAtom = atom(false);

export const diaryDataAtom = atom<{ title: string | null; content: string | null }>({ title: null, content: null });
