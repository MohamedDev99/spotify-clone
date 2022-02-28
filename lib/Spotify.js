import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
    "user-read-email",
    "playList-read-private",
    "playlist-read-collaborative",
    "streaming",
    "user-read-private",
    "user-library-read",
    "user-top-read",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-follow-read",
    "user-library-modify",
].join(",");

const params = {
    scope: scopes,
};

const queryParamString = new URLSearchParams(params);

const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString.toString}`;

const spotifyApi = new SpotifyWebApi({
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
});

export { LOGIN_URL };

export default spotifyApi;
