/**
 * An importer function which can be used with node-sass.
 * It ensures that multiple import statements in sass/scss files get only imported once.
 */

const path = require('path');
const fs = require('fs');

function importsToResolve(file) {
  if (fs.existsSync(file)) return file;
  let basename = path.basename(file);
  if (basename[0] !== '_') {
    let filename = path.join(path.dirname(file), '_' + basename);
    if (fs.existsSync(filename)) return filename;
  }
  return '';
}

module.exports = function (options) {
  options = options || { alias: {} };
  const alias = options.alias || {};
  // const root = options.root || __dirname;
  const aliasList = Object.keys(alias).map(function (key) {
    return { regx: new RegExp('^~' + key + ''), path: alias[key] };
  });
  const exclude = options.exclude;
  // storage of already imported files
  const imports = {};
  return function (file, prev, done) {
    function resolveFile (result) {
      let filename = result;
      if (typeof result === 'object') {
        if (!result.file) return done(result);
        filename = result.file;
      }
      if ((!exclude || !exclude.test(filename)) && imports[filename]) {
        done({ contents: '' });
        return;
      }
      imports[filename] = true;
      done({ file: filename });
    }

    if (this.options.indentedSyntax) {
      if (!/\.sass$/.test(file)) file += '.sass';
    } else if (!/\.scss$/.test(file)) file += '.scss';

    let filename = file;
    if (filename[0] === '~') {
      let alias = aliasList.find(function (v) {
        return v.regx.test(file);
      });
      if (alias) filename = path.join(alias.path, file.replace(alias.regx, ''));
      else filename = require.resolve(file.substr(1));
    } else {
      if (prev) filename = importsToResolve(path.resolve(path.dirname(prev), file));
      if (!filename) {
        let includePaths = this.options.includePaths.split(';');
        if (includePaths.length) filename = importsToResolve(path.resolve(includePaths[includePaths.length - 1], file));
      }
      if (!filename) filename = file;
    }
    resolveFile(filename);
  };
};