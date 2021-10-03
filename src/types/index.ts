import { ArtistsEntity } from "spotify-url-info";

export interface GenerateOptions {
    /**
     * Spotify URL or URI
     */
    url: string;
    /**
     * If progress bar is enabled, player position
     */
    currentTime?: number;
    /**
     * If progress bar is enabled, song duration
     */
    totalTime?: number;
    /**
     * Width of the spotify card, default `1200`
     */
    width?: number;
    /**
     * Height of the spotify card, default `400`
     */
    height?: number;
    /**
     * Margin for all the elements, default `40`
     */
    margin?: number;
    /**
     * if progress bar is enabled, progress bar height, default `20`
     */
    progressBarHeight?: number;
    /**
     * Font size for the song title, default `60`
     */
    titleSize?: number;
    /**
     * Font size for the album title, default `45`
     */
    albumTitleSize?: number;
    /**
     * Whether to blur or not the edges of the image
     */
    blurImage?: boolean;
    /**
     * Whether to blur or not the progress bar, default to `true` if blurImage is set to `true`
     */
    blurProgress?: boolean;
    /**
     * Whether to enable or not the progress bar
     */
    progressBar?: boolean;
    /**
     * Radius for the image's corners, default `50`
     */
    imageRadius?: number;
    /**
     * Radius for the card's corners, default `25`
     */
    cardRadius?: number;
    /**
     * Whether to set or not the background to a neutral color (white)
     */
    neutralBackground?: boolean;
}

export interface SpotifyAlbum {
    album_type: string;
    artists: ArtistsEntity;
    external_urls: { [key: string]: string };
    href: string;
    id: string;
    images: any[];
    name: string;
    release_date: string;
    release_date_precision: string;
    total_tracks: 17;
    type: string;
    uri: string;
}

export interface SpotifyRes {
    album: SpotifyAlbum;
    artists: ArtistsEntity[];
    disc_number: number;
    duration_ms: 168186;
    explicit: boolean;
    external_ids: { [key: string]: string };
    external_urls: { [key: string]: string };
    href: string;
    id: string;
    is_local: boolean;
    is_playable: boolean;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
    dominantColor: string;
}

export interface GenericSong {
    cover: string;
    title: string;
    album: string;
    dominantColor: string;
    platform: "spotify" | "soundcloud";
}
