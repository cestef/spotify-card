import {
    Platform,
    DeezerRes,
    YoutubeRes,
    GenericSong,
    SpotifyRes,
    SoundCloudRes,
} from "../types/index";
import axios from "axios";
import { AElements, defaultFontSizes, defaultOptions, REGEXPS } from "../constants";
import Colorthief from "colorthief";
import { parse } from "himalaya";
import { load } from "cheerio";
import { GenerateOptions } from "../types/index";

export const getSongType = (url: string): Platform | null => {
    for (let platform in REGEXPS) if (REGEXPS[platform].test(url)) return platform as Platform;
    return null;
};
//From https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
export const rgbToHex = (rgb: [number, number, number]) => {
    return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
};

export const getDeezerTrack = async (url: string): Promise<DeezerRes> => {
    const [_, id] = url.match(REGEXPS.deezer) || [];
    if (!id) throw new Error("Invalid Deezer URL provided");
    return (await (
        await axios({ url: `https://api.deezer.com/track/${id}`, method: "GET" })
    ).data) as DeezerRes;
};

export const getYoutubeTrack = async (url: string): Promise<YoutubeRes> => {
    const [_, id] = url.match(REGEXPS.youtube) || [];
    if (!id) throw new Error("Invalid Youtube URL provided");
    return (
        (
            await axios({
                url: "https://youtubei.googleapis.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8",
                method: "POST",
                data: {
                    context: {
                        client: {
                            hl: "en",
                            clientName: "WEB",
                            clientVersion: "2.20210721.00.00",
                            mainAppWebInfo: {
                                graftUrl: `/watch?v=${id}`,
                            },
                        },
                    },
                    videoId: id,
                },
            })
        ).data as any
    ).videoDetails as YoutubeRes;
};
//From https://github.com/microlinkhq/spotify-url-info
export const getSpotifyTrack = async (url: string): Promise<SpotifyRes> => {
    const [_, id] = url.match(REGEXPS.spotify) || [];
    if (!id) throw new Error("Invalid Spotify URL provided");
    const uri = `spotify:track:${id}`;
    const embed = `https://embed.spotify.com/?uri=${uri}`;
    return axios(embed)
        .then((res) => res.data)
        .then(parse)
        .then((embed) => {
            const scripts = (embed as any)
                .filter((e) => e.tagName === "html")[0]
                .children.filter((e) => e.tagName === "body")[0]
                .children.filter((e) => e.tagName === "script");
            const resourceScript = scripts.filter(
                (e) => e.attributes.findIndex((a) => a.value === "resource") !== -1
            );
            const hydrateScript = scripts.filter(
                (e) => e.children[0] && /%22data%22%|"data":/.test(e.children[0].content)
            );

            if (resourceScript.length > 0) {
                // found data in the older embed style
                return JSON.parse(decodeURIComponent(resourceScript[0].children[0].content));
            } else if (hydrateScript.length > 0) {
                // found hydration data
                // parsing via looking for { to be a little bit resistant to code changes
                const scriptContent = hydrateScript[0].children[0].content.includes("%22data%22%")
                    ? decodeURIComponent(hydrateScript[0].children[0].content)
                    : hydrateScript[0].children[0].content;
                const data = JSON.parse(
                    "{" + scriptContent.split("{").slice(1).join("{").trim()
                ).data;
                return data.entity ? data.entity : data;
            } else {
                return Promise.reject(
                    new Error("Couldn't find any data in embed page that we know how to parse")
                );
            }
        })
        .then(sanityCheck);
};
const sanityCheck = (data: any) => {
    if (!data || !data.type || !data.name) {
        return Promise.reject(new Error("Data doesn't seem to be of the right shape to parse"));
    }
    return Promise.resolve(data);
};

//From https://github.com/DevSnowflake/soundcloud-scraper
export const getSoundCloudTrack = async (url: string): Promise<SoundCloudRes> => {
    return new Promise(async (resolve, reject) => {
        try {
            const raw = (await (await axios(url)).data) as string;
            if (!raw) return reject(new Error("Couldn't parse html!"));
            const $ = load(raw);

            const duration =
                raw.split('<meta itemprop="duration" content="') &&
                raw.split('<meta itemprop="duration" content="')[1] &&
                raw.split('<meta itemprop="duration" content="')[1].split('" />')[0];
            const name =
                raw.split('<h1 itemprop="name">') &&
                raw.split('<h1 itemprop="name">')[1].split("by <a")[1] &&
                raw.split('<h1 itemprop="name">')[1].split("by <a")[1].split(">")[1] &&
                raw
                    .split('<h1 itemprop="name">')[1]
                    .split("by <a")[1]
                    .split(">")[1]
                    .split("</a>")[0]
                    .replace("</a", "");
            const trackURLBase = raw.split('},{"url":"')[1];
            let trackURL = null;
            if (trackURLBase) trackURL = trackURLBase.split('","')[0];
            const obj = {
                id: $('meta[property="al:ios:url"]').attr("content").split(":").pop(),
                title: $('meta[property="og:title"]').attr("content"),
                description: $('meta[property="og:description"]').attr("content"),
                thumbnail: $('meta[property="og:image"]').attr("content"),
                url: $('link[rel="canonical"]').attr("href"),
                duration,
                playCount: $('meta[property="soundcloud:play_count"]').attr("content"),
                commentsCount: $('meta[property="soundcloud:comments_count"]').attr("content"),
                likes: $('meta[property="soundcloud:like_count"]').attr("content"),
                genre:
                    raw.split(',"genre":"')[1] &&
                    raw
                        .split(',"genre":"')[1]
                        .split('","')[0]
                        .replace(/\\u0026/g, "&"),
                author: {
                    name: name || null,
                    username: $('meta[property="soundcloud:user"]')
                        .attr("content")
                        .replace("https://soundcloud.com/", ""),
                    url: $('meta[property="soundcloud:user"]').attr("content"),
                    avatarURL:
                        (raw.split('"avatar_url":"') &&
                            raw
                                .split('"avatar_url":"')
                                [raw.split('"avatar_url":"').length - 1].split('"')[0]) ||
                        null,
                    verified: !raw.includes('","verified":false,"visuals"'),
                    followers:
                        parseInt(
                            raw.split(',"followers_count":') &&
                                raw.split(',"followers_count":')[1].split(",")[0]
                        ) || 0,
                    following:
                        parseInt(
                            raw.split(',"followings_count":') &&
                                raw.split(',"followings_count":')[1].split(",")[0]
                        ) || 0,
                },
                publishedAt:
                    new Date(
                        raw.split("<time pubdate>")[1] &&
                            raw.split("<time pubdate>")[1].split("</time>")[0]
                    ) || null,
                embedURL: $('link[type="text/json+oembed"]').attr("href"),
                track: {
                    hls: trackURL ? trackURL.replace("/progressive", "/hls") : null,
                    progressive: trackURL || null,
                },
                trackURL: trackURL || null,
            };

            return resolve(obj);
        } catch (e) {
            return reject(e);
        }
    });
};

// From https://stackoverflow.com/questions/19700283/how-to-convert-time-in-milliseconds-to-hours-min-sec-format-in-javascript/67462589#67462589
export const formatMilliseconds = (milliseconds: number, padStart: boolean = false) => {
    const pad = (num: number) => {
        return `${num}`.padStart(2, "0");
    };

    let asSeconds = milliseconds / 1000;

    let hours = undefined;
    let minutes = Math.floor(asSeconds / 60);
    let seconds = Math.floor(asSeconds % 60);

    if (minutes > 59) {
        hours = Math.floor(minutes / 60);
        minutes %= 60;
    }

    return hours
        ? `${padStart ? pad(hours) : hours}:${pad(minutes)}:${pad(seconds)}`
        : `${padStart ? pad(minutes) : minutes}:${pad(seconds)}`;
};

export const getTrackData = async (song_type: Platform, url: string) => {
    let song_data: GenericSong;
    switch (song_type) {
        case "soundcloud": {
            try {
                const soundcloud_res = await getSoundCloudTrack(url);
                const color = rgbToHex(await Colorthief.getColor(soundcloud_res.thumbnail));
                song_data = {
                    artist: soundcloud_res.author.name,
                    title: soundcloud_res.title,
                    album: soundcloud_res.description,
                    cover: soundcloud_res.thumbnail,
                    platform: "soundcloud",
                    dominantColor: color,
                };
            } catch (e) {
                console.error(
                    "Error when fetching song from soundcloud, are you sure the link you provided is correct ?",
                    e
                );
            }

            break;
        }
        case "spotify": {
            try {
                const spotify_res = await getSpotifyTrack(url);
                song_data = {
                    artist: spotify_res.artists[0].name,
                    title: spotify_res.name,
                    album: spotify_res.album.name,
                    cover: spotify_res.album.images[0].url,
                    platform: "spotify",
                    dominantColor: spotify_res.dominantColor,
                };
            } catch (e) {
                console.error(
                    "Error when fetching song from spotify, are you sure the link you provided is correct ?",
                    e
                );
            }
            break;
        }
        case "youtube": {
            try {
                const youtube_res = await getYoutubeTrack(url);
                const cover =
                    youtube_res.thumbnail.thumbnails[youtube_res.thumbnail.thumbnails.length - 1]
                        .url;
                const color = rgbToHex(await Colorthief.getColor(cover));
                song_data = {
                    artist: youtube_res.author,
                    title: youtube_res.title,
                    album: "",
                    cover,
                    platform: "youtube",
                    dominantColor: color,
                };
            } catch (e) {
                console.error(
                    "Error when fetching song from youtube, are you sure the link you provided is correct ?",
                    e
                );
            }
            break;
        }
        case "deezer": {
            try {
                const deezer_res = await getDeezerTrack(url);
                const color = rgbToHex(await Colorthief.getColor(deezer_res.album.cover_xl));
                song_data = {
                    artist: deezer_res.artist.name,
                    title: deezer_res.title,
                    album: deezer_res.album.title,
                    cover: deezer_res.album.cover_xl,
                    platform: "deezer",
                    dominantColor: color,
                };
            } catch (e) {
                console.error(
                    "Error when fetching song from deezer, are you sure the link you provided is correct ?",
                    e
                );
            }
            break;
        }
        default:
            throw new Error(
                'The URL provided did not match any platform, you can pass the "platform" parameter if you want to force the detection'
            );
    }
    return song_data;
};
export const isValidSongData = (songData: any): boolean | string => {
    const keys = {
        cover: "string",
        title: "string",
        album: "string?",
        dominantColor: "string?",
        platform: "string?",
    };

    for (let key in keys) {
        if (!keys[key].endsWith("?")) {
            if (!songData[key]) return key;
            if (typeof songData[key] !== keys[key].replace("?", "")) return key;
        }
    }
    return true;
};

export const mergeOptions = (options: GenerateOptions) => {
    options = { ...defaultOptions, ...options };
    options.fontSizes = { ...defaultFontSizes, ...options.fontSizes };
    for (let element of AElements)
        options.margins[element] =
            typeof options.margins[element] === "undefined"
                ? options.defaultMargin
                : options.margins[element];
    return options;
};
