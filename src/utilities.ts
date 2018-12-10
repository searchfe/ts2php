/**
 * @file 工具函数
 * @author meixuguang
 */

import {
    computeLineStarts,
    skipTrivia,
    getLineAndCharacterOfPosition
} from './scanner';
import {
    last,
    noop,
    map,
    createMapFromTemplate
} from './core'
import {Node} from 'typescript';
import {
    isNumericLiteral
} from './utilities/nodeTest';
import * as ts from 'typescript';
import {errors} from './globals';

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

/**
 * Gets flags that control emit behavior of a node.
 */
export function getEmitFlags(node: Node): ts.EmitFlags {
    const emitNode = node.emitNode;
    return emitNode && emitNode.flags || 0;
}

export function getLiteralText(node: ts.LiteralLikeNode, sourceFile: ts.SourceFile, neverAsciiEscape: boolean | undefined) {
    // If we don't need to downlevel and we can reach the original source text using
    // the node's parent reference, then simply get the text as it was originally written.
    // if (!nodeIsSynthesized(node) && node.parent && !(isNumericLiteral(node) && node.numericLiteralFlags & ts.TokenFlags.ContainsSeparator)) {
    //     return getSourceTextOfNodeFromSourceFile(sourceFile, node);
    // }

    const escapeText = neverAsciiEscape || (getEmitFlags(node) & ts.EmitFlags.NoAsciiEscaping) ? escapeString : escapeNonAsciiString;

    // If we can't reach the original source text, use the canonical form if it's a number,
    // or a (possibly escaped) quoted form of the original text if it's string-like.
    switch (node.kind) {
        case ts.SyntaxKind.StringLiteral:
            if ((<ts.StringLiteral>node).singleQuote) {
                return "'" + escapeText(node.text, ts.CharacterCodes.singleQuote) + "'";
            }
            else {
                return '"' + escapeText(node.text, ts.CharacterCodes.doubleQuote) + '"';
            }
        case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
            return "`" + escapeText(escapeText(node.text, ts.CharacterCodes.backtick), ts.CharacterCodes.doubleQuote) + "`";
        case ts.SyntaxKind.TemplateHead:
            // tslint:disable-next-line no-invalid-template-strings
            return '"' + escapeText(escapeText(node.text, ts.CharacterCodes.backtick), ts.CharacterCodes.doubleQuote) + '" ' + ".";
        case ts.SyntaxKind.TemplateMiddle:
            // tslint:disable-next-line no-invalid-template-strings
            return ' . "' + escapeText(escapeText(node.text, ts.CharacterCodes.backtick), ts.CharacterCodes.doubleQuote) + '" .';
        case ts.SyntaxKind.TemplateTail:
            const text = escapeText(escapeText(node.text, ts.CharacterCodes.backtick), ts.CharacterCodes.doubleQuote);
            if (text) {
                return ' . "' + text + '"';
            }
            return '';
        case ts.SyntaxKind.NumericLiteral:
        case ts.SyntaxKind.RegularExpressionLiteral:
            return node.text;
    }

    errors.push({
        code: 1,
        msg: `Literal kind '${node.kind}' not accounted for.`
    });

    return '';
}

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

export function rangeIsOnSingleLine(range: ts.TextRange, sourceFile: ts.SourceFile) {
    return rangeStartIsOnSameLineAsRangeEnd(range, range, sourceFile);
}

export function rangeEndPositionsAreOnSameLine(range1: ts.TextRange, range2: ts.TextRange, sourceFile: ts.SourceFile) {
    return positionsAreOnSameLine(range1.end, range2.end, sourceFile);
}

export function rangeStartIsOnSameLineAsRangeEnd(range1: ts.TextRange, range2: ts.TextRange, sourceFile: ts.SourceFile) {
    return positionsAreOnSameLine(getStartPositionOfRange(range1, sourceFile), range2.end, sourceFile);
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

// export function rangeStartPositionsAreOnSameLine(range1: ts.TextRange, range2: ts.TextRange, sourceFile: ts.SourceFile) {
//     return positionsAreOnSameLine(getStartPositionOfRange(range1, sourceFile), getStartPositionOfRange(range2, sourceFile), sourceFile);
// }

// export function getStartPositionOfRange(range: ts.TextRange, sourceFile: ts.SourceFile) {
//     return positionIsSynthesized(range.pos) ? -1 : skipTrivia(sourceFile.text, range.pos);
// }

export function positionsAreOnSameLine(pos1: number, pos2: number, sourceFile: ts.SourceFile) {
    return pos1 === pos2 ||
        getLineOfLocalPosition(sourceFile, pos1) === getLineOfLocalPosition(sourceFile, pos2);
}
export function rangeEndIsOnSameLineAsRangeStart(range1: ts.TextRange, range2: ts.TextRange, sourceFile: ts.SourceFile) {
    return positionsAreOnSameLine(range1.end, getStartPositionOfRange(range2, sourceFile), sourceFile);
}
export function getLineOfLocalPosition(currentSourceFile: ts.SourceFile, pos: number) {
    return getLineAndCharacterOfPosition(currentSourceFile, pos).line;
}
export function getStartPositionOfRange(range: ts.TextRange, sourceFile: ts.SourceFile) {
    return positionIsSynthesized(range.pos) ? -1 : skipTrivia(sourceFile.text, range.pos);
}

export function isGeneratedIdentifier(node: ts.Node) {
    return isIdentifier(node) && ((<ts.Identifier>node).autoGenerateFlags! & ts.GeneratedIdentifierFlags.KindMask) > ts.GeneratedIdentifierFlags.None;
}

export function isIdentifier(node: ts.Node): node is ts.Identifier {
    return node.kind === ts.SyntaxKind.Identifier;
}

// Binding patterns

/* @internal */
export function isBindingPattern(node: Node | undefined): node is ts.BindingPattern {
    if (node) {
        const kind = node.kind;
        return kind === ts.SyntaxKind.ArrayBindingPattern
            || kind === ts.SyntaxKind.ObjectBindingPattern;
    }

    return false;
}

/* @internal */
export function isAssignmentPattern(node: Node): node is ts.AssignmentPattern {
    const kind = node.kind;
    return kind === ts.SyntaxKind.ArrayLiteralExpression
        || kind === ts.SyntaxKind.ObjectLiteralExpression;
}


/* @internal */
export function isArrayBindingElement(node: Node): node is ts.ArrayBindingElement {
    const kind = node.kind;
    return kind === ts.SyntaxKind.BindingElement
        || kind === ts.SyntaxKind.OmittedExpression;
}

export function isPrologueDirective(node: Node): node is ts.PrologueDirective {
    return node.kind === ts.SyntaxKind.ExpressionStatement
        && (<ts.ExpressionStatement>node).expression.kind === ts.SyntaxKind.StringLiteral;
}

// export function getSourceTextOfNodeFromSourceFile(sourceFile: ts.SourceFile, node: Node, includeTrivia = false): string {
//     return getTextOfNodeFromSourceText(sourceFile.text, node, includeTrivia);
// }

// export function getTextOfNodeFromSourceText(sourceText: string, node: Node, includeTrivia = false): string {
//     if (nodeIsMissing(node)) {
//         return "";
//     }

//     let text = sourceText.substring(includeTrivia ? node.pos : skipTrivia(sourceText, node.pos), node.end);

//     if (isJSDocTypeExpressionOrChild(node)) {
//         // strip space + asterisk at line start
//         text = text.replace(/(^|\r?\n|\r)\s*\*\s*/g, "$1");
//     }

//     return text;
// }

// Returns true if this node is missing from the actual source code. A 'missing' node is different
// from 'undefined/defined'. When a node is undefined (which can happen for optional nodes
// in the tree), it is definitely missing. However, a node may be defined, but still be
// missing.  This happens whenever the parser knows it needs to parse something, but can't
// get anything in the source code that it expects at that location. For example:
//
//          let a: ;
//
// Here, the Type in the Type-Annotation is not-optional (as there is a colon in the source
// code). So the parser will attempt to parse out a type, and will create an actual node.
// However, this node will be 'missing' in the sense that no actual source-code/tokens are
// contained within it.
export function nodeIsMissing(node: Node | undefined): boolean {
    if (node === undefined) {
        return true;
    }

    return node.pos === node.end && node.pos >= 0 && node.kind !== ts.SyntaxKind.EndOfFileToken;
}

/**
 * Based heavily on the abstract 'Quote'/'QuoteJSONString' operation from ECMA-262 (24.3.2.2),
 * but augmented for a few select characters (e.g. lineSeparator, paragraphSeparator, nextLine)
 * Note that this doesn't actually wrap the input in double quotes.
 */
export function escapeString(s: string, quoteChar?: ts.CharacterCodes.doubleQuote | ts.CharacterCodes.singleQuote | ts.CharacterCodes.backtick): string {
    const escapedCharsRegExp =
        quoteChar === ts.CharacterCodes.backtick ? backtickQuoteEscapedCharsRegExp :
            quoteChar === ts.CharacterCodes.singleQuote ? singleQuoteEscapedCharsRegExp :
                doubleQuoteEscapedCharsRegExp;
    return s.replace(escapedCharsRegExp, getReplacement);
}

function getReplacement(c: string, offset: number, input: string) {
    if (c.charCodeAt(0) === ts.CharacterCodes.nullCharacter) {
        const lookAhead = input.charCodeAt(offset + c.length);
        if (lookAhead >= ts.CharacterCodes._0 && lookAhead <= ts.CharacterCodes._9) {
            // If the null character is followed by digits, print as a hex escape to prevent the result from parsing as an octal (which is forbidden in strict mode)
            return "\\x00";
        }
        // Otherwise, keep printing a literal \0 for the null character
        return "\\0";
    }
    return escapedCharsMap.get(c) || get16BitUnicodeEscapeSequence(c.charCodeAt(0));
}

function get16BitUnicodeEscapeSequence(charCode: number): string {
    const hexCharCode = charCode.toString(16).toUpperCase();
    const paddedHexCode = ("0000" + hexCharCode).slice(-4);
    return "\\u" + paddedHexCode;
}

// This consists of the first 19 unprintable ASCII characters, canonical escapes, lineSeparator,
// paragraphSeparator, and nextLine. The latter three are just desirable to suppress new lines in
// the language service. These characters should be escaped when printing, and if any characters are added,
// the map below must be updated. Note that this regexp *does not* include the 'delete' character.
// There is no reason for this other than that JSON.stringify does not handle it either.
const doubleQuoteEscapedCharsRegExp = /[\\\"\u0000-\u001f\t\v\f\b\r\n\u2028\u2029\u0085]/g;
const singleQuoteEscapedCharsRegExp = /[\\\'\u0000-\u001f\t\v\f\b\r\n\u2028\u2029\u0085]/g;
const backtickQuoteEscapedCharsRegExp = /[\\\`\u0000-\u001f\t\v\f\b\r\n\u2028\u2029\u0085]/g;
const escapedCharsMap = createMapFromTemplate({
    "\t": "\\t",
    "\v": "\\v",
    "\f": "\\f",
    "\b": "\\b",
    "\r": "\\r",
    "\n": "\\n",
    "\\": "\\\\",
    "\"": "\\\"",
    "\'": "\\\'",
    "\`": "\\\`",
    "\u2028": "\\u2028", // lineSeparator
    "\u2029": "\\u2029", // paragraphSeparator
    "\u0085": "\\u0085"  // nextLine
});

const nonAsciiCharacters = /[^\u0000-\u007F]/g;
export function escapeNonAsciiString(s: string, quoteChar?: ts.CharacterCodes.doubleQuote | ts.CharacterCodes.singleQuote | ts.CharacterCodes.backtick): string {
    s = escapeString(s, quoteChar);
    // Replace non-ASCII characters with '\uNNNN' escapes if any exist.
    // Otherwise just return the original string.
    return nonAsciiCharacters.test(s) ?
        s.replace(nonAsciiCharacters, c => get16BitUnicodeEscapeSequence(c.charCodeAt(0))) :
        s;
}

/**
 * Returns a value indicating whether a name is unique globally or within the current file.
 * Note: This does not consider whether a name appears as a free identifier or not, so at the expression `x.y` this includes both `x` and `y`.
 */
export function isFileLevelUniqueName(sourceFile: ts.SourceFile, name: string, hasGlobalName?: ts.PrintHandlers["hasGlobalName"]): boolean {
    return !(hasGlobalName && hasGlobalName(name)) && !sourceFile.identifiers.has(name);
}