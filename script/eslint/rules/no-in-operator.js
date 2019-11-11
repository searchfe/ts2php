"use strict";
const utils_1 = require("./utils");
module.exports = utils_1.createRule({
    name: "no-in-operator",
    meta: {
        docs: {
            description: ``,
            category: "Best Practices",
            recommended: "error",
        },
        messages: {
            noInOperatorError: `Don't use the 'in' keyword - use 'hasProperty' to check for key presence instead`,
        },
        schema: [],
        type: "suggestion",
    },
    defaultOptions: [],
    create(context) {
        const IN_OPERATOR = "in";
        const checkInOperator = (node) => {
            if (node.operator === IN_OPERATOR) {
                context.report({ messageId: "noInOperatorError", node });
            }
        };
        return {
            BinaryExpression: checkInOperator,
        };
    },
});
