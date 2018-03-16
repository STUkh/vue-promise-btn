# vue-promise-btn

Vue.js plugin that handles buttons asynchronous lock and show loading state indicator

<p align="center">
  <a href="https://npmjs.org/package/vue-promise-btn">
    <img src="https://img.shields.io/npm/dm/vue-promise-btn.svg?style=flat-square" alt="Downloads" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square" alt="Software License" />
  </a>
  <a href="https://npmjs.org/package/vue-promise-btn">
    <img src="https://img.shields.io/npm/v/vue-promise-btn.svg?style=flat-square" alt="Packagist" />
  </a>
  <a href="https://github.com/STUkh <stukak@gmail.com>/vue-promise-btn/releases">
    <img src="https://img.shields.io/github/release/STUkh <stukak@gmail.com>/vue-promise-btn.svg?style=flat-square" alt="Latest Version" />
  </a>

  <a href="https://github.com/STUkh <stukak@gmail.com>/vue-promise-btn/issues">
    <img src="https://img.shields.io/github/issues/STUkh <stukak@gmail.com>/vue-promise-btn.svg?style=flat-square" alt="Issues" />
  </a>
</p>

## Example and Documentation
https://STUkh.github.io/vue-promise-btn/

<div style="text-align:center" align="center">
    <img src="example/example.gif" alt="vue-promise-btn">
</div>

## Features
- Easy-to-use API
- Works with any tag and even forms
- Packaged with optional built-in spinner
- Only 1.5KB minified and gzipped
- ESM, CommonJS, UMD versions

### Installation
```
npm install --save vue-promise-btn
```
#### Quick Start:
- Import and "handshake" plugin with vue
```
import Vue from 'vue'
import VuePromiseBtn from 'vue-promise-btn'

Vue.use(VuePromiseBtn)
```

- Use in components
``` <button v-promise-btn @click="getData">Get Data</button> ```

## Change log

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) and [CONDUCT](CONDUCT.md) for details.

## Credits

- [Alex Stepchenkov][link-author]
- [All Contributors][link-contributors]

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

[link-author]: https://github.com/STUkh <stukak@gmail.com>
[link-contributors]: ../../contributors
