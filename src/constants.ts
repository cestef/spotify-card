import { Platform } from "./types";

export const REGEXPS: { [platform in Exclude<Platform, "custom">]: RegExp } = {
    deezer: /^(?:https?:\/\/|)?(?:www\.)?deezer\.com\/(?:\w{2}\/)?track\/(\d+)/,
    youtube: /^(?:https?:\/\/|)?(?:www\.)?youtube\.com\/?watch\?v=([a-zA-Z0-9-_]+)/,
    soundcloud: /^https?:\/\/(soundcloud\.com|snd\.sc)\/([A-Za-z0-9_-]+)\/([A-Za-z0-9_-]+)\/?$/,
    spotify: /https?:\/\/open.spotify.com\/track\/([a-zA-Z0-9]+)|spotify:track:([a-zA-Z0-9]+)/,
};

export const defaultOptions = {
    width: 1200,
    height: 400,
    margin: 40,
    progressBarHeight: 20,
    titleSize: 60,
    albumTitleSize: 45,
    imageRadius: 50,
    cardRadius: 25,
    progressFontSize: 30,
};
