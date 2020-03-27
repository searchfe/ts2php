/**
 * @file Object
 * @author cxtom(cxtom2008@gmail.com)
 */

import * as ts from 'byots';
import {createDiagnostic, getUnSupportedMessage} from '../utilities/error';

const supportedMethods = new Set([
    'getDate', 'getDay', 'getFullYear', 'getHours',
    'getMinutes', 'getMonth', 'getSeconds', 'getTime',
    'setDate', 'setFullYear', 'setHours', 'setMinutes',
    'setMonth', 'setSeconds', 'setTime'
]);

function isDateInstance(node, typeChecker) {
    const nodeType = typeChecker.getTypeAtLocation(node);
    const nodeSymbol = nodeType.symbol;
    return nodeSymbol && nodeSymbol.getEscapedName() === 'Date';
}

function isDateObject(node, typeChecker) {
    const nodeType = typeChecker.getTypeAtLocation(node);
    const symbol = nodeType.getSymbol();
    return symbol && symbol.getEscapedName() === 'DateConstructor';
}


export default {

    emit(hint, node, {helpers, typeChecker, sourceFile, helperNamespace, errors}) {

        if (ts.isIdentifier(node) && node.getText(sourceFile) === 'Date' && isDateObject(node, typeChecker)) {
            return helpers.writePunctuation(helperNamespace + 'Ts2Php_Date');
        }

        let expNode = node.expression;

        if (ts.isCallExpression(node) && isDateInstance(expNode.expression, typeChecker)) {
            const name = helpers.getTextOfNode(expNode.name);
            if (!supportedMethods.has(name)) {
                errors.push(createDiagnostic(node, sourceFile, getUnSupportedMessage(`Date.prototype.${name}`)));
            }
        }

        return false;
    }
};
