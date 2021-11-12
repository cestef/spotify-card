import { generate } from "./src/index";
import fs from "fs";
import path from "path";

describe("spotify-card", () => {
    beforeAll(() => {
        if (!fs.existsSync(path.join(__dirname, "testing")))
            fs.mkdirSync(path.join(__dirname, "testing"));
    });
    it("Generates correctly for Spotify", async () => {
        const image = await generate({
            url: "https://open.spotify.com/track/2shwfq9XQBHMnSnhPOJECa?si=82d3e13c789a4793",
        });
        fs.writeFileSync(path.join(__dirname, "testing", "spotify_card.png"), image);
    });

    test("Generates correctly for SoundCloud", async () => {
        const image = await generate({
            url: "https://soundcloud.com/thekidlaroi/stay",
        });
        fs.writeFileSync(path.join(__dirname, "testing", "soundcloud_card.png"), image);
    });
    test("Generates correctly for Youtube", async () => {
        const image = await generate({
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        });
        fs.writeFileSync(path.join(__dirname, "testing", "youtube_card.png"), image);
    });
    test("Generates correctly for Deezer", async () => {
        const image = await generate({
            url: "https://www.deezer.com/en/track/1176975282",
        });
        fs.writeFileSync(path.join(__dirname, "testing", "deezer_card.png"), image);
    });
    test("Generates correctly for Custom Song Data", async () => {
        const image = await generate({
            songData: {
                title: "Hello World !",
                cover: "https://i.gadgets360cdn.com/large/rick_astley_youtube_1627540038486.jpg?downsize=950:*",
            },
        });
        fs.writeFileSync(path.join(__dirname, "testing", "custom_card.png"), image);
    });
});
