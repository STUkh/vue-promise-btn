import vue from 'rollup-plugin-vue'
import buble from 'rollup-plugin-buble'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import eslint from 'rollup-plugin-eslint';
import pkg from './package.json';

const isDevelopment = process.env.NODE_ENV === `development`

let plugins = [
  vue({
    css: pkg.style
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
  config.plugins.push(uglify())
}

export default config