# Feature plugins

## Why

Some JavaScript API can't compile to PHP directly. We use feature plugins to process these APIs.

## How

These processes are included:

- Changing function name.
- Rearrange arguments order.

Every file export a object with a `emit` method.

```ts
export default {

    emit(hint, node, {helpers, helperNamespace}) {

        const expNode = node.expression;
        let func;

        if (
            hint === EmitHint.Expression
            && isCallExpression(node)
            && isPropertyAccessExpression(expNode)
            && isIdentifier(expNode.expression)
            && expNode.expression.escapedText === 'Math'
            && (func = map[helpers.getTextOfNode(expNode.name)])
        ) {
            return func(node, helpers, {helperNamespace});
        }

        return false;
    }
};
```

And then merged together in `index.ts`:

```ts
export default [
    StringPligin,
    MathPlugin,
    ObjectPlugin,
    JSONPlugin,
    GlobalPlugin,
    NumberPlugin,
    ArrayPlugin,
    ConsolePlugin,
    DatePlugin,
    ErrorPlugin
];
```

These plugins will be called at the start of every emit process.

## special cases

### call_user_func_array

If spread element is used as argument of call expression, e.g. `someFunc(...arr);`. It will be transformed to `call_user_func_array`: 

```php
call_user_func_array('someFunc', $arr);
```

In these case, plugins must process `call_user_func_array`, or at least report an error.

There are two ways to process `call_user_func_array`:

1. Process in `callUserFuncArray.ts`. (Recommended if just changing function's name)
2. Process in other plugins.
