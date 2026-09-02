const fs = require('fs');
const path = require('path');

const vendorCode = `'use strict'

module.exports = {
  prefix(prop) {
    let match = prop.match(/^(-\\w+-)/)
    if (match) {
      return match[0]
    }
    return ''
  },
  unprefixed(prop) {
    return prop.replace(/^-\\w+-/, '')
  }
}
`;

function fixPostcssDir(postcssDir) {
  try {
    if (!fs.existsSync(postcssDir)) return;

    // 1. Patch package.json
    const pkgPath = path.join(postcssDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const content = fs.readFileSync(pkgPath, 'utf8');
      const data = JSON.parse(content);
      if (data.exports && typeof data.exports === 'object') {
        let modified = false;
        if (!data.exports['./lib/tokenize']) {
          data.exports['./lib/tokenize'] = './lib/tokenize.js';
          modified = true;
        }
        if (!data.exports['./lib/vendor']) {
          data.exports['./lib/vendor'] = './lib/vendor.js';
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
          console.log(`[fix-postcss] Patched package.json: ${pkgPath}`);
        }
      }
    }

    // 2. Ensure lib/vendor.js exists
    const libDir = path.join(postcssDir, 'lib');
    if (fs.existsSync(libDir)) {
      const vendorPath = path.join(libDir, 'vendor.js');
      if (!fs.existsSync(vendorPath)) {
        fs.writeFileSync(vendorPath, vendorCode, 'utf8');
        console.log(`[fix-postcss] Created vendor.js: ${vendorPath}`);
      }

      // 3. Ensure lib/postcss.js exports vendor
      const postcssJsPath = path.join(libDir, 'postcss.js');
      if (fs.existsSync(postcssJsPath)) {
        let postcssJs = fs.readFileSync(postcssJsPath, 'utf8');
        if (!postcssJs.includes('postcss.vendor =')) {
          postcssJs = postcssJs.replace(
            /module\.exports\s*=\s*postcss/,
            `postcss.vendor = require('./vendor')\n\nmodule.exports = postcss`
          );
          fs.writeFileSync(postcssJsPath, postcssJs, 'utf8');
          console.log(`[fix-postcss] Attached vendor to postcss.js: ${postcssJsPath}`);
        }
      }
    }
  } catch (err) {
    console.error(`[fix-postcss] Error patching ${postcssDir}:`, err.message);
  }
}

const root = process.cwd();
const nm = path.join(root, 'node_modules');

// Search direct node_modules paths
const directPaths = [
  path.join(nm, 'postcss'),
  path.join(nm, 'postcss-safe-parser', 'node_modules', 'postcss'),
  path.join(nm, 'react-scripts', 'node_modules', 'postcss'),
  path.join(nm, 'react-scripts', 'node_modules', 'postcss-safe-parser', 'node_modules', 'postcss'),
  path.join(nm, 'optimize-css-assets-webpack-plugin', 'node_modules', 'postcss'),
  path.join(nm, 'postcss-loader', 'node_modules', 'postcss')
];
directPaths.forEach(fixPostcssDir);

// Scan top-level node_modules directories
if (fs.existsSync(nm)) {
  try {
    const items = fs.readdirSync(nm);
    for (const item of items) {
      if (item.startsWith('.')) continue;
      fixPostcssDir(path.join(nm, item, 'node_modules', 'postcss'));
      fixPostcssDir(path.join(nm, item, 'node_modules', 'postcss-safe-parser', 'node_modules', 'postcss'));
    }
  } catch (e) {}
}

// Scan .pnpm store for all postcss instances
const pnpmDir = path.join(nm, '.pnpm');
if (fs.existsSync(pnpmDir)) {
  try {
    const pnpmItems = fs.readdirSync(pnpmDir);
    for (const item of pnpmItems) {
      const pnpmNm = path.join(pnpmDir, item, 'node_modules');
      if (fs.existsSync(pnpmNm)) {
        try {
          const subPkgs = fs.readdirSync(pnpmNm);
          for (const subPkg of subPkgs) {
            if (subPkg === 'postcss') {
              fixPostcssDir(path.join(pnpmNm, subPkg));
            } else if (subPkg === 'postcss-safe-parser') {
              fixPostcssDir(path.join(pnpmNm, subPkg, 'node_modules', 'postcss'));
            }
          }
        } catch (err) {}
      }
    }
  } catch (e) {}
}

console.log('[fix-postcss] PostCSS export compatibility & vendor shim ensured.');

