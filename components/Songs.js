import { DotsHorizontalIcon, HeartIcon, PlayIcon } from "@heroicons/react/outline";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { playListState } from "../Atoms/playlistAtom";
import { currentTrackIdState, currentTrackState, isPlayingState } from "../Atoms/songAtom";
import useSpotify from "../hooks/useSpotify";

export default function Songs() {
    const playList = useRecoilValue(playListState);
    // * show playlist details
    // console.log(playList);

    return (
        <div className="w-[96%] mx-auto mt-8 text-[1rem] text-gray-200 tracking-[0.1rem] font-mono ">
            <div className="flex items-center p-3 border-b border-white  mb-4">
                <span className="flex-1 ml-8"># Title</span>
                <span className="flex-1 ml-[15rem] hidden md:block">Album</span>
                <span className="flex-1 text-right mr-[2rem]">Time</span>
            </div>
            {playList?.tracks.items.map((song, index) => (
                <Song key={song.track.id} song={song} index={index} />
            ))}
        </div>
    );
}

function Song({ song, index, keyId }) {
    const SpotifyApi = useSpotify();

    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

    // * Convert milliseconds to seconds and minutes
    const calcTime = (millis) => {
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    // * play a song
    const playSong = async () => {
        setCurrentTrackId(song.track.id);
        console.log(song.track.id);
        console.log(song.track.uri);
        setIsPlaying(true);
        SpotifyApi.play({
            uris: [song.track.uri],
        });
    };
    return (
        <div
            key={keyId}
            onClick={() => playSong()}
            className="flex justify-between items-center py-2 sm:pr-3 gap-[6rem] transition-all rounded group hover:bg-[#2A2A2A]">
            <div className="w-full sm:flex-1 flex items-center text-[0.6rem]">
                <div className="flex justify-end items-center mr-5 w-5 sm:w-9 ">
                    <p className="font-mono group-hover:hidden sm:text-[.75rem]">{index + 1}</p>
                    <button>
                        <PlayIcon className="h-4 w-4 hidden group-hover:block" />
                    </button>
                </div>
                <img
                    src={song.track.album.images[0].url}
                    className="h-7 w-7 sm:h-10 sm:w-10 mr-3"
                    alt={song.track.name}
                />
                <div className="flex flex-col gap-1 ">
                    <span className="sm:text-[0.9rem] ">{song.track.name}</span>
                    <span className="font-bold sm:text-xs  text-gray-500">{song.track.artists[0].name}</span>
                </div>
            </div>
            <div className="hidden md:block md:flex-1 text-left">
                <span className="text-[0.75rem] font-bold text-gray-500 group-hover:text-white ">
                    {song.track.album.name.length > 33
                        ? song.track.album.name.slice(0, 33) + "..."
                        : song.track.album.name}
                </span>
            </div>
            <div className=" flex gap-4 justify-end items-center text-[0.5rem] sm:text-[.75rem] font-bold text-gray-500 mr-1 group-hover:text-white">
                <button>
                    <HeartIcon className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                </button>
                <span>{calcTime(song.track.duration_ms)}</span>
                <button>
                    <DotsHorizontalIcon className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                </button>
            </div>
        </div>
    );
}
