import {fse, ignore} from "@serverless-devs/core";
import * as os from "os";
import path from "path";
import {isIgnoredInCodeUri, isIgnoredInCodeUri2} from "../src/ignore";

describe('isIgnoredInCodeUri', () => {
    let debugIndex = 'node_modules/debug/src/index.js';
    let srcIndex = 'src/index.ts';
    let distIndex = 'dist/index.js';
    let dir: string;
    let debugIndexAbsPath: string;
    let srcIndexAbsPath: string;
    let distIndexAbsPath: string;

    beforeEach(() => {
        dir = path.join(os.tmpdir(), 'is-ignored-in-code-uri-playground');
        console.log(`setting up playground ${dir}`);

        debugIndexAbsPath = path.join(dir, debugIndex);
        srcIndexAbsPath = path.join(dir, srcIndex);
        distIndexAbsPath = path.join(dir, distIndex);

        fse.ensureDir(dir);
        fse.ensureFile(debugIndexAbsPath);
        fse.ensureFile(srcIndexAbsPath);
        fse.ensureFile(distIndexAbsPath);
    });

    afterEach(() => {
        fse.removeSync(dir);
    });

    // copied from https://git-scm.com/docs/gitignore#_pattern_format
    //
    // If there is a separator at the beginning or middle (or both) of the pattern,
    // then the pattern is relative to the directory level of the particular .gitignore file itself.
    // Otherwise the pattern may also match at any level below the .gitignore level.
    //
    // If there is a separator at the end of the pattern then the pattern will only match directories,
    // otherwise the pattern can match both files and directories.
    //
    // For example, a pattern `doc/frotz/` matches `doc/frotz` directory, but not `a/doc/frotz` directory;
    // however `frotz/` matches `frotz` and `a/frotz` that is a directory (all paths are relative from the .gitignore file).
    //
    // so the `/src/` should only ignore src/index.ts as expected.

    test('node_modules/debug/src/index.js should not be ignored when specified /src/ in .signore', async function () {
        let signoreContent = [
            '/src/'
        ];
        fse.outputFileSync(path.resolve(dir, '.signore'), signoreContent.join('\r\n'))
        let i = ignore().add(signoreContent);

        let f = await isIgnoredInCodeUri(dir, 'invalid-runtime');

        expect(i.ignores(srcIndex)).toBeTruthy();
        expect(f(srcIndexAbsPath)).toBeTruthy();
        console.log(`${srcIndex} ignored`);

        expect(i.ignores(distIndex)).toBeFalsy();
        expect(f(distIndexAbsPath)).toBeFalsy();
        console.log(`${distIndex} kept`);

        expect(i.ignores(debugIndex)).toBeFalsy();
        expect(f(debugIndexAbsPath)).toBeFalsy(); // this should pass as described above
        console.log(`${debugIndex} kept`);
    });

    test('node_modules/debug/src/index.js should not be ignored when specified /src/ in .signore workaround', async function () {
        let signoreContent = [
            '/src/'
        ];

        fse.outputFileSync(path.resolve(dir, '.signore'), signoreContent.join('\r\n'))
        let i = ignore().add(signoreContent);

        let f = await isIgnoredInCodeUri2(dir, 'invalid-runtime');

        expect(i.ignores(srcIndex)).toBeTruthy();
        expect(f(srcIndexAbsPath)).toBeTruthy();
        console.log(`${srcIndex} ignored`);

        expect(i.ignores(distIndex)).toBeFalsy();
        expect(f(distIndexAbsPath)).toBeFalsy();
        console.log(`${distIndex} kept`);

        expect(i.ignores(debugIndex)).toBeFalsy();
        expect(f(debugIndexAbsPath)).toBeFalsy(); // this pass
        console.log(`${debugIndex} kept`);
    });
});
