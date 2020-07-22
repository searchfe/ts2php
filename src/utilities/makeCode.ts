import { ModuleInfo } from '../../types/index';

export function getRequireOnceCode(moduleName: string, modulePath = '', moduleIt?: ModuleInfo) {
    moduleName = moduleName.replace(/\.js$/, '').replace(/\.ts$/, '');
    modulePath = modulePath.replace(/\.js$/, '').replace(/\.ts$/, '');

    let p = '';
    if (moduleIt.path) {
        p = JSON.stringify(moduleIt.path + modulePath + '.php');
    }
    else if (moduleIt.pathCode) {
        p = moduleIt.pathCode;
    }
    else {
        p = JSON.stringify(moduleName + modulePath + '.php');
    }

    return `require_once(${p})`;
}
