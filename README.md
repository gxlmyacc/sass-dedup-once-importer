# sass-dedup-once-importer

[![NPM version](https://img.shields.io/npm/v/sass-dedup-once-importer.svg?style=flat)](https://npmjs.com/package/sass-dedup-once-importer)
[![NPM downloads](https://img.shields.io/npm/dm/sass-dedup-once-importer.svg?style=flat)](https://npmjs.com/package/sass-dedup-once-importer)

This is an importer function which can be used with node-sass. tt ensures that multiple import statements in sass/scss files get only imported once.

## Install

To begin, you'll need to install `sass-dedup-once-importer`:

```bash
npm install sass-dedup-once-importer --save-dev
```

## Usage

sass-loader config:

```js
{
  importer: require('sass-dedup-once-importer')({
    // webpack alias configs
    alias: webpackConfig.resolve.alias,
    // once import exclude regexp
    exclude: /\b_variables\b|\belement-variables\b|\bmixins\b/,
  }),
  // other configs
  // ...
}
```

## License

[MIT](./LICENSE)
