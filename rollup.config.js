import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

//const isProduction = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.ts',
  output: [
    {
      file: 'dist/main.js',
      format: 'esm'
    },
    {
      file: 'dist/main.min.js',
      format: 'iife',
      name: '$api',
      plugins: [terser()]
    }],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist',
      emitDeclarationOnly: true
    }),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    //isProduction && terser({ format: { comments: false } }),
  ],
};