 Generate song embeds easily !
 
![Preview](media/preview.png)

# spotify-card

## Table of Contents

- [About](#about)
- [Prerequisites](#prerequisites)
- [Installing](#installing)
- [Usage](#usage)

## About <a name = "about"></a>

This is a nodejs utility to generate song embeds using [skia-canvas](https://github.com/samizdatco/skia-canvas).

The package is named `spotify-card` because I wanted to only add spotify support at the beginning but I ended up adding support for other platforms. 

Currently supported plaforms: `Spotify`, `Soundcloud`, `Youtube` and `Deezer`

## Prerequisites <a name = "prerequisites"></a>

- [nodejs](https://nodejs.org)

## Installing <a name = "installing"></a>

You can install this package from the [npm](https://npmjs.com) registry


```
yarn add spotify-card
```

or with the npm cli:

```
npm install spotify-card
```


## Usage <a name = "usage"></a>

### Example (typescript)

```ts
import { generate } from "spotify-card";
import path from "path";
import fs from "fs";

(async () => {
    const image = await generate({
        url: "spotify:track:33yAEqzKXexYM3WlOYtTfQ",
    });
    fs.writeFileSync(path.join(__dirname, "test_image.png"), image);
})();

```
