import resolve from '@rollup/plugin-node-resolve';
import commonJs from '@rollup/plugin-commonjs';

const sea = "./sea/index.js";
const gun = "./src/index.js";

export default [
  {
    input: sea,
    plugins: [ resolve({preferBuiltins: false}), commonJs() ],
    output: {
      file: 'dist/sea.esm.js',
      format: 'es'
    }
  },
  {
    input: gun,
    plugins: [ resolve({preferBuiltins: false}), commonJs() ],
    output: {
      file: 'dist/gun.esm.js',
      format: 'es'
    }
  }
]