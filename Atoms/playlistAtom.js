import { atom } from "recoil";

// * store playList details
export const playListState = atom({
    key: "playListState",
    default: null,
});

// * store playListId
export const playListIdState = atom({
    key: "playListIdState",
    default: "44444",
});
