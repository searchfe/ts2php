import type { ModuleInfo } from '../../types/index';

export function isRelativePath(path: string) {
    return /^\./.test(path);
}

export function hasRequired(moduleIt: ModuleInfo, moduleName: string, modulePath: string) {
    if (!moduleIt.required) {
        return false;
    }

    return moduleIt.required === true || moduleIt.required[moduleName + modulePath];
}

export function markRequired(moduleIt: ModuleInfo, moduleName: string, modulePath: string) {
    if (!moduleIt.required) {
        moduleIt.required = {};
    }
    moduleIt.required[moduleName + modulePath] = true;
}