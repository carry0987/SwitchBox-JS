import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import { dts } from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import del from 'rollup-plugin-delete';
import { createRequire } from 'module';
const pkg = createRequire(import.meta.url)('./package.json');

const isProduction = process.env.BUILD === 'production';

const jsConfig = {
    input: 'src/switchBox.ts',
    output: [
        {
            file: pkg.main,
            format: 'umd',
            name: 'SwitchBox',
            plugins: isProduction ? [terser()] : []
        }
    ],
    plugins: [
        postcss({
            extract: true,
            minimize: true,
            sourceMap: false
        }),
        typescript(),
        resolve(),
        replace({
            preventAssignment: true,
            __version__: pkg.version
        })
    ]
};

const esConfig = {
    input: 'src/switchBox.ts',
    output: [
        {
            file: pkg.module,
            format: 'es'
        }
    ],
    plugins: [
        postcss({
            extract: false,
            sourceMap: false
        }),
        typescript(),
        resolve(),
        replace({
            preventAssignment: true,
            __version__: pkg.version
        })
    ]
};

const dtsConfig = {
    input: 'dist/switchBox.d.ts',
    output: {
        file: pkg.types,
        format: 'es'
    },
    external: [/\.css$/u],
    plugins: [
        dts(),
        del({ hook: 'buildEnd', targets: ['!dist/index.js', 'dist/*.d.ts', 'dist/interface', 'dist/module'] })
    ]
};

export default [jsConfig, esConfig, dtsConfig];
