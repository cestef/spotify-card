import { ArtistsEntity } from "spotify-url-info";

export interface GenerateOptions {
    url: string;
    currentTime?: number;
    totalTime?: number;
    width?: number;
    height?: number;
    margin?: number;
    progressBarHeight?: number;
    titleSize?: number;
    albumTitleSize?: number;
    blurImage?: boolean;
    progressBar?: boolean;
    imageRadius?: number;
    cardRadius?: number;
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
