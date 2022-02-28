import { HeartIcon, VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline";
import {
    SwitchHorizontalIcon,
    FastForwardIcon,
    PauseIcon,
    PlayIcon,
    ReplyIcon,
    RewindIcon,
    VolumeUpIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { playListState } from "../Atoms/playlistAtom";
import { currentTrackIdState, isPlayingState } from "../Atoms/songAtom";
import useSong from "../hooks/useSong";
import useSpotify from "../hooks/useSpotify";
import { LOGIN_URL } from "../lib/Spotify";

function Player() {
    const SpotifyApi = useSpotify();
    const playList = useRecoilValue(playListState);

    const { data: session, status } = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(50);

    const songInfo = useSong();

    console.log(songInfo);

    // * get current song is playing from Spotify
    const fetchCurrentSongInfo = () => {
        if (!songInfo) {
            SpotifyApi.getMyCurrentPlayingTrack()
                .then((song) => {
                    console.log("Now playing: ", song?.body.item);
                    setCurrentTrackId(song.body?.item?.id);

                    SpotifyApi.getMyCurrentPlaybackState().then((playback) => {
                        setIsPlaying(playback.body?.isPlaying);
                    });
                })
                .catch((error) => {
                    setTimeout(() => {
                        console.log(playList?.tracks.items[0].track.id);
                        setCurrentTrackId(playList?.tracks.items[0].track.id);
                    }, 1000);
                    console.log("error");
                });
        }
    };

    console.log(LOGIN_URL);

    //* Handle Play or Pause a song
    const handlePlayPause = () => {
        SpotifyApi.getMyCurrentPlaybackState()
            .then((playback) => {
                if (playback.body.is_playing) {
                    SpotifyApi.pause();
                    setIsPlaying(false);
                } else {
                    SpotifyApi.play();
                    setIsPlaying(true);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        if (SpotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSongInfo();
        }
    }, [currentTrackId, SpotifyApi, session]);

    // * for get Volume value
    const debouncedAdjustVolume = useCallback(
        debounce(() => {
            SpotifyApi.setVolume(volume).catch((error) => {
                console.log(error);
            });
        }, 500),
        []
    );

    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debouncedAdjustVolume();
        }
    }, [volume]);

    return (
        <section className="flex justify-between items-center p-4 bg-[#181818] border-t border-[#282828] text-white font-mono capitalize">
            {/* Left Side */}
            <div className="flex items-center gap-5">
                <img
                    src={songInfo?.album?.images[0].url}
                    alt={songInfo?.name}
                    className="h-12 w-12 shadow-md shadow-black"
                />
                <div className="flex flex-col ">
                    <span className="text-[0.9rem]">{songInfo?.name}</span>
                    <span className="tracking-[0.13rem] text-xs text-gray-500 font-bold">
                        {songInfo?.artists[0]?.name}
                    </span>
                </div>
                <HeartIcon className="h-5 w-5" />
            </div>
            {/* Center Side */}
            <div className="flex items-center gap-8">
                <SwitchHorizontalIcon className="btn" />
                <RewindIcon className="btn" />
                {isPlaying ? (
                    <PauseIcon className="btn w-10 h-10" onClick={() => handlePlayPause()} />
                ) : (
                    <PlayIcon className="btn w-10 h-10" onClick={() => handlePlayPause()} />
                )}
                <FastForwardIcon className="btn" />
                <ReplyIcon className="btn" />
            </div>
            {/* Right Side */}
            <div className="flex items-center gap-3">
                <VolumeUpIcon className="btn" onClick={() => volume > 0 && setVolume(volume - 10)} />
                <input
                    className="w-14 md:w-28"
                    type="range"
                    value={volume}
                    min="0"
                    max="100"
                    onChange={(e) => {
                        setVolume(Number(e.target.value));
                    }}
                />
                <VolumeDownIcon className="btn" onClick={() => volume < 100 && setVolume(volume + 10)} />
            </div>
        </section>
    );
}

export default Player;
