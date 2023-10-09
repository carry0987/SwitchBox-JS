import terser from "@rollup/plugin-terser";
import postcss from 'rollup-plugin-postcss';

export default {
    input: 'src/switchBox.js',
    output: [
        {
            file: 'dist/switchBox.min.js',
            format: 'umd',
            name: 'SwitchBox',
            plugins: [terser()],
        }
    ],
    plugins: [
        postcss({
            extract: true,
            minimize: true,
            sourceMap: false
        }),
    ]
};
