/**
 * @file 引入模块的特殊逻辑
 * @author cxtom(cxtom2008@gmail.com)
 */

import * as ts from 'typescript';

import {
    EmitHint,
    isCallExpression,
    isPropertyAccessExpression,
    isIdentifier,
    ListFormat
} from 'typescript';

export default {

    emit(hint, node, {moduleDefaultImports, helpers}) {

        const expNode = node.expression;
        const {
            writePunctuation,
            emitExpressionList,
            getTextOfNode
        } = helpers;

        let info;

        // console.log(moduleDefaultImports);

        if (
            hint === EmitHint.Expression
            && isCallExpression(node)
            && isPropertyAccessExpression(expNode)
            && isIdentifier(expNode.expression)
            && (info = moduleDefaultImports[expNode.expression.escapedText as string])
        ) {
            writePunctuation(info.className);
            writePunctuation('::');
            writePunctuation(getTextOfNode(expNode.name));
            emitExpressionList(node, node.arguments, ListFormat.CallExpressionArguments);
            return;
        }

        return false;
    }
};
