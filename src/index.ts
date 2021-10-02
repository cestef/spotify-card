import { Canvas, loadImage, FontLibrary } from "skia-canvas";
import { getData } from "spotify-url-info";
import { parse } from "spotify-uri";
import {
    roundRect,
    roundedImage,
    pSBC,
    isLight,
    fittingString,
    progressBar,
} from "./canvasFunctions";
import { SpotifyRes, GenerateOptions } from "./types";
import path from "path";
import fs from "fs";
import { formatMilliseconds } from "./canvasFunctions";

const defaultOptions = {
    width: 1200,
    height: 400,
    margin: 30,
    progressBarHeight: 20,
    titleSize: 60,
    albumTitleSize: 45,
    progressBar: false,
    imageRadius: 50,
    cardRadius: 25,
};

const FONTS = [{ path: "Noto_Sans_KR", name: "NS" }];
const loadFonts = () => {
    FONTS.forEach((f) =>
        FontLibrary.use(
            "NS",
            fs.readdirSync(path.join(__dirname, "fonts", f.path)).map((e) => `fonts/${f}/${e}`)
        )
    );
};
loadFonts();

export const generate = async (options: GenerateOptions) => {
    options = { ...defaultOptions, ...options };

    const canvas = new Canvas(options.width, options.height);
    const ctx = canvas.getContext("2d");
    try {
        parse(options.url);
    } catch (e) {
        throw new Error("Invalid Spotify URL: " + e);
    }
    const spotify_res: SpotifyRes = await getData(options.url);

    spotify_res.dominantColor = pSBC(0.001, spotify_res.dominantColor);
    const text_color = isLight(spotify_res.dominantColor) ? "#000" : "#fff";

    ctx.fillStyle = spotify_res.dominantColor;
    roundRect(ctx, 0, 0, canvas.width, canvas.height, options.cardRadius);

    const image = await loadImage(spotify_res.album.images[0].url);
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
    const title_metrics = ctx.measureText(spotify_res.name);
    const middle_second_part = (canvas.height - options.margin * 2) / 2;
    const title_height =
        options.margin * 1.5 +
        title_metrics.actualBoundingBoxAscent +
        title_metrics.actualBoundingBoxDescent;
    ctx.fillText(
        fittingString(ctx, spotify_res.name, canvas.width - (canvas.height + options.margin * 3)),
        second_part_x,
        options.progressBar ? title_height : middle_second_part + options.margin / 2
    );

    // Album title
    ctx.font = `${options.albumTitleSize}px NS`;
    ctx.fillStyle = pSBC(-0.5, text_color);
    const album_metrics = ctx.measureText(spotify_res.album.name);
    const album_height =
        title_height +
        options.margin +
        album_metrics.actualBoundingBoxAscent +
        album_metrics.actualBoundingBoxDescent;
    ctx.fillText(
        fittingString(
            ctx,
            spotify_res.album.name,
            canvas.width - (canvas.height + options.margin * 3)
        ),
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

        ctx.font = `30px NS`;
        ctx.fillStyle = text_color;
        const current_formatted = formatMilliseconds(options.currentTime);
        ctx.fillText(
            current_formatted,
            second_part_x - ctx.measureText(current_formatted).width / 3,
            progress_text_y
        );

        const total_formatted = formatMilliseconds(options.totalTime);
        ctx.fillText(
            total_formatted,
            second_part_x + progress_bar.width - (ctx.measureText(total_formatted).width / 3) * 2,
            progress_text_y
        );

        // Progress bar
        progressBar(
            ctx,
            progress_bar.x,
            progress_bar.y,
            progress_bar.width,
            progress_bar.height,
            options.totalTime,
            options.currentTime,
            isLight(spotify_res.dominantColor)
        );
    }

    return canvas.png;
};

export { GenerateOptions };
