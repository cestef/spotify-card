import { generate } from ".";
import path from "path";
import fs from "fs";

(async () => {
    const image = await generate({
        url: "https://open.spotify.com/track/5TuTT8Jz37Sd6Rna1ANuKu?si=4df3a210c1974537",
    });
    fs.writeFileSync(path.join(__dirname, "test_image.png"), image);
})();
