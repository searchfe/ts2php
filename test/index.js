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
        it('template', async () => {
            const featureName = featureNames[i];
            const phpContent = await readFile(path.resolve(__dirname, `./features/${featureName}.php`));
            const tsPath = path.resolve(__dirname, `./features/${featureName}.ts`);
            const res = ts2php(tsPath, {
                modules: {
                    './atomWiseUtils': {
                        path: './path/to/utils.php',
                        className: 'Atom_Wise_Utils'
                    },
                    './tplData': {
                        path: '',
                        className: ''
                    }
                }
            });
            fs.writeFileSync(path.resolve(__dirname, '../output/' + featureName + '.php'), res.phpCode);
            assert.equal(res.phpCode, phpContent);
        });
    }
});

