const {FlatCompat} = require('@eslint/eslintrc');

const compat = new FlatCompat({
    baseDirectory: __dirname
});

module.exports = compat.config(require('./.eslintrc.json')).map(config => ({
    ...config,
    files: ['src/**/*.ts']
}));
