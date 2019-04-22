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

function log(node: CallExpression, {emitExpression, writePunctuation, writeSpace}) {
    writePunctuation('echo');
    writeSpace();
    node.arguments.forEach((elememt, index) => {
        emitExpression(elememt);
        if (index < node.arguments.length - 1) {
            writePunctuation(',');
            writeSpace();
        }
    });
}

const methods = {
    log,
    info: method('var_dump', false),
    error: log,
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
