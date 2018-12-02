/**
 * @file 工具函数
 * @author meixuguang
 */

import {
    computeLineStarts
} from './scanner';
import {
    last,
    noop,
    map
} from './core'
import {Node} from 'typescript';
import * as types from './types';
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

export function createTextWriter(newLine: string): ts.EmitTextWriter {
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

    function writeTextOfNode(text: string, node: ts.Node) {

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

// export function getLiteralText(node: ts.LiteralLikeNode, sourceFile: ts.SourceFile, neverAsciiEscape: boolean | undefined) {
//     // If we don't need to downlevel and we can reach the original source text using
//     // the node's parent reference, then simply get the text as it was originally written.
//     if (!nodeIsSynthesized(node) && node.parent && !(isNumericLiteral(node) && node.numericLiteralFlags & TokenFlags.ContainsSeparator)) {
//         return getSourceTextOfNodeFromSourceFile(sourceFile, node);
//     }

//     const escapeText = neverAsciiEscape || (getEmitFlags(node) & EmitFlags.NoAsciiEscaping) ? escapeString : escapeNonAsciiString;

//     // If we can't reach the original source text, use the canonical form if it's a number,
//     // or a (possibly escaped) quoted form of the original text if it's string-like.
//     switch (node.kind) {
//         case SyntaxKind.StringLiteral:
//             if ((<StringLiteral>node).singleQuote) {
//                 return "'" + escapeText(node.text, CharacterCodes.singleQuote) + "'";
//             }
//             else {
//                 return '"' + escapeText(node.text, CharacterCodes.doubleQuote) + '"';
//             }
//         case SyntaxKind.NoSubstitutionTemplateLiteral:
//             return "`" + escapeText(node.text, CharacterCodes.backtick) + "`";
//         case SyntaxKind.TemplateHead:
//             // tslint:disable-next-line no-invalid-template-strings
//             return "`" + escapeText(node.text, CharacterCodes.backtick) + "${";
//         case SyntaxKind.TemplateMiddle:
//             // tslint:disable-next-line no-invalid-template-strings
//             return "}" + escapeText(node.text, CharacterCodes.backtick) + "${";
//         case SyntaxKind.TemplateTail:
//             return "}" + escapeText(node.text, CharacterCodes.backtick) + "`";
//         case SyntaxKind.NumericLiteral:
//         case SyntaxKind.RegularExpressionLiteral:
//             return node.text;
//     }

//     return Debug.fail(`Literal kind '${node.kind}' not accounted for.`);
// }

export function nodeIsSynthesized(range: ts.TextRange): boolean {
    return positionIsSynthesized(range.pos)
        || positionIsSynthesized(range.end);
}

export function positionIsSynthesized(pos: number): boolean {
    // This is a fast way of testing the following conditions:
    //  pos === undefined || pos === null || isNaN(pos) || pos < 0;
    return !(pos >= 0);
}

export function idText(identifier: ts.Identifier): string {
    return unescapeLeadingUnderscores(identifier.escapedText);
}

/**
 * Remove extra underscore from escaped identifier text content.
 *
 * @param identifier The escaped identifier text.
 * @returns The unescaped identifier text.
 */
export function unescapeLeadingUnderscores(identifier: ts.__String): string {
    const id = identifier as string;
    return id.length >= 3 && id.charCodeAt(0) === ts.CharacterCodes._ && id.charCodeAt(1) === ts.CharacterCodes._ && id.charCodeAt(2) === ts.CharacterCodes._ ? id.substr(1) : id;
}

export function isGeneratedIdentifier(node: ts.Node) {
    return isIdentifier(node) && ((<ts.Identifier>node).autoGenerateFlags! & ts.GeneratedIdentifierFlags.KindMask) > ts.GeneratedIdentifierFlags.None;
}

export function isIdentifier(node: ts.Node) {
    return node.kind === ts.SyntaxKind.Identifier;
}