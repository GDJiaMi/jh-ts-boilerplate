import filesize from 'rollup-plugin-filesize'
import resolve from 'rollup-plugin-node-resolve'
import commonJS from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import progress from 'rollup-plugin-progress'
import replace from 'rollup-plugin-replace'
import pkg from './package.json'
import _ from 'lodash'

const RESOLVE_CONFIG = {
  module: true,
  jsnext: true,
  main: true,
}
const BANNER = `
/**
 * ${pkg.name} - ${pkg.version}
 * ${pkg.homepage || ''}
 * Copyright(c) ${new Date().getFullYear()}
 * Author ${pkg.author}
 * Licence ${pkg.license}
 */
`

const UMD_NAME = _.upperFirst(_.camelCase(pkg.name))

export default [
  // commonJS for development
  {
    input: './lib/index.js',
    output: {
      file: './dist/index.js',
      format: 'cjs',
      banner: BANNER,
    },
    plugins: [
      progress(),
      replace({
        // don't replace NODE_ENV, let Webpack or other Bundler to handle it.
        'process.env.MODULE_TYPE': JSON.stringify('commonjs'),
      }),
      resolve(RESOLVE_CONFIG),
      commonJS(),
      filesize(),
    ],
  },
  // ES6 for development
  {
    input: './lib/index.js',
    output: {
      file: './dist/index.module.js',
      format: 'es',
      banner: BANNER,
    },
    plugins: [
      progress(),
      replace({
        // don't replace NODE_ENV, let Webpack or other Bundler to handle it.
        'process.env.MODULE_TYPE': JSON.stringify('es6'),
      }),
      resolve(RESOLVE_CONFIG),
      commonJS(),
      filesize(),
    ],
  },
  // UMD for browser/production
  {
    input: './lib/index.js',
    output: {
      file: './dist/index.umd.js',
      format: 'umd',
      name: UMD_NAME,
      banner: BANNER,
    },
    plugins: [
      progress(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env.MODULE_TYPE': JSON.stringify('umd'),
      }),
      resolve(RESOLVE_CONFIG),
      commonJS(),
      uglify({
        output: {
          // preserve banner
          comments: /Copyright\(c\)/,
        },
      }),
      filesize(),
    ],
  },
]
