import assert from 'assert';
import {initialParse} from '../src/js/code-analyzer';

describe('The javascript parser',() => {



    it('assiment', () => {
        assert.deepEqual(
            initialParse('function foo(x){\n' +
                '    let a = x + 1;\n' +
                '    if (a < z) {\n' +
                '        c = c + 5;\n' +
                '    } else if (b < z * 2) {\n' +
                '        c = c + x + 5;\n' +
                '    } else {\n' +
                '        c = c + z + 5;\n' +
                '    }\n' +
                '    return a;\n' +
                '}','1,2,3').name,
            'foo');
    });

    it('assiment', () => {
        assert.deepEqual(
            initialParse('function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    \n' +
                '    while (c++ < 10) {\n' +
                '        a = x * y;\n' +
                '        z = a * b * c;\n' +
                '    }\n' +
                '    \n' +
                '    return z;\n' +
                '}','(1,2,3)').param[1],
            'y'
        );
    });

    it('assiment', () => {
        assert.deepEqual(
            initialParse('function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    \n' +
                '    if (b < z) {\n' +
                '        c = c + 5;\n' +
                '    } else if (b < z * 2) {\n' +
                '        c = c + x + 5;\n' +
                '    } else {\n' +
                '        c++;\n' +
                '    }\n' +
                '    \n' +
                '    return c;\n' +
                '}\n','1,[2],3').name,
            'foo');
    });

    it('assiment', () => {
        assert.deepEqual(
            initialParse('function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = a[1];\n' +
                '\n' +
                '    if (b < z) {\n' +
                '        c = c + 5;\n' +
                '        return x + y + z + c;\n' +
                '    } else if (b < z * 2) {\n' +
                '        c = c + x + 5;\n' +
                '        return x + y + z + c;\n' +
                '    } \n' +
                '}\n','(1,2,3)').name,
            'foo'
        );
    });

    it('assiment', () => {
        assert.deepEqual(
            initialParse('function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '\n' +
                '    while (a < z) {\n' +
                '        c = a + b;\n' +
                '        z = c * 2;\n' +
                '        a++;\n' +
                '    }\n' +
                '\n' +
                '    return z;\n' +
                '}','(1,2,3)').name,
            'foo'
        );
    });

    it('assiment', () => {
        assert.deepEqual(
            initialParse('function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '\n' +
                '    while (a < z) {\n' +
                '        c = a + b;\n' +
                '        z = c * 2;\n' +
                '        a++;\n' +
                '    }\n' +
                '\n' +
                '    return z;\n' +
                '}','(1,2,3)').name,
            'foo'
        );
    });

    it('assiment', () => {
        assert.deepEqual(
            initialParse('function fo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '\n' +
                '    while (a < z) {\n' +
                '        c = a + b;\n' +
                '        z = c * 2;\n' +
                '        a++;\n' +
                '    }\n' +
                '\n' +
                '    return z;\n' +
                '}','(1,2,3)').name,
            'fo'
        );
    });

    it('assiment', () => {
        assert.deepEqual(
            initialParse('function f(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '\n' +
                '    while (a < z) {\n' +
                '        c = a + b;\n' +
                '        z = c * 2;\n' +
                '        a++;\n' +
                '    }\n' +
                '\n' +
                '    return z;\n' +
                '}','(1,2,3)').name,
            'f'
        );
    });

    it('assiment', () => {
        assert.deepEqual(
            initialParse('function dd(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '\n' +
                '    while (a < z) {\n' +
                '        c = a + b;\n' +
                '        z = c * 2;\n' +
                '        a++;\n' +
                '    }\n' +
                '\n' +
                '    return z;\n' +
                '}','(1,2,3)').name,
            'dd'
        );
    });

});






