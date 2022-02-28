import { useSession } from "next-auth/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { playListIdState, playListState } from "../Atoms/playlistAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";

const colors = [
    "from-red-500",
    "from-green-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500",
    "from-blue-500",
    "from-indigo-500",
];

function Center() {
    const { data: session, status } = useSession();
    const SpotifyApi = useSpotify();
    const [color, setColor] = useState(null);
    // * User Details
    const [user, setUser] = useState(null);
    //* Playlist
    const [playList, setPlayList] = useRecoilState(playListState);
    // * PlaylistId
    const playListId = useRecoilValue(playListIdState);

    useEffect(() => {
        setColor(shuffle(colors).pop());
    }, [playListId]);

    // * Get Playlist Details
    useEffect(() => {
        SpotifyApi.getPlaylist(playListId)
            .then((playListData) => {
                // console.log("playlist :: ", playListData.body);
                setPlayList(playListData.body);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [SpotifyApi, playListId]);

    //* Get User
    useEffect(() => {
        if (SpotifyApi.getAccessToken()) {
            SpotifyApi.getMe()
                .then((user) => {
                    setUser(user.body);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [session]);

    return (
        <div className="text-white flex-grow overflow-y-scroll scrollbar-hide bg-[#181818]">
            <header className="absolute right-5 top-3 sm:top-5">
                <div className="flex bg-black items-center gap-2 font-bold tracking-[0.14rem] text-gray-300 rounded-full p-2 pr-3 cursor-pointer opacity-90 hover:opacity-80">
                    <img
                        className="rounded-full w-5 h-5 sm:w-7 sm:h-7"
                        src={user?.images[0].url}
                        alt={user?.display_name || "Spotify"}
                    />
                    <h1 className="text-[0.7rem] sm:text-[1rem]">
                        {user?.display_name.slice(0, 9) + " ..."}
                    </h1>
                    <ChevronDownIcon className="h-5 w-5" />
                </div>
            </header>
            <section
                className={`flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-x-7 bg-gradient-to-b to-[#181818] ${color} h-96 sm:h-80 p-8`}>
                <img
                    src={playList?.images[1]?.url || playList?.images[0]?.url || "/github-profile.jpg"}
                    alt=""
                    className="mt-5 sm:ml-5 min-w-[9rem] min-h-[9rem] w-full sm:w-auto max-h-[12rem] object-cover"
                />

                <div className="flex flex-col gap-2 sm:gap-4 font-bold ">
                    <p className="uppercase">Playlist</p>
                    <h1 className="tracking-[0.1rem] text-2xl md:text-4xl xl:text-7xl">
                        {playList?.name || "My Playlist Name"}
                    </h1>
                    <div className="flex gap-1 mt-1 sm:mt-4 text-xs md:text-[1rem] tracking-[0.15rem] ">
                        <p className="uppercase sm:tracking-[0]">{user?.display_name + " - "}</p>
                        <p className="text-gray-500">
                            {playList?.tracks?.items?.length + " songs" || "Songs"}
                        </p>
                    </div>
                </div>
            </section>
            {/* 
            // * Playlist Songs
        */}
            <div className="mb-[6rem]">
                <Songs />
            </div>
        </div>
    );
}

export default Center;
