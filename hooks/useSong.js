import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState } from "../Atoms/songAtom";
import useSpotify from "./useSpotify";

function useSong() {
    const SpotifyApi = useSpotify();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [songInfo, setSongInfo] = useState(null);

    useEffect(() => {
        const fetchSong = async () => {
            if (currentTrackId) {
                const trackSong = await fetch(`https://api.spotify.com/v1/tracks/${currentTrackId}`, {
                    headers: { Authorization: `Bearer ${SpotifyApi.getAccessToken()}` },
                })
                    .then((response) => response.json())
                    .catch((error) => {
                        console.error("error is here :: ", error);
                    });
                setSongInfo(trackSong);
            }
        };
        fetchSong();
    }, [SpotifyApi, currentTrackId]);

    return songInfo;
}

export default useSong;
