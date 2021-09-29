import { generate } from "./index";
import fs from "fs";
import path from "path";

describe("Spotify Card", () => {
    let card: Buffer;

    beforeEach(async () => {
        card = await generate({
            url: "https://open.spotify.com/track/5TuTT8Jz37Sd6Rna1ANuKu?si=4df3a210c1974537",
        });
    });
    it("Returns a valid Buffer", () => {
        expect(card).toBeInstanceOf(Buffer);
    });
    it("Generates a writable image", async () => {
        const write = () => {
            fs.writeFileSync(path.join(__dirname, "test_image.png"), card);
        };
        expect(write).not.toThrowError();
    });
});
