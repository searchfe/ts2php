/**
 * @file 全局方法
 * @author cxtom(cxtom2008@gmail.com)
 */

import {
    EmitHint,
    isCallExpression,
    isPropertyAccessExpression,
    isIdentifier,
    isBinaryExpression,
    SyntaxKind,
    createCall,
    createIdentifier,
    updateCall,
    FunctionExpression,
    isFunctionExpression,
    isStringLiteral
} from 'typescript';

import method from '../utilities/method';
import { getLiteralText } from '../utilities';

const map = {
    parseInt: method('intval', false, 1),
    parseFloat: method('floatval', false, 1),
    encodeURIComponent: method('rawurlencode', false, 1),
    decodeURIComponent: method('rawurldecode', false, 1),
    isNaN: method('is_nan', false, 1),
    encodeURI: method('%helper::encodeURI', false, 1),
};

const identifierMap = new Map([
    ['___dirname', 'dirname(__FILE__)'],
    ['___filename', '__FILE__']
]);

const isDynamicImport = node => isCallExpression(node) && node.expression.kind === SyntaxKind.ImportKeyword;

export default {

    emit(hint, node, {helpers, modules, sourceFile, helperNamespace}) {

        const expNode = node.expression;
        let func;

        if (
            hint === EmitHint.Expression
            && isCallExpression(node)
            && (func = map[expNode.escapedText])
        ) {
            return func(node, helpers, {helperNamespace});
        }

        if (
            isPropertyAccessExpression(node)
            && isIdentifier(node.expression)
            && node.expression.escapedText === 'navigator'
        ) {
            if (
                helpers.getTextOfNode(node.name) === 'userAgent'
            ) {
                return helpers.writePunctuation('$_SERVER["HTTP_USER_AGENT"]');
            }
        }

        if (isIdentifier(node)) {
            const text = node.escapedText as string;
            if (identifierMap.has(text)) {
                return helpers.writePunctuation(identifierMap.get(text));
            }
        }

        if (
            isBinaryExpression(node)
            && node.operatorToken.kind === SyntaxKind.EqualsEqualsEqualsToken
            && node.right.originalKeywordKind === SyntaxKind.UndefinedKeyword
        ) {
            helpers.writePunctuation('!');
            return helpers.emitExpression(createCall(createIdentifier('isset'), [], [node.left]));
        }

        if (
            isBinaryExpression(node)
            && node.operatorToken.kind === SyntaxKind.ExclamationEqualsEqualsToken
            && node.right.originalKeywordKind === SyntaxKind.UndefinedKeyword
        ) {
            return helpers.emitExpression(createCall(createIdentifier('isset'), [], [node.left]));
        }

        if (isDynamicImport(node)) {
            const argu = node.arguments[0];
            if (isStringLiteral(argu)) {
                const moduleName = argu.text;
                const moduleIt = modules[moduleName];
                return helpers.writeBase(`require_once(${moduleIt.path || moduleIt.pathCode || JSON.stringify(moduleName)})`);
            }
            helpers.writeBase(`require_once(dirname(__FILE__) . '/' . (`);
            helpers.emitExpression(argu);
            return helpers.writeBase(') . \'.php\')');
        }

        if (
            isCallExpression(node)
            && isPropertyAccessExpression(expNode)
            && isDynamicImport(expNode.expression)
            && isIdentifier(expNode.name)
            && expNode.name.escapedText === 'then'
            && isFunctionExpression(node.arguments[0])
        ) {
            helpers.emitExpression(expNode.expression);
            helpers.writeBase(';\n');
            const func = node.arguments[0] as FunctionExpression;
            func.body.forEachChild(statement => helpers.emit(statement));
            return;
        }

        return false;
    }
};
