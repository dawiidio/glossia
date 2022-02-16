#!/usr/bin/env node

const cp = require('child_process');

if (process.argv.includes('-p')) {
    console.log('Build production version');
    cp.execSync('rm -r dist');
    cp.execSync('node_modules/.bin/tsc --project tsconfig.prod.json');
}
else {
    cp.execSync('node_modules/.bin/tsc');
}

cp.execSync('cp -r dist/src/ dist/');
cp.execSync('rm -r dist/types dist/src');
