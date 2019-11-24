"use strict";
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const utils_1 = require("./utils");
module.exports = utils_1.createRule({
    name: "type-operator-spacing",
    meta: {
        docs: {
            description: ``,
            category: "Stylistic Issues",
            recommended: "error",
        },
        messages: {
            typeOperatorSpacingError: `The '|' and '&' operators must be surrounded by spaces`,
        },
        schema: [],
        type: "suggestion",
    },
    defaultOptions: [],
    create(context) {
        const sourceCode = context.getSourceCode();
        const tokens = ["|", "&"];
        const text = sourceCode.getText();
        const checkTypeOperatorSpacing = (node) => {
            node.types.forEach(node => {
                const token = sourceCode.getTokenBefore(node);
                if (!!token && token.type === experimental_utils_1.AST_TOKEN_TYPES.Punctuator && tokens.indexOf(token.value) >= 0) {
                    const [start, end] = token.range;
                    if (/\S/.test(text[start - 1]) || /\S/.test(text[end])) {
                        context.report({ messageId: "typeOperatorSpacingError", node: token });
                    }
                }
            });
        };
        return {
            TSIntersectionType: checkTypeOperatorSpacing,
            TSUnionType: checkTypeOperatorSpacing,
        };
    },
});
