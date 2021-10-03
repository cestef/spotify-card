import { generate } from "./src/index";
import fs from "fs";
import path from "path";

describe("spotify-card", () => {
    it("Generates correctly for Spotify", async () => {
        const image = await generate({
            url: "https://open.spotify.com/track/2shwfq9XQBHMnSnhPOJECa?si=82d3e13c789a4793",
        });
        fs.writeFileSync(path.join("./", "testing", "spotify_card.png"), image);
    });

    it("Generates correctly for SoundCloud", async () => {
        const image = await generate({
            url: "https://soundcloud.com/thekidlaroi/stay",
        });
        fs.writeFileSync(path.join("./", "testing", "soundcloud_card.png"), image);
    });
    it("Generates correctly for Youtube", async () => {
        const image = await generate({
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        });
        fs.writeFileSync(path.join("./", "testing", "youtube_card.png"), image);
    });
});
