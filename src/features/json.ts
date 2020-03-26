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

import {
    createDiagnostic
} from '../utilities/error';

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

    emit(hint, node, state) {

        const expNode = node.expression;
        let func;

        const {helpers} = state

        if (
            hint === EmitHint.Expression
            && isCallExpression(node)
            && isPropertyAccessExpression(expNode)
            && isIdentifier(expNode.expression)
            && expNode.expression.escapedText === 'JSON'
            && (func = methods[helpers.getTextOfNode(expNode.name)])
        ) {
            if (node.arguments.length <= 1) {
                return func(node, helpers);
            }
            state.errors.push(createDiagnostic(
                node, state.sourceFile,
                `JSON.${helpers.getTextOfNode(expNode.name)} only support 1 argument.`
            ));
            return;
        }

        return false;
    }
};
