"use strict";
const utils_1 = require("./utils");
module.exports = utils_1.createRule({
    name: "no-type-assertion-whitespace",
    meta: {
        docs: {
            description: ``,
            category: "Stylistic Issues",
            recommended: "error",
        },
        messages: {
            noTypeAssertionWhitespace: `Excess trailing whitespace found around type assertion`,
        },
        schema: [],
        type: "problem",
    },
    defaultOptions: [],
    create(context) {
        const sourceCode = context.getSourceCode();
        const checkTypeAssertionWhitespace = (node) => {
            const leftToken = sourceCode.getLastToken(node.typeAnnotation);
            const rightToken = sourceCode.getFirstToken(node.expression);
            if (!leftToken || !rightToken) {
                return;
            }
            if (sourceCode.isSpaceBetweenTokens(leftToken, rightToken)) {
                context.report({
                    messageId: "noTypeAssertionWhitespace",
                    node,
                    loc: { column: leftToken.loc.end.column + 1, line: leftToken.loc.end.line },
                });
            }
        };
        return {
            TSTypeAssertion: checkTypeAssertionWhitespace,
        };
    },
});
