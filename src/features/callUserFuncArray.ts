import * as ts from 'byots';
import { CompilerState } from '../types';
import {map as MATH_MAP} from './math';
import {formatMethodName} from '../utilities/method';

export default {
    emit(hint: ts.EmitHint, node: ts.Node, {helpers, helperNamespace, errors, sourceFile}: CompilerState) {
        if (
            ts.isCallExpression(node)
            && ts.isIdentifier(node.expression)
            && node.expression.escapedText === 'call_user_func_array'
        ) {
            const args = node.arguments;
            const res = getNameAndMethod(args[0] as ts.StringLiteral);

            if (res && res.method) {
                let method = res.method;
                const name = res.name;
                if (name === 'Math') {
                    method = MATH_MAP[method];
                }

                if (method) {
                    // if you need change the order of arguments,
                    // implement it in other plugins
                    method = formatMethodName(method, helperNamespace);
                    helpers.writePunctuation('call_user_func_array');
                    (args[0] as ts.StringLiteral).text = method;
                    helpers.emitExpressionList(node, node.arguments, ts.ListFormat.CallExpressionArguments);
                    return true;
                }

                errors.push(ts.createDiagnosticForNodeInSourceFile(sourceFile, node, {
                    category: ts.DiagnosticCategory.Error,
                    message: `Spread expression in ${res.name}.${res.method} is not supported yet!`,
                    code: 5555,
                    key: 'ts2php'
                }));
            }
        }

        return false;
    }
};

function getNameAndMethod(node: ts.StringLiteral) {
    if (!node.text) {
        return;
    }
    const funcName = node.text;
    let [name, method] = funcName.split('.');
    if (!method) {
        [,name = undefined, method = undefined] = funcName.match(/(.*)\[['"](.*)['"]\]/) || [];
    }
    return {
        name,
        method
    };
}