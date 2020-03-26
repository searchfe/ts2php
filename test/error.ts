/**
 * @file 异常处理
 * @author cxtom(cxtom2008@gmail.com)
 */

import ts from 'byots';
import expect from 'expect';
import {Ts2Php} from '../src/index';

const ts2php = new Ts2Php();

describe('custom error', function () {

    this.timeout(5000);

    it('regexp methods', function () {
        this.timeout(10000);
        const result1 = ts2php.compile(__filename, {
            source: 'const a = /$xx/.test("xx");'
        });
        expect(result1.errors.length).toBe(1);
        expect((result1.errors[0] as ts.Diagnostic).messageText).toContain('RegExp.prototype.test');

        const result2 = ts2php.compile(__filename, {
            source: 'const a = /$xx/; const b = a.test("xx");'
        });
        expect(result2.errors.length).toBe(1);
        expect((result2.errors[0] as ts.Diagnostic).messageText).toContain('RegExp.prototype.test');
    });

    it('string methods', function () {
        const result = ts2php.compile(__filename, {
            source: 'const a = "a".charAt(0);'
        });
        expect(result.errors.length).toBe(1);
        expect((result.errors[0] as ts.Diagnostic).messageText).toContain('String.prototype.charAt');
    });

    it('json methods', function () {
        const result = ts2php.compile(__filename, {
            source: 'const a = JSON.stringify({a: 1}, null);'
        });
        expect(result.errors.length).toBe(1);
        expect((result.errors[0] as ts.Diagnostic).messageText).toContain('only support 1 argument');
    });

});
