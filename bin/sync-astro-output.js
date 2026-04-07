#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const sourceDir = path.join(repoRoot, 'dist');
const targetDir = path.join(repoRoot, 'src');
const targetAstroDir = path.join(targetDir, '_astro');

function copyTree(source, target) {
  if (!fs.existsSync(source)) {
    return;
  }

  const stats = fs.statSync(source);

  if (stats.isDirectory()) {
    fs.mkdirSync(target, { recursive: true });
    for (const entry of fs.readdirSync(source)) {
      copyTree(path.join(source, entry), path.join(target, entry));
    }
    return;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

if (fs.existsSync(targetAstroDir)) {
  fs.rmSync(targetAstroDir, { recursive: true, force: true });
}

copyTree(sourceDir, targetDir);
console.log(`Astro output synced from ${path.relative(repoRoot, sourceDir)} to ${path.relative(repoRoot, targetDir)}`);
