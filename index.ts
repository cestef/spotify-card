import { Canvas, loadImage } from "canvas";
import { getData } from "spotify-url-info";
import { roundRect, roundedImage } from "./canvasFunctions";
import { SpotifyRes, GenerateOptions } from "./types";

const defaultOptions = {
    width: 1000,
    height: 300,
};

export const generate = async (options: GenerateOptions) => {
    options = { ...defaultOptions, ...options };
    const canvas = new Canvas(options.width, options.height, "image");
    const ctx = canvas.getContext("2d");
    const spotify_res: SpotifyRes = await getData(options.url);

    ctx.fillStyle = spotify_res.dominantColor;
    roundRect(ctx, 0, 0, canvas.width, canvas.height, 25);
    ctx.save();
    const image = await loadImage(spotify_res.album.images[0].url);
    roundedImage(ctx, image, 10, 10, canvas.height - 20, canvas.height - 20, 25);
    return canvas.toBuffer();
};
