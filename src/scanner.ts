import {
    Map,
    createMapFromTemplate,
    MapLike,
    identity,
    compareValues,
    binarySearch
} from './core'

import {positionIsSynthesized} from './utilities';
import {error as pushError} from './state';
import * as ts from 'typescript';

import {SyntaxKind} from 'typescript';

export function computeLineStarts(text: string): number[] {
    const result: number[] = new Array();
    let pos = 0;
    let lineStart = 0;
    while (pos < text.length) {
        const ch = text.charCodeAt(pos);
        pos++;
        switch (ch) {
            case ts.CharacterCodes.carriageReturn:
                if (text.charCodeAt(pos) === ts.CharacterCodes.lineFeed) {
                    pos++;
                }
                // falls through
            case ts.CharacterCodes.lineFeed:
                result.push(lineStart);
                lineStart = pos;
                break;
            default:
                if (ch > ts.CharacterCodes.maxAsciiCharacter && isLineBreak(ch)) {
                    result.push(lineStart);
                    lineStart = pos;
                }
                break;
        }
    }
    result.push(lineStart);
    return result;
}

export function skipTrivia(text: string, pos: number, stopAfterLineBreak?: boolean, stopAtComments = false): number {
    if (positionIsSynthesized(pos)) {
        return pos;
    }

    // Keep in sync with couldStartTrivia
    while (true) {
        const ch = text.charCodeAt(pos);
        switch (ch) {
            case ts.CharacterCodes.carriageReturn:
                if (text.charCodeAt(pos + 1) === ts.CharacterCodes.lineFeed) {
                    pos++;
                }
                // falls through
            case ts.CharacterCodes.lineFeed:
                pos++;
                if (stopAfterLineBreak) {
                    return pos;
                }
                continue;
            case ts.CharacterCodes.tab:
            case ts.CharacterCodes.verticalTab:
            case ts.CharacterCodes.formFeed:
            case ts.CharacterCodes.space:
                pos++;
                continue;
            case ts.CharacterCodes.slash:
                if (stopAtComments) {
                    break;
                }
                if (text.charCodeAt(pos + 1) === ts.CharacterCodes.slash) {
                    pos += 2;
                    while (pos < text.length) {
                        if (isLineBreak(text.charCodeAt(pos))) {
                            break;
                        }
                        pos++;
                    }
                    continue;
                }
                if (text.charCodeAt(pos + 1) === ts.CharacterCodes.asterisk) {
                    pos += 2;
                    while (pos < text.length) {
                        if (text.charCodeAt(pos) === ts.CharacterCodes.asterisk && text.charCodeAt(pos + 1) === ts.CharacterCodes.slash) {
                            pos += 2;
                            break;
                        }
                        pos++;
                    }
                    continue;
                }
                break;

            case ts.CharacterCodes.lessThan:
            case ts.CharacterCodes.bar:
            case ts.CharacterCodes.equals:
            case ts.CharacterCodes.greaterThan:
                if (isConflictMarkerTrivia(text, pos)) {
                    pos = scanConflictMarkerTrivia(text, pos);
                    continue;
                }
                break;

            case ts.CharacterCodes.hash:
                if (pos === 0 && isShebangTrivia(text, pos)) {
                    pos = scanShebangTrivia(text, pos);
                    continue;
                }
                break;

            default:
                if (ch > ts.CharacterCodes.maxAsciiCharacter && (isWhiteSpaceLike(ch))) {
                    pos++;
                    continue;
                }
                break;
        }
        return pos;
    }
}

/** Does not include line breaks. For that, see isWhiteSpaceLike. */
export function isWhiteSpaceSingleLine(ch: number): boolean {
    // Note: nextLine is in the Zs space, and should be considered to be a whitespace.
    // It is explicitly not a line-break as it isn't in the exact set specified by EcmaScript.
    return ch === ts.CharacterCodes.space ||
        ch === ts.CharacterCodes.tab ||
        ch === ts.CharacterCodes.verticalTab ||
        ch === ts.CharacterCodes.formFeed ||
        ch === ts.CharacterCodes.nonBreakingSpace ||
        ch === ts.CharacterCodes.nextLine ||
        ch === ts.CharacterCodes.ogham ||
        ch >= ts.CharacterCodes.enQuad && ch <= ts.CharacterCodes.zeroWidthSpace ||
        ch === ts.CharacterCodes.narrowNoBreakSpace ||
        ch === ts.CharacterCodes.mathematicalSpace ||
        ch === ts.CharacterCodes.ideographicSpace ||
        ch === ts.CharacterCodes.byteOrderMark;
}

export function isWhiteSpaceLike(ch: number): boolean {
    return isWhiteSpaceSingleLine(ch) || isLineBreak(ch);
}

const shebangTriviaRegex = /^#!.*/;
function isShebangTrivia(text: string, pos: number) {
    // Shebangs check must only be done at the start of the file
    return shebangTriviaRegex.test(text);
}

function scanShebangTrivia(text: string, pos: number) {
    const shebang = shebangTriviaRegex.exec(text)![0];
    pos = pos + shebang.length;
    return pos;
}

function scanConflictMarkerTrivia(text: string, pos: number, error?: (diag: ts.DiagnosticMessage, pos?: number, len?: number) => void) {

    if (error) {
        pushError({
            code: 1,
            msg: 'Merge_conflict_marker_encountered' + pos + mergeConflictMarkerLength
        });
    }

    const ch = text.charCodeAt(pos);
    const len = text.length;

    if (ch === ts.CharacterCodes.lessThan || ch === ts.CharacterCodes.greaterThan) {
        while (pos < len && !isLineBreak(text.charCodeAt(pos))) {
            pos++;
        }
    }
    else {
        // Consume everything from the start of a ||||||| or ======= marker to the start
        // of the next ======= or >>>>>>> marker.
        while (pos < len) {
            const currentChar = text.charCodeAt(pos);
            if ((currentChar === ts.CharacterCodes.equals || currentChar === ts.CharacterCodes.greaterThan) && currentChar !== ch && isConflictMarkerTrivia(text, pos)) {
                break;
            }

            pos++;
        }
    }

    return pos;
}

const mergeConflictMarkerLength = "<<<<<<<".length;
function isConflictMarkerTrivia(text: string, pos: number) {

    // Conflict markers must be at the start of a line.
    if (pos === 0 || isLineBreak(text.charCodeAt(pos - 1))) {
        const ch = text.charCodeAt(pos);

        if ((pos + mergeConflictMarkerLength) < text.length) {
            for (let i = 0; i < mergeConflictMarkerLength; i++) {
                if (text.charCodeAt(pos + i) !== ch) {
                    return false;
                }
            }

            return ch === ts.CharacterCodes.equals ||
                text.charCodeAt(pos + mergeConflictMarkerLength) === ts.CharacterCodes.space;
        }
    }

    return false;
}

export function isLineBreak(ch: number): boolean {
    // ES5 7.3:
    // The ECMAScript line terminator characters are listed in Table 3.
    //     Table 3: Line Terminator Characters
    //     Code Unit Value     Name                    Formal Name
    //     \u000A              Line Feed               <LF>
    //     \u000D              Carriage Return         <CR>
    //     \u2028              Line separator          <LS>
    //     \u2029              Paragraph separator     <PS>
    // Only the characters in Table 3 are treated as line terminators. Other new line or line
    // breaking characters are treated as white space but not as line terminators.

    return ch === ts.CharacterCodes.lineFeed ||
        ch === ts.CharacterCodes.carriageReturn ||
        ch === ts.CharacterCodes.lineSeparator ||
        ch === ts.CharacterCodes.paragraphSeparator;
}

const textToKeywordObj: MapLike<ts.KeywordSyntaxKind> = {
    abstract: SyntaxKind.AbstractKeyword,
    any: SyntaxKind.AnyKeyword,
    as: SyntaxKind.AsKeyword,
    boolean: SyntaxKind.BooleanKeyword,
    break: SyntaxKind.BreakKeyword,
    case: SyntaxKind.CaseKeyword,
    catch: SyntaxKind.CatchKeyword,
    class: SyntaxKind.ClassKeyword,
    continue: SyntaxKind.ContinueKeyword,
    const: SyntaxKind.ConstKeyword,
    ["" + "constructor"]: SyntaxKind.ConstructorKeyword,
    debugger: SyntaxKind.DebuggerKeyword,
    declare: SyntaxKind.DeclareKeyword,
    default: SyntaxKind.DefaultKeyword,
    delete: SyntaxKind.DeleteKeyword,
    do: SyntaxKind.DoKeyword,
    else: SyntaxKind.ElseKeyword,
    enum: SyntaxKind.EnumKeyword,
    export: SyntaxKind.ExportKeyword,
    extends: SyntaxKind.ExtendsKeyword,
    false: SyntaxKind.FalseKeyword,
    finally: SyntaxKind.FinallyKeyword,
    for: SyntaxKind.ForKeyword,
    from: SyntaxKind.FromKeyword,
    function: SyntaxKind.FunctionKeyword,
    get: SyntaxKind.GetKeyword,
    if: SyntaxKind.IfKeyword,
    implements: SyntaxKind.ImplementsKeyword,
    import: SyntaxKind.ImportKeyword,
    in: SyntaxKind.InKeyword,
    infer: SyntaxKind.InferKeyword,
    instanceof: SyntaxKind.InstanceOfKeyword,
    interface: SyntaxKind.InterfaceKeyword,
    is: SyntaxKind.IsKeyword,
    keyof: SyntaxKind.KeyOfKeyword,
    let: SyntaxKind.LetKeyword,
    module: SyntaxKind.ModuleKeyword,
    namespace: SyntaxKind.NamespaceKeyword,
    never: SyntaxKind.NeverKeyword,
    new: SyntaxKind.NewKeyword,
    null: SyntaxKind.NullKeyword,
    number: SyntaxKind.NumberKeyword,
    object: SyntaxKind.ObjectKeyword,
    package: SyntaxKind.PackageKeyword,
    private: SyntaxKind.PrivateKeyword,
    protected: SyntaxKind.ProtectedKeyword,
    public: SyntaxKind.PublicKeyword,
    readonly: SyntaxKind.ReadonlyKeyword,
    require: SyntaxKind.RequireKeyword,
    global: SyntaxKind.GlobalKeyword,
    return: SyntaxKind.ReturnKeyword,
    set: SyntaxKind.SetKeyword,
    static: SyntaxKind.StaticKeyword,
    string: SyntaxKind.StringKeyword,
    super: SyntaxKind.SuperKeyword,
    switch: SyntaxKind.SwitchKeyword,
    symbol: SyntaxKind.SymbolKeyword,
    this: SyntaxKind.ThisKeyword,
    throw: SyntaxKind.ThrowKeyword,
    true: SyntaxKind.TrueKeyword,
    try: SyntaxKind.TryKeyword,
    type: SyntaxKind.TypeKeyword,
    typeof: SyntaxKind.TypeOfKeyword,
    undefined: SyntaxKind.UndefinedKeyword,
    unique: SyntaxKind.UniqueKeyword,
    unknown: SyntaxKind.UnknownKeyword,
    var: SyntaxKind.VarKeyword,
    void: SyntaxKind.VoidKeyword,
    while: SyntaxKind.WhileKeyword,
    with: SyntaxKind.WithKeyword,
    yield: SyntaxKind.YieldKeyword,
    async: SyntaxKind.AsyncKeyword,
    await: SyntaxKind.AwaitKeyword,
    of: SyntaxKind.OfKeyword,
};

const textToToken = createMapFromTemplate<SyntaxKind>({
    ...textToKeywordObj,
    "{": SyntaxKind.OpenBraceToken,
    "}": SyntaxKind.CloseBraceToken,
    "(": SyntaxKind.OpenParenToken,
    ")": SyntaxKind.CloseParenToken,
    "[": SyntaxKind.OpenBracketToken,
    "]": SyntaxKind.CloseBracketToken,
    ".": SyntaxKind.DotToken,
    "...": SyntaxKind.DotDotDotToken,
    ";": SyntaxKind.SemicolonToken,
    ",": SyntaxKind.CommaToken,
    "<": SyntaxKind.LessThanToken,
    ">": SyntaxKind.GreaterThanToken,
    "<=": SyntaxKind.LessThanEqualsToken,
    ">=": SyntaxKind.GreaterThanEqualsToken,
    "==": SyntaxKind.EqualsEqualsToken,
    "!=": SyntaxKind.ExclamationEqualsToken,
    "===": SyntaxKind.EqualsEqualsEqualsToken,
    "!==": SyntaxKind.ExclamationEqualsEqualsToken,
    "=>": SyntaxKind.EqualsGreaterThanToken,
    "+": SyntaxKind.PlusToken,
    "-": SyntaxKind.MinusToken,
    "**": SyntaxKind.AsteriskAsteriskToken,
    "*": SyntaxKind.AsteriskToken,
    "/": SyntaxKind.SlashToken,
    "%": SyntaxKind.PercentToken,
    "++": SyntaxKind.PlusPlusToken,
    "--": SyntaxKind.MinusMinusToken,
    "<<": SyntaxKind.LessThanLessThanToken,
    "</": SyntaxKind.LessThanSlashToken,
    ">>": SyntaxKind.GreaterThanGreaterThanToken,
    ">>>": SyntaxKind.GreaterThanGreaterThanGreaterThanToken,
    "&": SyntaxKind.AmpersandToken,
    "|": SyntaxKind.BarToken,
    "^": SyntaxKind.CaretToken,
    "!": SyntaxKind.ExclamationToken,
    "~": SyntaxKind.TildeToken,
    "&&": SyntaxKind.AmpersandAmpersandToken,
    "||": SyntaxKind.BarBarToken,
    "?": SyntaxKind.QuestionToken,
    ":": SyntaxKind.ColonToken,
    "=": SyntaxKind.EqualsToken,
    "+=": SyntaxKind.PlusEqualsToken,
    "-=": SyntaxKind.MinusEqualsToken,
    "*=": SyntaxKind.AsteriskEqualsToken,
    "**=": SyntaxKind.AsteriskAsteriskEqualsToken,
    "/=": SyntaxKind.SlashEqualsToken,
    "%=": SyntaxKind.PercentEqualsToken,
    "<<=": SyntaxKind.LessThanLessThanEqualsToken,
    ">>=": SyntaxKind.GreaterThanGreaterThanEqualsToken,
    ">>>=": SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken,
    "&=": SyntaxKind.AmpersandEqualsToken,
    "|=": SyntaxKind.BarEqualsToken,
    "^=": SyntaxKind.CaretEqualsToken,
    "@": SyntaxKind.AtToken,
});

function makeReverseMap(source: Map<number>): string[] {
    const result: string[] = [];
    source.forEach((value, name) => {
        result[value] = name;
    });
    return result;
}

const tokenStrings = makeReverseMap(textToToken);

export function tokenToString(t: SyntaxKind): string | undefined {
    return tokenStrings[t];
}

export function computeLineAndCharacterOfPosition(lineStarts: ReadonlyArray<number>, position: number): ts.LineAndCharacter {
    let lineNumber = binarySearch(lineStarts, position, identity, compareValues);
    if (lineNumber < 0) {
        // If the actual position was not found,
        // the binary search returns the 2's-complement of the next line start
        // e.g. if the line starts at [5, 10, 23, 80] and the position requested was 20
        // then the search will return -2.
        //
        // We want the index of the previous line start, so we subtract 1.
        // Review 2's-complement if this is confusing.
        lineNumber = ~lineNumber - 1;
        if (lineNumber === -1) {
            pushError({
                code: 1,
                msg: "position cannot precede the beginning of the file"
            });
        }
    }
    return {
        line: lineNumber,
        character: position - lineStarts[lineNumber]
    };
}

export function getLineAndCharacterOfPosition(sourceFile: ts.SourceFileLike, position: number): ts.LineAndCharacter {
    return computeLineAndCharacterOfPosition(getLineStarts(sourceFile), position);
}

export function getLineStarts(sourceFile: ts.SourceFileLike): ReadonlyArray<number> {
    return sourceFile.lineMap || (sourceFile.lineMap = computeLineStarts(sourceFile.text));
}