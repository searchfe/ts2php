#!/usr/bin/env node

import * as ts from 'byots';
import { compile } from '../index'
import { normalize, join, resolve, dirname } from 'path'
import { readdirSync, lstatSync, ensureDirSync, writeFileSync } from 'fs-extra'
import yargs = require('yargs')

yargs.usage('ts2php [options] <files ...>')
    .describe('desc', 'Transpile TypeScript files to PHP, see: https://github.com/max-team/ts2php')
    .example('$0 -c config.js src/index.ts', 'Transpile using a config file')
    .alias('c', 'config').describe('c', 'Specify a config file, see: https://max-team.github.io/ts2php/interfaces/ts2phpoptions.html').string('c')
    .alias('o', 'out').describe('o', 'Output directory, defaults to stdout').string('o')
    .demandCommand(1, 'Invalid options, specify a file')
    .help('h').alias('h', 'help')
    .argv;

const argv = yargs.argv

let options = {};
if (argv.config) {
    const configFile = resolve(argv.config as string)
    console.error('[options]', configFile)
    options = require(configFile)
}

const stripPrefix = argv._.length === 1 && lstatSync(argv._[0]).isDirectory()
argv._.forEach(compilePath)

function compileFile(filepath) {
    console.error(`[compile] ${filepath}...`)

    const { errors, phpCode } = compile(filepath, options);
    if (errors.length) {
        (errors as ts.Diagnostic[]).forEach(({file, messageText, start}) => {
            const text = typeof messageText === 'string' ? messageText : messageText.messageText
            console.error(`[error] ${text} in ${file.fileName} at ${start}`)
        })
        process.exit(1);
    }
    if (argv.out) {
        const outpath = outPath(filepath)
        ensureDirSync(dirname(outpath))
        writeFileSync(outpath, phpCode, 'utf8')
        console.error(`[written] ${phpCode.length} chars to ${outpath}`)
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

function outPath(filepath: string) {
    if (stripPrefix) {
        filepath = normalize(filepath)
        const prefix = normalize(argv._[0])
        filepath = filepath.replace(prefix, '')
    }
    return join(argv.out as string, filepath).replace(/\.ts$/, '.php')
}
