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
