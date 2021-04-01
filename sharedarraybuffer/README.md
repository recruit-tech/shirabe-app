# `@shirabe/sharedarraybuffer`

Checker for using [`SharedArrayBuffer`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) in websites.

## Usage

```sh
❯ cat config.json
{
  "urls": [
    "https://...",
    "https://..."
  ]
}

❯ npx --yes @shirabe/sharedarraybuffer config.json > output.json
```

## Options

Emulate devices (Pixel 2 XL):
```sh
{
  "urls": {
      "https://..."
  },
  "options": {
    "browserContextOptions": {
      "userAgent": "Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36",
      "viewport": {
        "width": 411,
        "height": 823
      },
      "deviceScaleFactor": 3.5,
      "isMobile": true,
      "hasTouch": true,
      "defaultBrowserType": "chromium"
    }
  }
}
```

Config Reference: https://github.com/microsoft/playwright/blob/master/src/server/deviceDescriptors.js

