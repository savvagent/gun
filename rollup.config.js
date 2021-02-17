import commonJs from '@rollup/plugin-commonjs';
import glob from 'glob';
import resolve from '@rollup/plugin-node-resolve';
import { resolve as res } from 'path';

const sea = "./sea/index.js";
const gun = "./src/index.js";
const libInputs = glob.sync(res(__dirname, 'lib', '**', '*.js'));

const plugins = [
  resolve({preferBuiltins: false}), commonJs()
]

const libEntries = libInputs.map(input => {
  const [ fPath, name ] = input.match(/.+\/(.+)/);
  const fileName = name;
  return {
    input,
    plugins,
    context: 'null',
    moduleContext: 'null',
    output: { file: `./dist/${fileName}`, format: 'es' }
  };
});

const seaEntry = {
  input: sea,
  plugins,
  output: {
    file: 'dist/sea.js',
    format: 'es'
  }
};



const gunEntry = {
  input: gun,
  plugins,
  output: {
    file: 'dist/gun.js',
    format: 'es'
  }
};
export default [ seaEntry, gunEntry];