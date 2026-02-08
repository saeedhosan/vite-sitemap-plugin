[![npm version](https://badgen.net/npm/v/vite-sitemap-plugin)](https://www.npmjs.com/package/vite-sitemap-plugin)
[![monthly downloads](https://badgen.net/npm/dm/vite-sitemap-plugin)](https://www.npmjs.com/package/vite-sitemap-plugin)
[![types](https://badgen.net/npm/types/vite-sitemap-plugin)](https://github.com/saeedhosan/vite-sitemap-plugin/blob/main/src/types.ts)
[![license](https://badgen.net/npm/license/vite-sitemap-plugin)](https://github.com/saeedhosan/vite-sitemap-plugin/blob/main/LICENSE.md)

## Introduction

The `vite-sitemap-plugin` plugin makes it easier to generate sitemaps for Vite projects.

It simplifies sitemap creation by producing a standardized, well-structured final output.

## Installation

Install the plugin using your preferred package manager:

```bash
npm i -D vite-sitemap-plugin
```

## Usage

To use the plugin, import it in your `vite.config.js` or `vite.config.ts` file and add it to the `plugins` array:

```ts
import { defineConfig } from "vite";
import sitemap from "vite-sitemap-plugin";

export default defineConfig({
    plugins: [
        sitemap({
            base: "https://www.example.com",
            urls: [
                "about",
                "privacy-policy",
                "terms-and-conditions",
                // Add more paths here
            ],
        }),
    ],
});
```

### Configuration Options

The `sitemap` plugin accepts an options object with the following properties:

| Option       | Required | Default         | Description                                      |
| ------------ | -------- | --------------- | ------------------------------------------------ |
| `base`       | Yes      | `"/"`           | The website base url                             |
| `urls`       | No       | `[]`            | An array of paths (strings) or Entry.            |
| `changefreq` | No       | `'daily'`       | Frequency for URLs. Can be overridden per Entry. |
| `filename`   | No       | `'sitemap.xml'` | The name of the sitemap file.                    |
| `robotsTxt`  | No       | `undefined`     | The robotsTxt accept string, null, false         |

#### Configuration types

**Changefreq** : "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"

**Entry** : `path`:string | `lastmod`: iso datetime string | `changefreq` : Changefreq

#### Example Usage

```ts
import { defineConfig } from "vite";
import sitemap from "vite-sitemap-plugin";

export default defineConfig({
    plugins: [
        sitemap({
            base: "https://www.example.com",
            urls: ["about", "contact", "privacy-policy"],
            filename: "custom-sitemap.xml", // optional
            changefreq: "weekly", // optional - default daily
        }),
    ],
});
```

#### Example entry

```ts
sitemap({
    changefreq: "weekly", // optional - default daily
    base: "https://www.example.com",
    urls: [
        "about",
        "blog",
        { path: "contact", changefreq: "monthly", priority: 0.7 },
        { path: "privacy-policy", lastmod: new Date().toISOString(), priority: 0.5 },
    ],
});
```

### Robots txt

```ts
sitemap({ robotsTxt: null }); // disabled to auto generate
sitemap({ robotsTxt: false });
sitemap({ robotsTxt: "User-agent: *" }); // with custom content
```

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](.github/CONTRIBUTING.md) guide for more details.
