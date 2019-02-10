import vue from 'rollup-plugin-vue'
import buble from 'rollup-plugin-buble'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from "rollup-plugin-terser";
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import { eslint } from "rollup-plugin-eslint";
import css from 'rollup-plugin-css-only'
import pkg from './package.json';

const isDevelopment = process.env.NODE_ENV === `development`

let plugins = [
  css({ output: pkg.style }),
  vue({
    css: false
  }),
  eslint(),
  buble({
    objectAssign: 'Object.assign'
  }),
  nodeResolve({
    jsnext: true,
    main: true,
    browser: true
  }),
  commonjs()
]

let config = {
  input: './src/main.js',
  output: [
    { format: 'es', file: pkg.module },
    { format: 'cjs', file: pkg.main },
    { format: 'umd', file: pkg.unpkg, name: 'VuePromiseBtn', globals: { vue: 'Vue' } }
  ],
  plugins: plugins,
  external: ['vue']
}

if (isDevelopment) {
  config.plugins.push(livereload())
  config.plugins.push(
    serve({
      open: true,
      contentBase: ['']
    })
  )
} else {
  config.output.sourcemap = false
  config.plugins.push(terser({ sourcemap: false }))
}

export default config