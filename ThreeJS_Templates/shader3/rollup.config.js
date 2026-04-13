import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"
import terser from "@rollup/plugin-terser"
import babel from "@rollup/plugin-babel"
import dts from "rollup-plugin-dts"
import glsl from './glsl.js'

const extensions = [".js", ".ts"]

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/shader3.cjs.js",
        format: "cjs",
        sourcemap: false,
      },
      {
        file: "dist/shader3.esm.js",
        format: "esm",
        sourcemap: false,
      },
      {
        file: "dist/shader3.js",
        format: "umd",
        name: "Shader3",
        globals: {
          three: "THREE",
        },
        sourcemap: false,
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript(),
      glsl({ include: '**/*.glsl' }),
      babel({
        babelHelpers: "runtime",
        extensions,
        exclude: "node_modules/**",
        plugins: ["@babel/plugin-transform-runtime"],
      }),
      terser(),
    ],
    external: ["three", "@babel/runtime"],
    watch: {
      include: 'src/**', // Watch all files in the src directory
      exclude: 'node_modules/**', // Exclude node_modules
    },
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/shader3.d.ts",
      format: "es",
    },
    plugins: [dts(), glsl({ include: '**/*.glsl' }),],
    watch: {
      include: 'src/**',
    },
  },
]
