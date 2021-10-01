import { generate } from ".";
import path from "path";
import fs from "fs";

(async () => {
    const image = await generate({
        url: "https://open.spotify.com/track/5nwtOlrtOWokzf6VS0apMG?si=fd7064f5b2f747fc",
        margin: 40,
        currentTime: 60_000,
        totalTime: 153_000,
    });
    fs.writeFileSync(path.join(__dirname, "test_image.png"), image);
})();
