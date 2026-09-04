const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

console.log('--- Generating Kosher Code Favicons & Brand Assets ---');

// 1. Create a dedicated HTML file that renders the SVG at 512x512
const svgContent = fs.readFileSync(path.join(publicDir, 'favicon.svg'), 'utf8');
const renderHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    width: 512px;
    height: 512px;
    overflow: hidden;
    background: transparent;
  }
  svg {
    width: 512px;
    height: 512px;
    display: block;
  }
</style>
</head>
<body>
${svgContent}
</body>
</html>`;

const tempHtmlPath = path.join(__dirname, 'temp_render.html');
fs.writeFileSync(tempHtmlPath, renderHtml, 'utf8');

const logo512Path = path.join(publicDir, 'logo512.png');
console.log('Rendering 512x512 master PNG using Edge headless...');
execFileSync(edgePath, [
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--window-size=512,512',
    `--screenshot=${logo512Path}`,
    `file:///${tempHtmlPath.replace(/\\/g, '/')}`
]);

if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
}

if (!fs.existsSync(logo512Path)) {
    throw new Error('Failed to generate logo512.png');
}
console.log('Master logo512.png created successfully. Size:', fs.statSync(logo512Path).size, 'bytes');

// 2. PowerShell script to downscale high-quality PNGs
const psScript = `
Add-Type -AssemblyName System.Drawing;
function Resize-Image($srcPath, $destPath, $width, $height) {
    $src = [System.Drawing.Image]::FromFile($srcPath);
    $dest = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb);
    $graphics = [System.Drawing.Graphics]::FromImage($dest);
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality;
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic;
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality;
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality;
    $graphics.DrawImage($src, 0, 0, $width, $height);
    $dest.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png);
    $graphics.Dispose();
    $dest.Dispose();
    $src.Dispose();
    Write-Output "Generated $destPath ($width x $height)";
}

Resize-Image "${logo512Path.replace(/\\/g, '\\\\')}" "${path.join(publicDir, 'logo192.png').replace(/\\/g, '\\\\')}" 192 192;
Resize-Image "${logo512Path.replace(/\\/g, '\\\\')}" "${path.join(publicDir, 'favicon.png').replace(/\\/g, '\\\\')}" 64 64;
Resize-Image "${logo512Path.replace(/\\/g, '\\\\')}" "${path.join(publicDir, 'favicon-48.png').replace(/\\/g, '\\\\')}" 48 48;
Resize-Image "${logo512Path.replace(/\\/g, '\\\\')}" "${path.join(publicDir, 'favicon-32.png').replace(/\\/g, '\\\\')}" 32 32;
Resize-Image "${logo512Path.replace(/\\/g, '\\\\')}" "${path.join(publicDir, 'favicon-16.png').replace(/\\/g, '\\\\')}" 16 16;
`;

const tempPsPath = path.join(__dirname, 'resize.ps1');
fs.writeFileSync(tempPsPath, psScript, 'utf8');

console.log('Generating multi-resolution PNGs via PowerShell System.Drawing...');
execFileSync('powershell.exe', ['-ExecutionPolicy', 'Bypass', '-File', tempPsPath]);

if (fs.existsSync(tempPsPath)) {
    fs.unlinkSync(tempPsPath);
}

// 3. Assemble Windows ICO containing 16x16, 32x32, 48x48, and 64x64 PNG streams
console.log('Packing multi-resolution favicon.ico...');
const sizes = [16, 32, 48, 64];
const pngBuffers = sizes.map(sz => {
    const p = sz === 64 ? path.join(publicDir, 'favicon.png') : path.join(publicDir, `favicon-${sz}.png`);
    return {
        size: sz,
        buffer: fs.readFileSync(p)
    };
});

// ICO File Structure:
// Header: 6 bytes
// Directory entries: 16 bytes per image
// Image data: raw PNG bytes
const numImages = pngBuffers.length;
const headerSize = 6;
const dirEntrySize = 16;
let currentOffset = headerSize + (numImages * dirEntrySize);

const headerBuf = Buffer.alloc(headerSize);
headerBuf.writeUInt16LE(0, 0); // Reserved
headerBuf.writeUInt16LE(1, 2); // Type 1 = ICO
headerBuf.writeUInt16LE(numImages, 4); // Number of images

const dirBuffers = [];
const dataBuffers = [];

for (const img of pngBuffers) {
    const dirBuf = Buffer.alloc(dirEntrySize);
    dirBuf.writeUInt8(img.size === 256 ? 0 : img.size, 0); // Width
    dirBuf.writeUInt8(img.size === 256 ? 0 : img.size, 1); // Height
    dirBuf.writeUInt8(0, 2); // Color palette
    dirBuf.writeUInt8(0, 3); // Reserved
    dirBuf.writeUInt16LE(1, 4); // Color planes
    dirBuf.writeUInt16LE(32, 6); // Bits per pixel
    dirBuf.writeUInt32LE(img.buffer.length, 8); // Image data size
    dirBuf.writeUInt32LE(currentOffset, 12); // Image data offset
    
    dirBuffers.push(dirBuf);
    dataBuffers.push(img.buffer);
    currentOffset += img.buffer.length;
}

const finalIco = Buffer.concat([headerBuf, ...dirBuffers, ...dataBuffers]);
const icoPath = path.join(publicDir, 'favicon.ico');
fs.writeFileSync(icoPath, finalIco);

console.log('favicon.ico successfully generated! Size:', fs.statSync(icoPath).size, 'bytes with sizes:', sizes.join(', '));

// Clean up temporary 16 & 48 pngs, keep 32 and 64 for explicit web references
const temp48 = path.join(publicDir, 'favicon-48.png');
const temp16 = path.join(publicDir, 'favicon-16.png');
if (fs.existsSync(temp48)) fs.unlinkSync(temp48);
if (fs.existsSync(temp16)) fs.unlinkSync(temp16);

console.log('--- Favicon Generation Complete! ---');
