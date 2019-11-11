"use strict";
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const utils_1 = require("./utils");
module.exports = utils_1.createRule({
    name: "only-arrow-functions",
    meta: {
        docs: {
            description: `Disallows traditional (non-arrow) function expressions.`,
            category: "Best Practices",
            recommended: "error",
        },
        messages: {
            onlyArrowFunctionsError: "non-arrow functions are forbidden",
        },
        schema: [{
                additionalProperties: false,
                properties: {
                    allowNamedFunctions: { type: "boolean" },
                    allowDeclarations: { type: "boolean" },
                },
                type: "object",
            }],
        type: "suggestion",
    },
    defaultOptions: [{
            allowNamedFunctions: false,
            allowDeclarations: false,
        }],
    create(context, [{ allowNamedFunctions, allowDeclarations }]) {
        const isThisParameter = (node) => (node.params.length && !!node.params.find(param => param.type === experimental_utils_1.AST_NODE_TYPES.Identifier && param.name === "this"));
        const isMethodType = (node) => {
            const types = [
                experimental_utils_1.AST_NODE_TYPES.MethodDefinition,
                experimental_utils_1.AST_NODE_TYPES.Property,
            ];
            const parent = node.parent;
            if (!parent) {
                return false;
            }
            return node.type === experimental_utils_1.AST_NODE_TYPES.FunctionExpression && types.includes(parent.type);
        };
        const stack = [];
        const enterFunction = () => {
            stack.push(false);
        };
        const markThisUsed = () => {
            if (stack.length) {
                stack[stack.length - 1] = true;
            }
        };
        const exitFunction = (node) => {
            const methodUsesThis = stack.pop();
            if (node.type === experimental_utils_1.AST_NODE_TYPES.FunctionDeclaration && allowDeclarations) {
                return;
            }
            if ((allowNamedFunctions && node.id !== null) || isMethodType(node)) { // eslint-disable-line no-null/no-null
                return;
            }
            if (!(node.generator || methodUsesThis || isThisParameter(node))) {
                context.report({ messageId: "onlyArrowFunctionsError", node });
            }
        };
        return {
            "FunctionDeclaration": enterFunction,
            "FunctionDeclaration:exit": exitFunction,
            "FunctionExpression": enterFunction,
            "FunctionExpression:exit": exitFunction,
            "ThisExpression": markThisUsed,
        };
    },
});
