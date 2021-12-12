import { Element, Platform } from "./types";
import { GenerateOptions } from "./types/index";

export const REGEXPS: { [platform in Exclude<Platform, "custom">]: RegExp } = {
    deezer: /^(?:https?:\/\/|)?(?:www\.)?deezer\.com\/(?:\w{2}\/)?track\/(\d+)/,
    youtube: /^(?:https?:\/\/|)?(?:www\.)?youtube\.com\/?watch\?v=([a-zA-Z0-9-_]+)/,
    soundcloud: /^https?:\/\/(soundcloud\.com|snd\.sc)\/([A-Za-z0-9_-]+)\/([A-Za-z0-9_-]+)\/?$/,
    spotify: /https?:\/\/open.spotify.com\/track\/([a-zA-Z0-9]+)|spotify:track:([a-zA-Z0-9]+)/,
};

export const defaultOptions: GenerateOptions = {
    width: 1200,
    height: 400,
    defaultMargin: 40,
    progressBarHeight: 20,
    imageRadius: 50,
    cardRadius: 25,
    margins: {},
    fontSizes: {},
    blur: {},
};

export const defaultFontSizes = { title: 60, album: 45, progress: 30 };
export const AElements = ["cover", "title", "album", "progressBar", "progressBarText"];
