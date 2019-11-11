// Simple node tests of the form `node.kind === SyntaxKind.Foo`.

import {
    Node,
    SyntaxKind
} from 'typescript';
import * as ts from 'typescript';
import {CompilerState} from '../types';

const shouldAddDollerParentList = new Set([
    SyntaxKind.VariableDeclaration,
    SyntaxKind.TemplateSpan,
    SyntaxKind.ElementAccessExpression,
    SyntaxKind.Parameter,
    SyntaxKind.BinaryExpression,
    SyntaxKind.IfStatement,
    SyntaxKind.PrefixUnaryExpression,
    SyntaxKind.PostfixUnaryExpression,
    SyntaxKind.SwitchStatement,
    SyntaxKind.ArrayLiteralExpression,
    SyntaxKind.ReturnStatement,
    SyntaxKind.ReturnStatement,
    SyntaxKind.ForInStatement,
    SyntaxKind.ForOfStatement,
    SyntaxKind.TypeOfExpression,
    SyntaxKind.ConditionalExpression,
    SyntaxKind.ComputedPropertyName,
    SyntaxKind.ImportSpecifier,
    SyntaxKind.PropertyDeclaration,
    SyntaxKind.EnumDeclaration,
    SyntaxKind.ArrowFunction,
    SyntaxKind.BindingElement,
    SyntaxKind.WhileStatement,
    SyntaxKind.AsExpression,
    SyntaxKind.SpreadAssignment,
    SyntaxKind.SpreadElement
]);

/**
 * 判断输出 Identier 时，是否需要加 $ 符号
 * @param node 节点
 */
export function shouldAddDollar(node: Node, state: CompilerState): boolean {

    if (isClassLike(node, state.typeChecker)) {
        return false;
    }

    if (isFunctionLike(node, state.typeChecker) && !isVariable(node, state.typeChecker)) {
        return false;
    }

    // 可以直接通过父元素判断
    if (node.parent && shouldAddDollerParentList.has(node.parent.kind)) {
        return true;
    }

    const currentNode = node as ts.Expression;

    // 函数参数
    if (
        node.parent
        && (ts.isCallExpression(node.parent) || ts.isNewExpression(node.parent))
        && node.parent.arguments.indexOf(currentNode) >= 0
    ) {
        return true;
    }

    if (node.parent && ts.isPropertyAssignment(node.parent) && node.parent.initializer === node) {
        return true;
    }

    // PropertyAccessExpression
    if (
        node.parent
        && ts.isPropertyAccessExpression(node.parent)
        && node.parent.expression === node
    ) {
        return true;
    }

    return false;
}

export function shouldAddDoubleQuote(node: Node): boolean {

    if (
        node.parent
        && (
            node.parent.kind === ts.SyntaxKind.PropertyAssignment
            || node.parent.kind === ts.SyntaxKind.EnumMember
        )
        && (<ts.PropertyAssignment>node.parent).name === node
    ) {
        return true;
    }

    return false;
}


const baseArrayBrackets = ["array(", ")"];
const newLineArrayBrackets = ["array(", ")"];
const arrayBracketsMap = {
    [ts.ListFormat.ObjectLiteralExpressionProperties]: baseArrayBrackets,
    [ts.ListFormat.ObjectLiteralExpressionProperties | ts.ListFormat.PreferNewLine]: newLineArrayBrackets,
    [ts.ListFormat.ArrayLiteralExpressionElements]: baseArrayBrackets,
    [ts.ListFormat.ArrayLiteralExpressionElements | ts.ListFormat.PreferNewLine]: newLineArrayBrackets
};
/**
 * 判断是否需要转换成 array()
 * @param format list format
 */
export function shouldUseArray(format: ts.ListFormat) {
    return arrayBracketsMap[format] || '';
}

/**
 * e.g. let a = []; let b = a;  ==>  $a = array(); $b = &$a;
 * @param node node
 */
export function shouldUseReference(node: ts.Node, typeChecker: ts.TypeChecker) {
    const nodeType = typeChecker.getTypeAtLocation(node);
    return ts.isIdentifier(node) && !isFunctionLike(node, typeChecker) && (nodeType.flags === ts.TypeFlags.Object);
}

const stringLikeType = new Set([
    ts.TypeFlags.String,
    ts.TypeFlags.StringLiteral
]);

/**
 * 判断是否是 string，用于将 + 改写成 .
 * @param node node
 */
export function isStringLike(node: ts.Node, typeChecker: ts.TypeChecker) {
    if (!node) {
        return false;
    }
    const nodeType = typeChecker.getTypeAtLocation(node);
    return stringLikeType.has(nodeType.getFlags());
}

const numberLikeType = new Set([
    ts.TypeFlags.Number,
    ts.TypeFlags.NumberLiteral
]);

/**
 * 判断是否是 number
 * @param node node
 */
export function isNumberLike(node: ts.Node, typeChecker: ts.TypeChecker) {
    const nodeType = typeChecker.getTypeAtLocation(node);
    return numberLikeType.has(nodeType.getFlags());
}

export function isClassLike(node: ts.Node, typeChecker: ts.TypeChecker) {
    const nodeType = typeChecker.getTypeAtLocation(node);
    const nodeSymbol = typeChecker.getSymbolAtLocation(node);
    if (!nodeSymbol) {
        return false;
    }
    if (ts.SymbolFlags.Class & nodeSymbol.getFlags()) {
        return true;
    }
    if (!nodeType.symbol) {
        return false;
    }
    return (ts.isImportSpecifier(node.parent) && (ts.SymbolFlags.Class & nodeType.symbol.getFlags()))
        || (nodeType.objectFlags & ts.ObjectFlags.Interface) && nodeType.symbol.members.has('prototype' as ts.__String)
        || (!nodeSymbol.valueDeclaration && (ts.SymbolFlags.Class & nodeType.symbol.getFlags()) && nodeType.symbol.exports.has('prototype' as ts.__String));
}

export function isClassInstance(node: ts.Node, typeChecker: ts.TypeChecker) {
    const nodeType = typeChecker.getTypeAtLocation(node);
    const nodeSymbol = typeChecker.getSymbolAtLocation(node);

    const baseTypeName = getBaseTypeName(nodeType)
    if (baseTypeName === 'PHPClass') return true
    if (baseTypeName === 'PHPArray') return false

    if (!nodeSymbol) {
        return false;
    }
    return (nodeType.isClass() && !(nodeSymbol.getFlags() & ts.SymbolFlags.Class))
        || (nodeType.objectFlags & ts.ObjectFlags.Interface) && nodeType.symbol.getEscapedName() === 'Date';
}

// 通过最近的父类来确定是用对象（->）还是数组（[]）
// 优化：遍历父类有的方法来确定用哪个父类
function getBaseTypeName(nodeType: ts.Type): 'PHPClass' | 'PHPArray' | 'other' {
    const queue = [nodeType]

    while(queue.length) {
        const nodeType = queue.shift()
        const baseTypes = nodeType.getBaseTypes()
        if (!baseTypes) continue

        for (const baseType of baseTypes) {
            const baseSymbol = baseType.getSymbol()
            if (!baseSymbol) continue

            const name = baseSymbol.getName()
            if (name === 'PHPClass' || name === 'PHPArray') return name
            else queue.push(baseType)
        }
    }
    return 'other'
}

export function isFunctionLike(node: ts.Node, typeChecker: ts.TypeChecker) {
    const nodeType = typeChecker.getTypeAtLocation(node);
    const nodeSymbol = nodeType.getSymbol();
    return !!nodeSymbol && nodeSymbol.getFlags() === ts.SymbolFlags.Function;
}

/**
 * used for:
 * variable whos value is function-like but not function declaration
 */
export function isVariable(node: ts.Node, typeChecker: ts.TypeChecker) {
    const nodeType = typeChecker.getTypeAtLocation(node);
    const nodeSymbol = nodeType.getSymbol();
    return nodeSymbol.declarations[0].parent.kind === ts.SyntaxKind.VariableDeclaration;
}

export function isVisibilityModifier(node: ts.Modifier) {
    return node.kind === SyntaxKind.PublicKeyword
        || node.kind === SyntaxKind.PrivateKeyword
        || node.kind === SyntaxKind.ProtectedKeyword;
}

export function isSupportedPropertyModifier(node: ts.Modifier) {
    return isVisibilityModifier(node) || node.kind === SyntaxKind.StaticKeyword;
}
