const fs = require('fs');
const path = require('path');

function patchPostcssPkg(pkgPath) {
  try {
    if (fs.existsSync(pkgPath)) {
      const content = fs.readFileSync(pkgPath, 'utf8');
      const data = JSON.parse(content);
      if (data.exports && typeof data.exports === 'object') {
        let modified = false;
        if (!data.exports['./lib/tokenize']) {
          data.exports['./lib/tokenize'] = './lib/tokenize.js';
          modified = true;
        }
        if (!data.exports['./lib/*']) {
          data.exports['./lib/*'] = './lib/*.js';
          modified = true;
        }
        if (!data.exports['./*']) {
          data.exports['./*'] = './*.js';
          modified = true;
        }
        if (modified) {
          fs.writeFileSync(pkgPath, JSON.stringify(data, null, 2));
          console.log(`[fix-postcss] Patched: ${pkgPath}`);
        }
      }
    }
  } catch (err) {
    // ignore
  }
}

const root = process.cwd();
const directPaths = [
  path.join(root, 'node_modules', 'postcss', 'package.json'),
  path.join(root, 'node_modules', 'postcss-safe-parser', 'node_modules', 'postcss', 'package.json'),
  path.join(root, 'node_modules', 'react-scripts', 'node_modules', 'postcss', 'package.json'),
  path.join(root, 'node_modules', 'react-scripts', 'node_modules', 'postcss-safe-parser', 'node_modules', 'postcss', 'package.json'),
  path.join(root, 'node_modules', 'optimize-css-assets-webpack-plugin', 'node_modules', 'postcss', 'package.json'),
  path.join(root, 'node_modules', 'postcss-loader', 'node_modules', 'postcss', 'package.json')
];

directPaths.forEach(patchPostcssPkg);

// Also scan top-level node_modules directories (depth 1)
const nm = path.join(root, 'node_modules');
if (fs.existsSync(nm)) {
  try {
    const items = fs.readdirSync(nm);
    for (const item of items) {
      if (item.startsWith('.')) continue;
      patchPostcssPkg(path.join(nm, item, 'node_modules', 'postcss', 'package.json'));
      patchPostcssPkg(path.join(nm, item, 'node_modules', 'postcss-safe-parser', 'node_modules', 'postcss', 'package.json'));
    }
  } catch (e) {}
}

console.log('[fix-postcss] PostCSS export compatibility ensured.');
