#!/usr/bin/env node

import { compile } from '../index'
import { join, resolve, dirname } from 'path'
import { readdirSync, lstatSync, ensureDirSync, writeFileSync } from 'fs-extra'
import yargs = require('yargs')

yargs.usage('ts2php [options] <files ...>')
    .describe('Transpile TypeScript files to PHP, see: https://github.com/max-team/ts2php')
    .example('$0 -c config.js src/index.ts', 'Transpile using a config file')
    .alias('d', 'show-diagnostics').describe('d', 'Show diagnostics').boolean('d')
    .alias('H', 'emit-header').describe('H', 'Emit header').boolean('H')
    .alias('c', 'config').describe('c', 'Specify a config file').string('c')
    .alias('o', 'out').describe('o', 'Output directory, defaults to stdout').string('o')
    .demandCommand(1, 'Invalid options, specify a file')
    .help('h').alias('h', 'help')
    .argv;

const argv = yargs.argv

const options = argv.config
    ? require(resolve(argv.config))
    : {
        showDiagnostics: !!argv.showDiagnostics,
        emitHeader: !!argv.emitHeader,
    };

console.error('using options:', options)
argv._.forEach(compilePath)

function compileFile(filepath) {
    console.error(`transpiling ${filepath}...`)

    const { errors, phpCode } = compile(filepath, options);
    if (errors.length) throw new Error('error:' + JSON.stringify(errors))
    if (argv.out) {
        const outpath = join(argv.out, filepath).replace(/\.ts$/, '.php')
        ensureDirSync(dirname(outpath))
        writeFileSync(outpath, phpCode, 'utf8')
        console.error(`${phpCode.length} chars written to ${outpath}`)
    } else {
        console.log(phpCode)
    }
}

function compilePath(path) {
    const stat = lstatSync(path);
    if (stat.isFile() && /\.ts$/.test(path)) compileFile(path);
    else if (stat.isDirectory()) {
        readdirSync(path).forEach(file => compilePath(join(path, file)))
    }
}
