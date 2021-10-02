import { generate } from ".";
import path from "path";
import fs from "fs";

(async () => {
    const image = await generate({
        url: "https://open.spotify.com/track/11HLDMuPD3wh88XHw4udKO?si=db1852698fd64367",
        margin: 50,
        currentTime: 60_000,
        totalTime: 153_000,
        titleSize: 70,
        albumTitleSize: 45,
        height: 500,
        width: 1500,
        blurImage: true,
        progressBar: false,
        cardRadius: 30,
    });
    fs.writeFileSync(path.join(__dirname, "test_image.png"), image);
})();
