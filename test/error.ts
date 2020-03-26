/**
 * @file 异常处理
 * @author cxtom(cxtom2008@gmail.com)
 */

import ts from 'byots';
import expect from 'expect';
import {Ts2Php} from '../src/index';

const ts2php = new Ts2Php();

describe('custom error', function () {

    it('regexp methods', function () {
        this.timeout(8000);
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

});
