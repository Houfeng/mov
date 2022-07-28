import { name } from './package.json';
// import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: './src/index.ts',
  output: [
    {
      file: `./dist/${name}.es.js`,
      format: 'es'
    },
    {
      file: `./dist/${name}.cjs.js`,
      format: 'cjs'
    },
    {
      file: `./dist/${name}.umd.js`,
      format: 'umd',
      name: name
    },
    {
      file: `./dist/${name}.iife.js`,
      format: 'iife',
      name: name
    }
  ],
  plugins: [
    // terser(),
    typescript({
      useTsconfigDeclarationDir: true,
    }),
  ]
};