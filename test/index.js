/**
 * @file 单元测试
 * @author meixuguang
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {ts2php} = require('../dist/index.js');

const files = fs.readdirSync(path.resolve(__dirname, './features'));
const featureNames = files.reduce((res, file) => {
    const m = file.match(/(.+)\.ts/);
    if (m) {
        res.push(m[1]);
    }
    return res;
}, []);

function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, {encoding: 'utf-8'}, (err, data) => {
            resolve(data);
        });
    });
}



describe('features', () => {
    for (let i = 0; i < featureNames.length; i++) {
        const featureName = featureNames[i];
        it(featureName, async () => {
            const phpContent = await readFile(path.resolve(__dirname, `./features/${featureName}.php`));
            const tsPath = path.resolve(__dirname, `./features/${featureName}.ts`);
            const res = ts2php(tsPath, {
                modules: {
                    '@baidu/atom-wise-utils': {
                        path: '/home/work/search/view-ui/atom/plugins/aladdin/Atom_Wise_Utils.php',
                        className: '\\Atom_Wise_Utils'
                    }
                },
                getNamespace() {
                    return `test\\${featureName}`;
                }
            });
            assert.equal(res.phpCode, phpContent);
            assert.equal(res.errors.length, 0);
        });
    }
});

