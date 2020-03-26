/**
 * @file json
 * @author cxtom(cxtom2008@gmail.com)
 */

import {
    EmitHint,
    CallExpression,
    createLiteral,
    createNodeArray,
    ListFormat,
    isPropertyAccessExpression,
    isIdentifier,
    isCallExpression
} from 'byots';

const methods = {
    stringify(node: CallExpression, {emitExpressionList, writePunctuation}) {
        writePunctuation('json_encode');
        const args = createNodeArray([
            node.arguments[0],
            // JSON_UNESCAPED_UNICODE
            createLiteral(256)
        ]);
        emitExpressionList(node, args, ListFormat.CallExpressionArguments);
    },
    parse(node: CallExpression, {emitExpressionList, writePunctuation}) {
        writePunctuation('json_decode');
        const args = createNodeArray([
            node.arguments[0],
            createLiteral(true)
        ]);
        emitExpressionList(node, args, ListFormat.CallExpressionArguments);
    }
};

export default {

    emit(hint, node, {helpers, helperNamespace}) {

        const expNode = node.expression;
        let func;

        if (
            hint === EmitHint.Expression
            && isCallExpression(node)
            && isPropertyAccessExpression(expNode)
            && isIdentifier(expNode.expression)
            && expNode.expression.escapedText === 'JSON'
            && (func = methods[helpers.getTextOfNode(expNode.name)])
        ) {
            return func(node, helpers, {helperNamespace});
        }

        return false;
    }
};
