/**
 * @file 单元测试
 * @author meixuguang
 */

/* eslint-disable  */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import {compile, Ts2Php} from '../src/index';
import glob from 'glob';
import {MDGator, Group} from 'mdgator';
import camelcase from 'camelcase';

const featuresPath = path.resolve(__dirname, './features');
const files = glob.sync('**/*.md', {
    cwd: featuresPath
});

const ts2php = new Ts2Php();

function processTestGroup(group: Group) {
    if (group.children.length > 0) {
        group.children.forEach(processTestGroup);
    }

    describe(group.name, () => {
        group.tests.forEach(testItem => {
            it(testItem.name, function () {
                this.timeout(10000);
                const phpContent = testItem.values.get('php')[0];
                const tsContent = testItem.values.get('ts')[0];

                if (!phpContent) {
                    throw Error(`PHP code is not fount in group: ${group.name} test: ${testItem.name}`);
                }
                if (!tsContent) {
                    throw Error(`TS code is not fount in group: ${group.name} test: ${testItem.name}`);
                }

                const namespace = `test\\case_${camelcase(testItem.name)}`
                const res = ts2php.compile(path.resolve(featuresPath, camelcase(testItem.name)), {
                    source: tsContent,
                    namespace,
                    modules: {
                        'vue': {
                            required: true
                        },
                        'camelcase': {
                            path: 'bbb-camelcase'
                        }
                    },
                    getModuleNamespace(name) {
                        return '\\someModule\\';
                    }
                });
                const phpNamespace = `<?php\nnamespace ${namespace};\n`;
                assert.equal(res.phpCode, phpNamespace + phpContent);
                assert.equal(res.errors.length, 0);
            });
        });
    });
}

const md = new MDGator();
files.forEach(file => {
    md.parse(fs.readFileSync(path.resolve(featuresPath, file)).toString()).forEach(processTestGroup);
});

describe('other features', () => {

    it('compile semantic diagnostics', function () {
        this.timeout(5000);
        let res = compile('test.ts', {source: 'const a = 1; a = 2;'});
        assert.equal(res.errors.length, 1);
    });

    it('compile code', function () {
        this.timeout(5000);
        let res = compile('test.ts', {namespace: 'test', source: 'var a = 1;'});
        assert.equal(res.phpCode, '<?php\nnamespace test;\n$a = 1;\n');
    });

    it('respect helper class name', function () {
        this.timeout(5000);
        let res = compile('test.ts', {namespace: 'test', source: '[].some(() => true);', helperNamespace: '\\foo\\'});
        let expected = '<?php\n' +
            'namespace test;\n' +
            '\\foo\\Ts2Php_Helper::array_some(array(), function (){\n' +
            'return true;\n' +
            '});\n'
        assert.equal(res.phpCode, expected);
    });

    it('helper class name default to \\Ts2Php_Helper', function () {
        this.timeout(5000);
        let res = compile('test.ts', {namespace: 'test', source: '[].some(() => true);'});
        let expected = '<?php\n' +
            'namespace test;\n' +
            '\\Ts2Php_Helper::array_some(array(), function (){\n' +
            'return true;\n' +
            '});\n'
        assert.equal(res.phpCode, expected);
    });

    it('function declaration can not use outside variables', function () {
        this.timeout(5000);
        let res = compile('test.ts', {namespace: 'test', source: 'let a = 1;function bbb() {return a;}'});
        assert.equal(res.errors.length, 1);
    })
});

