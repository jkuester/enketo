import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';
import pkg from '../../package.json';

const ENV = 'web';

const md5 = (message: string | Buffer) => {
    const hash = createHash('md5');
    hash.update(message);

    return hash.digest('hex');
};

const XSL_FORM = readFileSync('./src/xsl/openrosa2html5form.xsl', 'utf-8');
const XSL_MODEL = readFileSync('./src/xsl/openrosa2xmlmodel.xsl', 'utf-8');
const PACKAGE_VERSION = pkg.version;
const VERSION = md5(`${XSL_FORM}${XSL_MODEL}${PACKAGE_VERSION}`);

type Browser = 'firefox' | 'chromium' | 'webkit';

const browsers = new Map<Browser, Browser>([
    ['firefox', 'firefox'],
    ['chromium', 'chromium'],
    ['webkit', 'webkit'],
]);

const BROWSER = browsers.get(process.env.BROWSER as Browser) ?? 'firefox';

const define = {
    PACKAGE_VERSION: JSON.stringify(PACKAGE_VERSION),
    VERSION: JSON.stringify(VERSION),
    ENV: JSON.stringify(ENV),
    BROWSER: JSON.stringify(BROWSER),
};

export const setup = async () => {
    const root = fileURLToPath(new URL('../..', import.meta.url));
    const configFile = resolve(root, './vite.config.ts');

    const server = await createServer({
        configFile,
        define,
        root,
    });

    await server.listen();
};
