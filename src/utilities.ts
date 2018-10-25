/**
 * @file 工具函数
 * @author meixuguang
 */

import {
    EmitTextWriter
} from './types'
import {
    computeLineStarts
} from './scanner';
import {
    last,
    noop,
    map
} from './core'
import {Node} from 'typescript';
import * as ts from 'typescript';

const indentStrings: string[] = ["", "    "];
export function getIndentString(level: number) {
    if (indentStrings[level] === undefined) {
        indentStrings[level] = getIndentString(level - 1) + indentStrings[1];
    }
    return indentStrings[level];
}

export function getIndentSize() {
    return indentStrings[1].length;
}

export function createTextWriter(newLine: string): EmitTextWriter {
    let output: string;
    let indent: number;
    let lineStart: boolean;
    let lineCount: number;
    let linePos: number;

    function updateLineCountAndPosFor(s: string) {
        const lineStartsOfS = computeLineStarts(s);
        if (lineStartsOfS.length > 1) {
            lineCount = lineCount + lineStartsOfS.length - 1;
            linePos = output.length - s.length + last(lineStartsOfS);
            lineStart = (linePos - output.length) === 0;
        }
        else {
            lineStart = false;
        }
    }

    function write(s: string) {
        if (s && s.length) {
            if (lineStart) {
                s = getIndentString(indent) + s;
                lineStart = false;
            }
            output += s;
            updateLineCountAndPosFor(s);
        }
    }

    function reset(): void {
        output = "";
        indent = 0;
        lineStart = true;
        lineCount = 0;
        linePos = 0;
    }

    function rawWrite(s: string) {
        if (s !== undefined) {
            output += s;
            updateLineCountAndPosFor(s);
        }
    }

    function writeLiteral(s: string) {
        if (s && s.length) {
            write(s);
        }
    }

    function writeLine() {
        if (!lineStart) {
            output += newLine;
            lineCount++;
            linePos = output.length;
            lineStart = true;
        }
    }

    function writeTextOfNode(text: string, node: Node) {

    }

    reset();

    return {
        write,
        rawWrite,
        writeTextOfNode,
        writeLiteral,
        writeLine,
        increaseIndent: () => { indent++; },
        decreaseIndent: () => { indent--; },
        getIndent: () => indent,
        getTextPos: () => output.length,
        getLine: () => lineCount,
        getColumn: () => lineStart ? indent * getIndentSize() : output.length - linePos,
        getText: () => output,
        isAtStartOfLine: () => lineStart,
        clear: reset,
        reportInaccessibleThisError: noop,
        reportPrivateInBaseOfClassExpression: noop,
        reportInaccessibleUniqueSymbolError: noop,
        trackSymbol: noop,
        writeKeyword: write,
        writeOperator: write,
        writeParameter: write,
        writeProperty: write,
        writePunctuation: write,
        writeSpace: write,
        writeStringLiteral: write,
        writeSymbol: write
    };
}


export function showSymbol(symbol: ts.Symbol): string {
    const symbolFlags = ts.SymbolFlags;
    return `{ flags: ${symbolFlags ? showFlags(symbol.flags, symbolFlags) : symbol.flags}; declarations: ${map(symbol.declarations, showSyntaxKind)} }`;
}

function showFlags(flags: number, flagsEnum: { [flag: number]: string }): string {
    const out: string[] = [];
    for (let pow = 0; pow <= 30; pow++) {
        const n = 1 << pow;
        if (flags & n) {
            out.push(flagsEnum[n]);
        }
    }
    return out.join("|");
}

export function showSyntaxKind(node: Node): string {
    const syntaxKind = ts.SyntaxKind;
    return syntaxKind ? syntaxKind[node.kind] : node.kind.toString();
}