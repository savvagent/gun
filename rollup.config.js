import resolve from '@rollup/plugin-node-resolve';
import commonJs from '@rollup/plugin-commonjs';

const sea = "./sea/index.js";
const gun = "./src/index.js";

export default [
  {
    input: sea,
    plugins: [ resolve({preferBuiltins: false}), commonJs() ],
    output: {
      file: 'dist/sea.js',
      format: 'es'
    }
  },
  {
    input: gun,
    plugins: [ resolve({preferBuiltins: false}), commonJs() ],
    output: {
      file: 'dist/gun.js',
      format: 'es'
    }
  }
]