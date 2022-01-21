export type Element = "cover" | "title" | "album" | "progressBar" | "progressBarText";
export interface GenerateOptions {
    /**
     * Spotify URL or URI
     */
    url?: string;
    /**
     * Optional song data if you want to set it manually
     */
    songData?: CustomSongData;
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
     * Default margin for all the elements, default `40`
     */
    defaultMargin?: number;
    /**
     * if progress bar is enabled, progress bar height, default `20`
     */
    progressBarHeight?: number;
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
     * Color for the background
     */
    background?: string;
    /**
     * Whether to set or not the album cover as the background
     */
    coverBackground?: boolean;
    /**
     * Specify this if you want to force the platform detection
     */
    platform?: Platform;
    /**
     * Whether to set the text color relatively to the background or just to pick between black and white
     */
    adaptiveTextcolor?: boolean;
    /**
     * Margins for each individual element
     */
    margins?: {
        [key in Element]?: number;
    };
    /**
     * Fontsizes for each text element
     */
    fontSizes?: {
        /**
         * Font size for the progress bar text, default `30`
         */
        progress?: number;
        /**
         * Font size for the album title, default `45`
         */
        album?: number;
        /**
         * Font size for the song title, default `60`
         */
        title?: number;
    };
    /**
     * Display artist's name instead of the album name
     */
    displayArtist?: false;
    /**
     * Custom font path and name to use
     */
    font?: {
        name: string;
        path: string;
    };
    /**
     * Whether to blur or not for each element
     */
    blur?: {
        image?: boolean;
        text?: boolean;
        progress?: boolean;
    };
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
    artist?: string;
    cover: string;
    title: string;
    album: string;
    dominantColor: string;
    platform: Platform;
}

export interface CustomSongData {
    artist?: string;
    cover: string;
    title: string;
    album?: string;
    dominantColor?: string;
}

export type Platform = "custom" | "spotify" | "soundcloud" | "youtube" | "deezer";

export interface DeezerRes {
    id: number;
    readable: boolean;
    title: string;
    title_short: string;
    title_version: "";
    isrc: string;
    link: string;
    share: string;
    duration: number;
    track_position: number;
    disk_number: number;
    rank: number;
    release_date: string;
    explicit_lyrics: boolean;
    explicit_content_lyrics: number;
    explicit_content_cover: number;
    preview: string;
    bpm: number;
    gain: number;
    available_countries: string[];
    contributors: DeezerContributor[];
    md5_image: string;
    artist: DeezerArtist;
    album: DeezerAlbum;
    type: string;
}

export interface DeezerContributor {
    id: number;
    name: string;
    link: string;
    share: string;
    picture: string;
    picture_small: string;
    picture_medium: string;
    picture_big: string;
    picture_xl: string;
    radio: boolean;
    tracklist: string;
    type: string;
    role: string;
}

export interface DeezerArtist {
    id: number;
    name: string;
    link: string;
    share: string;
    picture: string;
    picture_small: string;
    picture_medium: string;
    picture_big: string;
    picture_xl: string;
    radio: boolean;
    tracklist: string;
    type: string;
}
export interface DeezerAlbum {
    id: number;
    title: string;
    link: string;
    cover: string;
    cover_small: string;
    cover_medium: string;
    cover_big: string;
    cover_xl: string;
    md5_image: string;
    release_date: string;
    tracklist: string;
    type: string;
}

export interface YoutubeRes {
    videoId: string;
    title: string;
    lengthSeconds: string;
    keywords: string[];
    channelId: string;
    isOwnerViewing: boolean;
    shortDescription: string;
    isCrawlable: boolean;
    thumbnail: {
        thumbnails: {
            url: string;
            width: number;
            height: number;
        }[];
    };
    averageRating: number;
    allowRatings: boolean;
    viewCount: string;
    author: string;
    isPrivate: boolean;
    isUnpluggedCorpus: boolean;
    isLiveContent: boolean;
}

export interface ArtistsEntity {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}
export interface ExternalUrls {
    spotify: string;
}

export interface SoundCloudRes {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    url: string;
    duration: string;
    playCount: string;
    commentsCount: string;
    likes: string;
    genre: string;
    author: {
        name: string;
        username: string;
        verified: boolean;
        followers: number;
        following: number;
        avatarURL: string;
        url: string;
    };
    publishedAt: Date;
    embedURL: string;
    trackURL: string;
}
