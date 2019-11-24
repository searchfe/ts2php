"use strict";
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const utils_1 = require("./utils");
module.exports = utils_1.createRule({
    name: "debug-assert",
    meta: {
        docs: {
            description: ``,
            category: "Possible Errors",
            recommended: "error",
        },
        messages: {
            secondArgumentDebugAssertError: `Second argument to 'Debug.assert' should be a string literal`,
            thirdArgumentDebugAssertError: `Third argument to 'Debug.assert' should be a string literal or arrow function`,
        },
        schema: [],
        type: "problem",
    },
    defaultOptions: [],
    create(context) {
        const isArrowFunction = (node) => node.type === experimental_utils_1.AST_NODE_TYPES.ArrowFunctionExpression;
        const isStringLiteral = (node) => ((node.type === experimental_utils_1.AST_NODE_TYPES.Literal && typeof node.value === "string") || node.type === experimental_utils_1.AST_NODE_TYPES.TemplateLiteral);
        const isDebugAssert = (node) => (node.object.type === experimental_utils_1.AST_NODE_TYPES.Identifier
            && node.object.name === "Debug"
            && node.property.type === experimental_utils_1.AST_NODE_TYPES.Identifier
            && node.property.name === "assert");
        const checkDebugAssert = (node) => {
            const args = node.arguments;
            const argsLen = args.length;
            if (!(node.callee.type === experimental_utils_1.AST_NODE_TYPES.MemberExpression && isDebugAssert(node.callee)) || argsLen < 2) {
                return;
            }
            const message1Node = args[1];
            if (message1Node && !isStringLiteral(message1Node)) {
                context.report({ messageId: "secondArgumentDebugAssertError", node: message1Node });
            }
            if (argsLen < 3) {
                return;
            }
            const message2Node = args[2];
            if (message2Node && (!isStringLiteral(message2Node) && !isArrowFunction(message2Node))) {
                context.report({ messageId: "thirdArgumentDebugAssertError", node: message2Node });
            }
        };
        return {
            CallExpression: checkDebugAssert,
        };
    },
});
