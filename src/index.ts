import {InputProps} from './common/entity';
import random from 'random-string'
import opn from 'opn'
import rp from 'request-promise'
import {pack} from './zip';
import {CatchableError} from "./errors";
import path from 'path';
import {isIgnored, isIgnoredInCodeUri} from './ignore';
import {request, Logger, getRootHome, commandParse, fse, spinner, help} from "@serverless-devs/core";
import to from "@serverless-devs/core/dist/libs/await-to";

const logger = new Logger('platform');
const FC_CODE_CACHE_DIR = "./"

function sleep(timer: number) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), timer);
    });
}


export default class Platform {

    async _getToken() {
        try {
            const contentText = fse.readFileSync(`${getRootHome()}/serverless-devs-platform.dat`, 'utf-8');
            return contentText
        } catch (e) {
            return null
        }
    }

    async _getContent(fileList) {
        for (let i = 0; i < fileList.length; i++) {
            try {
                return fse.readFileSync(fileList[i], 'utf-8')
            } catch (e) {
            }
        }
        return undefined
    }

    async generateCodeIngore(baseDir: string, codeUri: string, runtime: string): Promise<Function | null> {
        const ignoreFileInCodeUri: string = path.join(
            path.resolve(baseDir, codeUri),
            '.signore',
        );
        if (fse.pathExistsSync(ignoreFileInCodeUri) && fse.lstatSync(ignoreFileInCodeUri).isFile()) {
            return await isIgnoredInCodeUri(path.resolve(baseDir, codeUri), runtime);
        }
        const ignoreFileInBaseDir: string = path.join(baseDir, '.fcignore');
        if (fse.pathExistsSync(ignoreFileInBaseDir) && fse.lstatSync(ignoreFileInBaseDir).isFile()) {
            logger.log(
                '.fcignore file will be placed under codeUri only in the future. Please update it with the relative path and then move it to the codeUri as soon as possible.',
            );
        }
        return await isIgnored(
            baseDir,
            runtime,
            path.resolve(baseDir, codeUri),
            path.resolve(baseDir, codeUri),
        );
    }

    async zipCode(baseDir: string, codeUri: string, tempFileName: string, runtime: string): Promise<any> {
        let codeAbsPath;
        if (codeUri) {
            codeAbsPath = path.resolve(baseDir, codeUri);
            if (codeUri.endsWith('.zip') || codeUri.endsWith('.jar') || codeUri.endsWith('.war')) {
                return codeAbsPath;
            }
        } else {
            codeAbsPath = path.resolve(baseDir, './');
        }
        const codeignore = await this.generateCodeIngore(baseDir, codeUri, runtime);

        // await detectLibrary(codeAbsPath, runtime, baseDir, functionName, '\t');
        await fse.mkdirp(FC_CODE_CACHE_DIR);
        const zipPath = path.join(
            FC_CODE_CACHE_DIR,
            tempFileName,
        );
        return await pack(codeAbsPath, codeignore, zipPath);
    }

    /**
     * demo 登陆
     * @param inputs
     * @returns
     */
    public async login(inputs: InputProps) {

        const apts = {
            boolean: ['help'],
            alias: {help: 'h'},
        };
        const comParse = commandParse({args: inputs.args}, apts);
        if (comParse.data && comParse.data.help) {
            help([{
                header: 'Login',
                content: `Log in to Serverless Registry`
            }, {
                header: 'Usage',
                content: `$ s cli registry login <options>`
            }, {
                header: 'Options',
                optionList: [
                    {
                        name: 'token',
                        description: '[Optional] If you already have a token, you can configure it directly',
                        type: String,
                    }
                ],
            }, {
                header: 'Examples without Yaml',
                content: [
                    '$ s cli registry login',
                    '$ s cli registry login --token my-serverless-registry-token',
                ],
            },]);
            return;
        }
        const tempToken = comParse.data ? comParse.data.token : null
        let st = 0
        let user
        if (tempToken) {
            const fd = await fse.openSync(`${getRootHome()}/serverless-devs-platform.dat`, 'w+')
            await fse.writeSync(fd, tempToken)
            await fse.closeSync(fd)
            st = 1
        } else {

            const token = random({length: 20})
            const loginUrl = `https://github.com/login/oauth/authorize?client_id=beae900546180c7bbdd6&redirect_uri=http://registry.devsapp.cn/user/login/github?token=${token}`

            // 输出提醒
            logger.warn("Serverless registry no longer provides independent registration function, but will uniformly adopt GitHub authorized login scheme.")
            logger.info("The system will attempt to automatically open the browser for authorization......")
            logger.info("If the browser is not opened automatically, please try to open the following URL manually for authorization.")
            logger.info(loginUrl)
            try {
                await sleep(2000)
                opn(loginUrl)
            } catch (e) {}
            await logger.task('Getting', [
                {
                    title: 'Getting login token ...',
                    id: 'get token',
                    task: async () => {
                        for (let i = 0; i < 100; i++) {
                            await sleep(2000)
                            const tempResult = await request('http://registry.devsapp.cn/user/information/github', {
                                params: {
                                    token: token,
                                },
                            })
                            if (!tempResult.Error && tempResult.safety_code) {
                                // 或得到结果, 存储状态
                                const fd = await fse.openSync(`${getRootHome()}/serverless-devs-platform.dat`, 'w+')
                                await fse.writeSync(fd, tempResult.safety_code)
                                await fse.closeSync(fd)
                                st = 1
                                user = tempResult.login
                                break
                            }
                        }
                    },
                }
            ])
        }
        if (st == 1) {
            logger.log(`${user ? user + ': ' : ''}Welcome to Serverless Devs Registry.`, "green");
        } else {
            logger.error("Login failed. Please log in to GitHub account on the pop-up page and authorize it, or try again later.")
        }
        return null;
    }

    /**
     * demo 删除版本
     * @param inputs
     * @returns
     */
    public async delete(inputs: InputProps) {
        const token = await this._getToken()
        if (!token) {
            throw new CatchableError(`Please perform serverless registry through [s cli registry login]`, 'Failed to get serverless registry token')
        }
        const apts = {
            boolean: ['help'],
            alias: {help: 'h'},
        };
        const comParse = commandParse({args: inputs.args}, apts);
        if (comParse.data && comParse.data.help) {
            help([{
                header: 'Delete',
                content: `Delete the package of the specified version`
            }, {
                header: 'Usage',
                content: `$ s cli registry delete <options>`
            }, {
                header: 'Options',
                optionList: [
                    {
                        name: 'name-version',
                        description: '[Required] The name and version of the package, such as name@version',
                        type: String,
                    },
                    {
                        name: 'type',
                        description: '[Required] Package type, value: [Component/Application/Plugin]',
                        type: String,
                    }
                ],
            }, {
                header: 'Examples without Yaml',
                content: [
                    '$ s cli registry delete --name-version thinphp@0.0.1 --type Component',
                ],
            },]);
            return;
        }
        const package_name = comParse.data ? comParse.data['name-version'] : null
        const package_type = comParse.data ? comParse.data.type : null
        if (!package_name || !package_name.includes("@")) {
            throw new CatchableError('Component name and version is required.', "Please add --name-version, like: s cli registry delete --name-version thinphp@0.0.1 --type Component");
        }
        if (!package_type || !['Component', 'Application', 'Plugin'].includes(package_type)) {
            throw new CatchableError('Component type is required. The velue of type: [Component/Application/Plugin]', "Please add --type, like: s cli registry delete --name-version thinphp@0.0.1 --type Component");
        }

        const options = {
            'method': 'POST',
            'url': 'http://registry.devsapp.cn/package/delete',
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {
                'safety_code': token,
                'package_name': package_name.split("@")[0],
                'package_type': package_type,
                'package_version': package_name.split("@")[1],
            }
        };
        let rpbody
        try {
            rpbody = await rp(options);
        } catch (e) {
            throw new CatchableError('Network exception. Please try again later.', 'Data request exception')
        }
        let tempResult = JSON.parse(rpbody)
        if (tempResult.Response.Error) {
            throw new CatchableError(`${tempResult.Response.Error}: ${tempResult.Response.Message}`, 'Failed to obtain relevant information')
        }
        tempResult = tempResult.Response
        return tempResult
    }

    public async detail(inputs: InputProps) {
        const token = await this._getToken()
        if (!token) {
            throw new CatchableError(`Please perform serverless registry through [s cli registry login]`, 'Failed to get serverless registry token')
        }
        const apts = {
            boolean: ['help'],
            alias: {help: 'h'},
        };
        const comParse = commandParse({args: inputs.args}, apts);
        if (comParse.data && comParse.data.help) {
            help([{
                header: 'Detail',
                content: `Query the details of a package`
            }, {
                header: 'Usage',
                content: `$ s cli registry detail <options>`
            }, {
                header: 'Options',
                optionList: [
                    {
                        name: 'name-version',
                        description: '[Required] The name and version of the package, such as name@version',
                        type: String,
                    }
                ],
            }, {
                header: 'Examples without Yaml',
                content: [
                    '$ s cli registry delete --name-version thinphp@0.0.1 --type Component',
                ],
            },]);
            return;
        }
        const package_name = comParse.data ? comParse.data['name-version'] : null
        if (!package_name || !package_name.includes("@")) {
            throw new CatchableError('Component name and version is required.', "Please add --name-version, like: s cli registry delete --name-version thinphp@0.0.1 --type Component");
        }

        const options = {
            'method': 'GET',
            'url': `http://registry.devsapp.cn/simple/${package_name.split("@")[0]}/releases`,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        let rpbody
        try {
            rpbody = await rp(options);
        } catch (e) {
            throw new CatchableError('Network exception. Please try again later.', 'Data request exception')
        }

        let tempResult = JSON.parse(rpbody)
        if (tempResult.Response.Error) {
            throw new CatchableError(`${tempResult.Response.Error}: ${tempResult.Response.Message}`, 'Failed to obtain relevant information')
        }
        tempResult = tempResult.Response
        for (let i = 0; i < tempResult.length; i++) {
            if (tempResult[i].tag_name == package_name.split("@")[1]) {
                return {
                    tag_name: tempResult[i].tag_name,
                    published_at: tempResult[i].published_at,
                    zipball_url: tempResult[i].zipball_url
                }
            }
        }

        logger.warn("The specified package version was not found.")

        return null
    }

    /**
     * demo 发布Package
     * @param inputs
     * @returns
     */
    public async publish(inputs: InputProps) {
        const token = await this._getToken()
        if (!token) {
            throw new CatchableError(`Please perform serverless registry through [s cli registry login]`, 'Failed to get serverless registry token')
        }
        const apts = {
            boolean: ['help'],
            alias: {help: 'h'},
        };
        const comParse = commandParse({args: inputs.args}, apts);
        if (comParse.data && comParse.data.help) {
            help([{
                header: 'Publish',
                content: `Publish package to serverless registry`
            }, {
                header: 'Usage',
                content: `$ s cli registry publish`
            }, {
                header: 'Examples without Yaml',
                content: [
                    '$ s cli registry publish',
                ],
            },]);
            return;
        }
        const publish = await this._getContent(['./publish.yaml', './publish.yml'])
        const readme = await this._getContent(['./readme.md', './README.md', './README.MD', './Readme.MD', './Readme.md'])
        const version_body = await this._getContent(['./version.md', './VERSION.md', './VERSION.MD'])
        const syaml = await this._getContent(['./src/s.yaml', './src/s.yml'])
        let rpbody
        try {
            rpbody = await rp({
                'method': 'POST',
                'url': "https://registry.devsapp.cn/package/publish",
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                'form': {
                    "safety_code": token,
                    "publish": publish,
                    "version_body": version_body,
                    "readme": readme,
                    "syaml": syaml
                }
            });
        } catch (e) {
            throw new CatchableError('Network exception. Please try again later.', 'Data request exception')
        }
        let tempResult = JSON.parse(rpbody)
        if (tempResult.Response.Error) {
            throw new CatchableError(`${tempResult.Response.Error}: ${tempResult.Response.Message}`, 'Failed to obtain relevant information')
        }
        const uploadUrl = tempResult.Response.url
        const baseDir = "./"
        const codeUri = "./"
        try {
            await fse.mkdirSync('./.s/')
        } catch (e) {
        }
        const tempName = './.s/' + random({length: 20}) + '.zip'
        const runtime = "nodejs12"
        await this.zipCode(baseDir, codeUri, tempName, runtime)
        const vm = spinner('Publishing');
        try {
            rpbody = await rp({
                'method': 'PUT',
                'url': uploadUrl,
                'body': await fse.readFileSync(tempName)
            });
            vm.succeed('Published successfully');
        } catch (e) {
            vm.fail('Publishing failed')
            throw new CatchableError('Network exception. Please try again later.', e.body)
        }
        try {
            // 尝试删除
            fse.unlinkSync(tempName)
        } catch (e) {
        }
        return null
    }

    /**
     * demo 获取发布的列表
     * @param inputs
     * @returns
     */
    public async list(inputs: InputProps) {
        const token = await this._getToken()
        if (!token) {
            throw new CatchableError(`Please perform serverless registry through [s cli registry login]`, 'Failed to get serverless registry token')
        }

        const apts = {
            boolean: ['help'],
            alias: {help: 'h'},
        };
        const comParse = commandParse({args: inputs.args}, apts);
        if (comParse.data && comParse.data.help) {
            help([{
                header: 'List',
                content: `Query the published packge of the current login account`
            }, {
                header: 'Usage',
                content: `$ s cli registry list`
            }, {
                header: 'Examples without Yaml',
                content: [
                    '$ s cli registry list',
                ],
            },]);
            return;
        }
        const options = {
            'method': 'POST',
            'url': 'http://registry.devsapp.cn/center/package/publish',
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {
                'safety_code': token
            }
        };
        let rpbody
        try {
            rpbody = await rp(options);
        } catch (e) {
            throw new CatchableError('Network exception. Please try again later.', 'Data request exception')
        }
        let result = []
        let tempResult = JSON.parse(rpbody)
        if (tempResult.Response.Error) {
            throw new CatchableError(`${tempResult.Response.Error}: ${tempResult.Response.Message}`, 'Failed to obtain relevant information')
        }
        tempResult = tempResult.Response
        for (let i = 0; i < tempResult.length; i++) {
            result.push({
                package: tempResult[i].package,
                description: tempResult[i].description,
                version: tempResult[i].version.tag_name,
                zipball_url: tempResult[i].version.zipball_url
            })
        }
        if (result) {
            return result
        }
        logger.info('You haven\'t released Package yet')
        return null

    }

    /**
     * demo 获取某个组件的版本
     * @param inputs
     * @returns
     */
    public async versions(inputs: InputProps) {
        const apts = {
            boolean: ['help'],
            alias: {help: 'h'},
        };
        const comParse = commandParse({args: inputs.args}, apts);
        if (comParse.data && comParse.data.help) {
            help([{
                header: 'Versions',
                content: `Query the version information of the specified package`
            }, {
                header: 'Usage',
                content: `$ s cli registry versions <options>`
            }, {
                header: 'Options',
                optionList: [
                    {
                        name: 'name',
                        description: '[Required] The name of the package',
                        type: String,
                    }
                ],
            }, {
                header: 'Examples without Yaml',
                content: [
                    '$ s cli registry versions --name thinkphp',
                ],
            },]);
            return;
        }
        const component = comParse.data ? comParse.data.name : null
        if (!component) {
            throw new CatchableError('Component name is required.', "Please add --name, like: s cli registry versions --name thinphp");
        }
        const options = {
            'method': 'GET',
            'url': `http://registry.devsapp.cn/simple/${component}/releases`,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let rpbody
        try {
            rpbody = await rp(options);
        } catch (e) {
            throw new CatchableError('Network exception. Please try again later.', 'Data request exception')
        }
        let result = {
            "PackageName": component,
            "Versions": []
        }

        let tempResult = JSON.parse(rpbody)
        if (tempResult.Response.Error) {
            throw new CatchableError(`${tempResult.Response.Error}: ${tempResult.Response.Message}`, 'Failed to obtain relevant information')
        }
        tempResult = tempResult.Response
        for (let i = 0; i < tempResult.length; i++) {
            result.Versions.push({
                tag_name: tempResult[i].tag_name,
                published_at: tempResult[i].published_at,
                zipball_url: tempResult[i].zipball_url
            })
        }
        return result
    }

    /**
     * demo 更新token信息
     * @param inputs
     * @returns
     */
    public async retoken(inputs: InputProps) {
        const token = await this._getToken()

        if (!token) {
            throw new CatchableError(`Please perform serverless registry through [s cli registry login]`, 'Failed to get serverless registry token')
        }
        const apts = {
            boolean: ['help'],
            alias: {help: 'h'},
        };
        const comParse = commandParse({args: inputs.args}, apts);
        if (comParse.data && comParse.data.help) {
            help([{
                header: 'Retoken',
                content: `Reset Serverless Registry login token`
            }, {
                header: 'Usage',
                content: `$ s cli registry retoken`
            }, {
                header: 'Examples without Yaml',
                content: [
                    '$ s cli registry retoken',
                ],
            },]);
            return;
        }

        const options = {
            'method': 'POST',
            'url': `http://registry.devsapp.cn/user/update/safetycode`,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {
                'safety_code': token
            }
        };
        let rpbody
        try {
            rpbody = await rp(options);
        } catch (e) {
            throw new CatchableError('Network exception. Please try again later.', 'Data request exception')
        }
        let tempResult = JSON.parse(rpbody)
        if (tempResult.Response.Error) {
            throw new CatchableError(`${tempResult.Response.Error}: ${tempResult.Response.Message}`, 'Failed to obtain relevant information')
        }
        tempResult = tempResult.Response
        const fd = await fse.openSync(`${getRootHome()}/serverless-devs-platform.dat`, 'w+')
        await fse.writeSync(fd, tempResult.safety_code)
        await fse.closeSync(fd)
        logger.log(`Serverless Registry login token reset succeeded.`, "green");
        return null
    }


    /**
     * demo 获取token信息
     * @param inputs
     * @returns
     */
    public async token(inputs: InputProps) {
        const token = await this._getToken()

        if (!token) {
            throw new CatchableError(`Please perform serverless registry through [s cli registry login]`, 'Failed to get serverless registry token')
        }
        const apts = {
            boolean: ['help'],
            alias: {help: 'h'},
        };
        const comParse = commandParse({args: inputs.args}, apts);
        if (comParse.data && comParse.data.help) {
            help([{
                header: 'Token',
                content: `Get Serverless Registry login token`
            }, {
                header: 'Usage',
                content: `$ s cli registry token`
            }]);
            return;
        }

        logger.warn("The `token` is a very important new credential information for you to use Serverless Registry. Please keep it properly. In case of leakage, please use the `retoken` command to regenerate it.")

        return {"Token": token};
    }


    /**
     * demo 查询package
     * @param inputs
     * @returns
     */
    public async search(inputs: InputProps) {
        const apts = {
            boolean: ['help'],
            alias: {help: 'h'},
        };
        const comParse = commandParse({args: inputs.args}, apts);
        if (comParse.data && comParse.data.help) {
            help([{
                header: 'Search',
                content: `Search packages`
            }, {
                header: 'Usage',
                content: `$ s cli registry search <options>`
            }, {
                header: 'Options',
                optionList: [
                    {
                        name: 'type',
                        description: '[Required] The type of package, value: Component, Application, Plugin',
                        type: String,
                    },
                    {
                        name: 'keyword',
                        description: '[Optional] search keyword',
                        type: String,
                    }
                ],
            }, {
                header: 'Examples without Yaml',
                content: [
                    '$ s cli registry search --type component',
                ],
            },]);
            return;
        }
        const packageType = comParse.data ? comParse.data.type : null
        const packageKeyword = comParse.data ? comParse.data.keyword : null
        if (!packageType) {
            throw new CatchableError('Package type is required, value: Component, Application, Plugin', "Please add --type, like: s cli registry versions --type component");
        }
        const options = {
            'method': 'POST',
            'url': `http://registry.devsapp.cn/package/search`,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            'form': {
                "type": packageType,
                "keyword": packageKeyword
            }
        };
        let rpbody
        try {
            rpbody = await rp(options);
        } catch (e) {
            throw new CatchableError('Network exception. Please try again later.', 'Data request exception')
        }
        let result = []
        let tempResult = JSON.parse(rpbody)
        if (tempResult.Response.Error) {
            throw new CatchableError(`${tempResult.Response.Error}: ${tempResult.Response.Message}`, 'Failed to obtain relevant information')
        }
        tempResult = tempResult.Response
        for (let i = 0; i < tempResult.length; i++) {
            result.push({
                name: tempResult[i].package,
                description: tempResult[i].description,
                version: {
                    tag_name: tempResult[i].version.tag_name,
                    published_at: tempResult[i].version.published_at,
                    zipball_url: tempResult[i].version.zipball_url
                }
            })
        }
        return result
    }

}
