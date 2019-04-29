# vue-promise-btn

[![NPM Version](http://img.shields.io/npm/v/vue-promise-btn.svg?style=flat-square)](https://www.npmjs.com/package/vue-promise-btn)
[![Download Month](http://img.shields.io/npm/dm/vue-promise-btn.svg?style=flat-square)](https://www.npmjs.com/package/vue-promise-btn)

## Example and Documentation
https://STUkh.github.io/vue-promise-btn/

<div style="text-align:center" align="center">
    <img src="example/example.gif" alt="vue-promise-btn">
</div>

## Features
- Easy-to-use API
- Flexible Usage
- Works with any tag and even forms
- In Extended Mode - compatible with 3rd party components
- Packaged with optional built-in spinner
- Only 1.5KB minified and gzipped
- ESM, CommonJS, UMD versions

### Installation
```
npm install --save vue-promise-btn
```
#### Quick Start:
- Import and "handshake" plugin with vue
```javascript
import Vue from 'vue'
import VuePromiseBtn from 'vue-promise-btn'

// not required. Styles for built-in spinner
import 'vue-promise-btn/dist/vue-promise-btn.css'

Vue.use(VuePromiseBtn) // or with global options Vue.use(VuePromiseBtn, {})
```

- Simple usage:
``` <button v-promise-btn @click="getData">Get Data</button> ```
- Extended usage: ``` <button v-promise-btn={ promise: dataPromise } @click="getData('param')">Get Data</button> ```

#### If you face any issue with simple mode, just try out extended, it's more reliable way.

## Change log

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## Important Notice

Alwayes return Promise from expression. Especially in simple mode.

Don't use semicolon in event expressions. It may break promise return in template-compiler: <br>
Good: `@click="handler($event)"` <br>
Bad: `@click="handler($event);"`

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) and [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md) for details.

## Credits

- [Alex Stepchenkov](https://github.com/STUkh)
- [All Contributors](https://github.com/STUkh/vue-promise-btn/graphs/contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

&copy; [STUkh](https://github.com/STUkh) <stukak@gmail.com>
