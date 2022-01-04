#!/usr/bin/env node

const cp = require('child_process');

cp.execSync('node_modules/.bin/tsc');
cp.execSync('cp -r dist/src/ dist/');
cp.execSync('rm -r dist/types dist/src');
