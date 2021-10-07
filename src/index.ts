import { Canvas, loadImage, FontLibrary } from "skia-canvas";
import { getData } from "spotify-url-info";
import Colorthief from "colorthief";
import {
    roundRect,
    roundedImage,
    pSBC,
    isLight,
    fittingString,
    progressBar,
    getSongType,
} from "./functions";
import { SpotifyRes, GenerateOptions, GenericSong } from "./types";
import path from "path";
import fs from "fs";
import { formatMilliseconds, rgbToHex } from "./functions";
import { Client } from "soundcloud-scraper";
import { getBasicInfo, getInfo } from "ytdl-core";
import { Platform } from "./types/index";

const defaultOptions = {
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

const FONTS = [{ path: "Noto_Sans_KR", name: "NS" }];
const loadFonts = () => {
    FONTS.forEach((f) =>
        FontLibrary.use(
            "NS",
            fs
                .readdirSync(path.join(__dirname, "../", "fonts", f.path))
                .map((e) => `fonts/${f}/${e}`)
        )
    );
};
loadFonts();

/**
 * Generates a spotify card
 */
export const generate = async (options: GenerateOptions) => {
    options = { ...defaultOptions, ...options };
    if (options.blurImage && typeof options.blurProgress === "undefined")
        options.blurProgress = true;
    const canvas = new Canvas(options.width, options.height);
    const ctx = canvas.getContext("2d");
    const song_type = options.platform || getSongType(options.url);
    let song_data: GenericSong;
    switch (song_type) {
        case "soundcloud": {
            try {
                const soundcloud_res = await new Client().getSongInfo(options.url, {
                    fetchEmbed: true,
                });
                const color = rgbToHex(await Colorthief.getColor(soundcloud_res.thumbnail));
                song_data = {
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
                const spotify_res: SpotifyRes = await getData(options.url);
                song_data = {
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
                const youtube_res = await getBasicInfo(options.url);
                const cover = `https://i.ytimg.com/vi/${youtube_res.videoDetails.videoId}/hqdefault.jpg`;
                const color = rgbToHex(await Colorthief.getColor(cover));
                song_data = {
                    title: youtube_res.videoDetails.title,
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
        default:
            throw new Error(
                'The URL provided did not match any platform, you can pass the "platform" parameter if you want to force the detection'
            );
    }

    song_data.dominantColor = options.neutralBackground
        ? "#fff"
        : pSBC(0.001, song_data.dominantColor);
    const image = await loadImage(song_data.cover);

    const text_color = options.coverBackground
        ? "#fff"
        : isLight(song_data.dominantColor)
        ? "#000"
        : "#fff";
    if (!options.coverBackground) {
        ctx.fillStyle = song_data.dominantColor;
        roundRect(ctx, 0, 0, canvas.width, canvas.height, options.cardRadius);
    } else {
        const width = canvas.width;
        const height = (canvas.width / image.width) * image.height;

        //Gradient to darken the image and make the text more readable
        const gradient = ctx.createLinearGradient(0, canvas.height, canvas.width, canvas.height);
        gradient.addColorStop(1, "#1e1e1e30");
        gradient.addColorStop(0, "#1e1e1e60");

        ctx.save();
        roundRect(ctx, 0, 0, canvas.width, canvas.height, options.cardRadius);
        ctx.clip();
        ctx.drawImage(image, 0, -height / 2, width, height);
        ctx.restore();

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (options.blurImage) {
        ctx.filter = "blur(30px)";
        ctx.drawImage(
            image,
            options.margin,
            options.margin,
            canvas.height - options.margin * 2,
            canvas.height - options.margin * 2
        );
    }
    ctx.filter = "none";
    roundedImage(
        ctx,
        image,
        options.margin,
        options.margin,
        canvas.height - options.margin * 2,
        canvas.height - options.margin * 2,
        options.imageRadius
    );
    const second_part_x = canvas.height + options.margin;

    // Song title
    ctx.font = `bold ${options.titleSize}px NS`;
    ctx.fillStyle = text_color;
    const title_metrics = ctx.measureText(song_data.title);
    const middle_second_part = (canvas.height - options.margin * 2) / 2;
    const title_height =
        options.margin * 1.5 +
        title_metrics.actualBoundingBoxAscent +
        title_metrics.actualBoundingBoxDescent;
    if (song_data.platform === "youtube") {
        //Since we have no album for youtube, we can put the title on 2 lines
        const first_part = fittingString(
            ctx,
            song_data.title,
            canvas.width - (canvas.height + options.margin * 3),
            "-"
        );
        if (first_part.endsWith("-")) {
            //If the text doesn't fit on one line, split it in 2 parts
            const second_part = fittingString(
                ctx,
                song_data.title.split(first_part.slice(0, -1))[1].trim(),
                canvas.width - (canvas.height + options.margin * 3)
            );
            const album_metrics = ctx.measureText(second_part);
            const album_height =
                title_height +
                options.margin * 0.5 +
                album_metrics.actualBoundingBoxAscent +
                album_metrics.actualBoundingBoxDescent;
            ctx.fillText(
                second_part,
                second_part_x,
                options.progressBar
                    ? album_height
                    : middle_second_part +
                          album_metrics.actualBoundingBoxAscent +
                          album_metrics.actualBoundingBoxDescent +
                          options.margin
            );
        }

        ctx.fillText(
            first_part,
            second_part_x,
            options.progressBar ? title_height : middle_second_part + options.margin / 2
        );
    } else {
        //Just write the text normally for other platforms
        ctx.fillText(
            fittingString(
                ctx,
                song_data.title,
                canvas.width - (canvas.height + options.margin * 3)
            ),
            second_part_x,
            options.progressBar ? title_height : middle_second_part + options.margin / 2
        );
    }

    // Album title
    ctx.font = `${options.albumTitleSize}px NS`;
    ctx.fillStyle = options.coverBackground ? text_color : pSBC(-0.5, text_color);
    const album_metrics = ctx.measureText(song_data.album);
    const album_height =
        title_height +
        options.margin +
        album_metrics.actualBoundingBoxAscent +
        album_metrics.actualBoundingBoxDescent;
    ctx.fillText(
        fittingString(ctx, song_data.album, canvas.width - (canvas.height + options.margin * 3)),
        second_part_x,
        options.progressBar
            ? album_height
            : middle_second_part +
                  album_metrics.actualBoundingBoxAscent +
                  album_metrics.actualBoundingBoxDescent +
                  options.margin * 1.5
    );

    if (options.progressBar) {
        if (!options.currentTime || !options.totalTime)
            throw new Error(
                "Progressbar is enabled but no totalTime or currentTime has been provided"
            );
        // Progress text
        const progress_text_y = canvas.height - options.margin;
        const progress_bar = {
            x: second_part_x,
            y: progress_text_y - options.margin * 1.75,
            width: canvas.width - (second_part_x + options.margin * 2),
            height: 20,
        };

        ctx.font = `${options.progressFontSize}px NS`;
        ctx.fillStyle = text_color;
        //Get the current time in youtube-like format
        const current_formatted = formatMilliseconds(options.currentTime);
        ctx.fillText(
            current_formatted,
            second_part_x - ctx.measureText(current_formatted).width / 3,
            progress_text_y
        );
        //Get the total time in youtube-like format
        const total_formatted = formatMilliseconds(options.totalTime);
        ctx.fillText(
            total_formatted,
            second_part_x + progress_bar.width - (ctx.measureText(total_formatted).width / 3) * 2,
            progress_text_y
        );

        // Progress bar
        if (options.blurProgress) {
            // Set a wider spread for darker cards for a better result
            ctx.shadowBlur = isLight(text_color) ? 30 : 80;
            ctx.shadowColor = pSBC(isLight(text_color) ? -0.7 : 0.02, text_color);
        }
        //Draw the progress bar
        progressBar(
            ctx,
            progress_bar.x,
            progress_bar.y,
            progress_bar.width,
            progress_bar.height,
            options.totalTime,
            options.currentTime,
            text_color === "#000"
        );
    }

    //Skia property directly returning the png Buffer
    return canvas.png;
};

export { GenerateOptions, Platform };
