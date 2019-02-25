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
    SyntaxKind.ComputedPropertyName
]);

/**
 * 判断输出 Identier 时，是否需要加 $ 符号
 * @param node 节点
 */
export function shouldAddDollar(node: Node, state: CompilerState): boolean {

    // 可以直接通过父元素判断
    if (node.parent && shouldAddDollerParentList.has(node.parent.kind)) {
        return true;
    }

    const currentNode = node as ts.Expression;

    // 函数参数
    if (
        node.parent
        && ts.isCallExpression(node.parent)
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
        && node.parent.kind === ts.SyntaxKind.PropertyAssignment
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
    [ts.ListFormat.ArrayLiteralExpressionElements]: baseArrayBrackets
};
/**
 * 判断是否需要转换成 array()
 * @param format list format
 */
export function shouldUseArray(format: ts.ListFormat) {
    return arrayBracketsMap[format] || '';
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

