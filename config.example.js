module.exports = {
    showDiagnostics: true,
    emitHeader: true,
    getModulePath: name => name,
    getModuleNamespace: () => '\\',
    modules: {},
    customTransformers: []
};
