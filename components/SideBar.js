import {
    HomeIcon,
    SearchIcon,
    LibraryIcon,
    PlusCircleIcon,
    HeartIcon,
    RssIcon,
} from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { playListIdState } from "../Atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";

function SideBar() {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    //* Playlists User
    const [playList, setPlayList] = useState([]);
    //* PlaylistID
    const [playListId, setplayListId] = useRecoilState(playListIdState);

    //* Get User Playlists
    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi
                .getUserPlaylists()
                .then((data) => {
                    setPlayList(data.body.items);
                    setplayListId(data.body.items[0].id);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [session, spotifyApi]);

    // console.log(" playList id : ", playListId);
    return (
        <div className="text-gray-500 p-5 text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide hidden xl:block">
            <div className="space-y-3">
                {/* 
                 // ! for sign out
                */}
                {/* <button className="flex gap-2 items-center hover:text-white" onClick={() => signOut()}>
                    LogOut
                </button> */}
                <button className="flex gap-2 items-center hover:text-white">
                    <HomeIcon className="w-5 h-5" />
                    <span>Home</span>
                </button>
                <button className="flex gap-2 items-center hover:text-white">
                    <SearchIcon className="w-5 h-5" />
                    <span>Search</span>
                </button>
                <button className="flex gap-2 items-center hover:text-white">
                    <LibraryIcon className="w-5 h-5" />
                    <span>Your Library</span>
                </button>
                <hr className="border-t-[0.1px] border-gray-900" />

                <button className="flex gap-2 items-center hover:text-white">
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>Create Playlist</span>
                </button>
                <button className="flex gap-2 items-center hover:text-white">
                    <HeartIcon className="w-5 h-5" />
                    <span>Like Songs</span>
                </button>
                <button className="flex gap-2 items-center hover:text-white">
                    <RssIcon className="w-5 h-5" />
                    <span>Your Episodes</span>
                </button>
                <hr className="border-t-[0.1px] border-gray-900" />
                {/* PlayList ... */}
                {playList.map((playlist, index) => (
                    <p
                        key={playList.id}
                        className="cursor-pointer hover:text-white"
                        onClick={() => setplayListId(playlist.id)}>
                        {playlist.name}
                    </p>
                ))}
            </div>
        </div>
    );
}

export default SideBar;
