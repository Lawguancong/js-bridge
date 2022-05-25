// c处理需要打入库的依赖 就是处理npm install的依赖 就是告诉rollup如何找到外部插件位置
import resolve from '@rollup/plugin-node-resolve';
// 处理babel代码逻辑 在考虑要不要使用babel-transform-runtime 替换 preset-env
import babel from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';
// commonjs模块转es6模块 主要是为了能够tree-shaking es6模块 但是至少能够兼容吧
import commonjs from '@rollup/plugin-commonjs';
// 用于替换文件中的字符串 打包时候会进行替换
import replace from '@rollup/plugin-replace';
// 引入json
import jsonPlugin from '@rollup/plugin-json';

import originTypescript from 'typescript';
import { DEFAULT_EXTENSIONS } from '@babel/core';
// 压缩
import { terser } from 'rollup-plugin-terser';
import * as pkg from './package.json';

const libraryName = 'RuqiJSBridge';
const { main, module, browser } = pkg;

const outputArray = [
  { file: main, format: 'umd', name: libraryName },
  { file: module, format: 'esm', name: libraryName },
  { file: browser, format: 'umd', name: libraryName },
];

const libArray = outputArray.map((item) => ({
  ...item,
  file: item.file.replace('dist/index', `lib/ruqiJSBridge-${pkg.version}`),
}));

export default {
  input: 'src/index.ts',
  output: [...outputArray, ...libArray],
  plugins: [
    // 替换项目中的字符串
    replace({ VERSION: pkg.version }),
    resolve(),
    typescript({
      exclude: 'node_modules/**',
      typescript: originTypescript,
    }),
    commonjs({ extensions: ['.js', '.ts'] }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions: [...DEFAULT_EXTENSIONS, 'ts', 'tsx', 'js'],
    }),
    jsonPlugin(),
    terser(),
  ],
  // 如果需要去除某些外部 依赖 类似于写react的组件库 那么可以去除react这个包 就配置在这里就可以了
  // external: []
};
