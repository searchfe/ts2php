/**
 * @file json
 * @author cxtom(cxtom2008@gmail.com)
 */

import {
    EmitHint,
    isPropertyAccessExpression,
    isIdentifier,
    isCallExpression,
    CallExpression
} from 'typescript';

import method from '../utilities/method';

const methods = {
    log: method('var_dump', false),
    info: method('var_dump', false),
    error: method('echo', false),
    dir(node: CallExpression, {emitExpression, writePunctuation}) {
        writePunctuation('echo "<script>console.log(" . json_encode(');
        emitExpression(node.arguments[0]);
        writePunctuation(') . ");</script>"');
    }
};

export default {

    emit(hint, node, {helpers}) {

        const expNode = node.expression;
        let func;

        if (
            hint === EmitHint.Expression
            && isCallExpression(node)
            && isPropertyAccessExpression(expNode)
            && isIdentifier(expNode.expression)
            && expNode.expression.escapedText === 'console'
            && (func = methods[helpers.getTextOfNode(expNode.name)])
        ) {
            return func(node, helpers);
        }

        return false;
    }
};
