"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var random_string_1 = __importDefault(require("random-string"));
var opn_1 = __importDefault(require("opn"));
var request_promise_1 = __importDefault(require("request-promise"));
var zip_1 = require("./zip");
var errors_1 = require("./errors");
var path_1 = __importDefault(require("path"));
var ignore_1 = require("./ignore");
var core_1 = require("@serverless-devs/core");
var logger = new core_1.Logger('platform');
var FC_CODE_CACHE_DIR = "./";
function sleep(timer) {
    return new Promise(function (resolve) {
        setTimeout(function () { return resolve(true); }, timer);
    });
}
var Platform = /** @class */ (function () {
    function Platform() {
    }
    Platform.prototype._getToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contentText;
            return __generator(this, function (_a) {
                try {
                    contentText = core_1.fse.readFileSync("".concat((0, core_1.getRootHome)(), "/serverless-devs-platform.dat"), 'utf-8');
                    return [2 /*return*/, contentText];
                }
                catch (e) {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    Platform.prototype._getContent = function (fileList) {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                for (i = 0; i < fileList.length; i++) {
                    try {
                        return [2 /*return*/, core_1.fse.readFileSync(fileList[i], 'utf-8')];
                    }
                    catch (e) {
                    }
                }
                return [2 /*return*/, undefined];
            });
        });
    };
    Platform.prototype.generateCodeIngore = function (baseDir, codeUri, runtime) {
        return __awaiter(this, void 0, void 0, function () {
            var ignoreFileInCodeUri, ignoreFileInBaseDir;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ignoreFileInCodeUri = path_1.default.join(path_1.default.resolve(baseDir, codeUri), '.signore');
                        if (!(core_1.fse.pathExistsSync(ignoreFileInCodeUri) && core_1.fse.lstatSync(ignoreFileInCodeUri).isFile())) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, ignore_1.isIgnoredInCodeUri)(path_1.default.resolve(baseDir, codeUri), runtime)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        ignoreFileInBaseDir = path_1.default.join(baseDir, '.fcignore');
                        if (core_1.fse.pathExistsSync(ignoreFileInBaseDir) && core_1.fse.lstatSync(ignoreFileInBaseDir).isFile()) {
                            logger.log('.fcignore file will be placed under codeUri only in the future. Please update it with the relative path and then move it to the codeUri as soon as possible.');
                        }
                        return [4 /*yield*/, (0, ignore_1.isIgnored)(baseDir, runtime, path_1.default.resolve(baseDir, codeUri), path_1.default.resolve(baseDir, codeUri))];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Platform.prototype.zipCode = function (baseDir, codeUri, tempFileName, runtime) {
        return __awaiter(this, void 0, void 0, function () {
            var codeAbsPath, codeignore, zipPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (codeUri) {
                            codeAbsPath = path_1.default.resolve(baseDir, codeUri);
                            if (codeUri.endsWith('.zip') || codeUri.endsWith('.jar') || codeUri.endsWith('.war')) {
                                return [2 /*return*/, codeAbsPath];
                            }
                        }
                        else {
                            codeAbsPath = path_1.default.resolve(baseDir, './');
                        }
                        return [4 /*yield*/, this.generateCodeIngore(baseDir, codeUri, runtime)];
                    case 1:
                        codeignore = _a.sent();
                        // await detectLibrary(codeAbsPath, runtime, baseDir, functionName, '\t');
                        return [4 /*yield*/, core_1.fse.mkdirp(FC_CODE_CACHE_DIR)];
                    case 2:
                        // await detectLibrary(codeAbsPath, runtime, baseDir, functionName, '\t');
                        _a.sent();
                        zipPath = path_1.default.join(FC_CODE_CACHE_DIR, tempFileName);
                        return [4 /*yield*/, (0, zip_1.pack)(codeAbsPath, codeignore, zipPath)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * demo 登陆
     * @param inputs
     * @returns
     */
    Platform.prototype.login = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var apts, comParse, tempToken, st, user, fd, token_1, loginUrl, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apts = {
                            boolean: ['help'],
                            alias: { help: 'h' },
                        };
                        comParse = (0, core_1.commandParse)({ args: inputs.args }, apts);
                        if (comParse.data && comParse.data.help) {
                            (0, core_1.help)([{
                                    header: 'Login',
                                    content: "Log in to Serverless Registry"
                                }, {
                                    header: 'Usage',
                                    content: "$ s cli registry login <options>"
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
                            return [2 /*return*/];
                        }
                        tempToken = comParse.data ? comParse.data.token : null;
                        st = 0;
                        if (!tempToken) return [3 /*break*/, 4];
                        return [4 /*yield*/, core_1.fse.openSync("".concat((0, core_1.getRootHome)(), "/serverless-devs-platform.dat"), 'w+')];
                    case 1:
                        fd = _a.sent();
                        return [4 /*yield*/, core_1.fse.writeSync(fd, tempToken)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, core_1.fse.closeSync(fd)];
                    case 3:
                        _a.sent();
                        st = 1;
                        return [3 /*break*/, 10];
                    case 4:
                        token_1 = (0, random_string_1.default)({ length: 20 });
                        loginUrl = "https://github.com/login/oauth/authorize?client_id=beae900546180c7bbdd6&redirect_uri=https://registry.devsapp.cn/user/login/github?token=".concat(token_1);
                        // 输出提醒
                        logger.warn("Serverless registry no longer provides independent registration function, but will uniformly adopt GitHub authorized login scheme.");
                        logger.info("The system will attempt to automatically open the browser for authorization......");
                        logger.info("If the browser is not opened automatically, please try to open the following URL manually for authorization.");
                        logger.info(loginUrl);
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, sleep(2000)];
                    case 6:
                        _a.sent();
                        (0, opn_1.default)(loginUrl);
                        return [3 /*break*/, 8];
                    case 7:
                        e_1 = _a.sent();
                        return [3 /*break*/, 8];
                    case 8: return [4 /*yield*/, logger.task('Getting', [
                            {
                                title: 'Getting login token ...',
                                id: 'get token',
                                task: function () { return __awaiter(_this, void 0, void 0, function () {
                                    var i, tempResult, fd;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                i = 0;
                                                _a.label = 1;
                                            case 1:
                                                if (!(i < 100)) return [3 /*break*/, 8];
                                                return [4 /*yield*/, sleep(2000)];
                                            case 2:
                                                _a.sent();
                                                return [4 /*yield*/, (0, core_1.request)('https://registry.devsapp.cn/user/information/github', {
                                                        params: {
                                                            token: token_1,
                                                        },
                                                    })];
                                            case 3:
                                                tempResult = _a.sent();
                                                if (!(!tempResult.Error && tempResult.safety_code)) return [3 /*break*/, 7];
                                                return [4 /*yield*/, core_1.fse.openSync("".concat((0, core_1.getRootHome)(), "/serverless-devs-platform.dat"), 'w+')];
                                            case 4:
                                                fd = _a.sent();
                                                return [4 /*yield*/, core_1.fse.writeSync(fd, tempResult.safety_code)];
                                            case 5:
                                                _a.sent();
                                                return [4 /*yield*/, core_1.fse.closeSync(fd)];
                                            case 6:
                                                _a.sent();
                                                st = 1;
                                                user = tempResult.login;
                                                return [3 /*break*/, 8];
                                            case 7:
                                                i++;
                                                return [3 /*break*/, 1];
                                            case 8: return [2 /*return*/];
                                        }
                                    });
                                }); },
                            }
                        ])];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10:
                        if (st == 1) {
                            logger.log("".concat(user ? user + ': ' : '', "Welcome to Serverless Devs Registry."), "green");
                        }
                        else {
                            logger.error("Login failed. Please log in to GitHub account on the pop-up page and authorize it, or try again later.");
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * demo 删除版本
     * @param inputs
     * @returns
     */
    Platform.prototype.delete = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var token, apts, comParse, package_name, package_type, options, rpbody, e_2, tempResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getToken()];
                    case 1:
                        token = _a.sent();
                        if (!token) {
                            throw new errors_1.CatchableError("Please perform serverless registry through [s cli registry login]", 'Failed to get serverless registry token');
                        }
                        apts = {
                            boolean: ['help'],
                            alias: { help: 'h' },
                        };
                        comParse = (0, core_1.commandParse)({ args: inputs.args }, apts);
                        if (comParse.data && comParse.data.help) {
                            (0, core_1.help)([{
                                    header: 'Delete',
                                    content: "Delete the package of the specified version"
                                }, {
                                    header: 'Usage',
                                    content: "$ s cli registry delete <options>"
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
                            return [2 /*return*/];
                        }
                        package_name = comParse.data ? comParse.data['name-version'] : null;
                        package_type = comParse.data ? comParse.data.type : null;
                        if (!package_name || !package_name.includes("@")) {
                            throw new errors_1.CatchableError('Component name and version is required.', "Please add --name-version, like: s cli registry delete --name-version thinphp@0.0.1 --type Component");
                        }
                        if (!package_type || !['Component', 'Application', 'Plugin'].includes(package_type)) {
                            throw new errors_1.CatchableError('Component type is required. The velue of type: [Component/Application/Plugin]', "Please add --type, like: s cli registry delete --name-version thinphp@0.0.1 --type Component");
                        }
                        options = {
                            'method': 'POST',
                            'url': 'https://registry.devsapp.cn/package/delete',
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
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, (0, request_promise_1.default)(options)];
                    case 3:
                        rpbody = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _a.sent();
                        throw new errors_1.CatchableError('Network exception. Please try again later.', 'Data request exception');
                    case 5:
                        tempResult = JSON.parse(rpbody);
                        if (tempResult.Response.Error) {
                            throw new errors_1.CatchableError("".concat(tempResult.Response.Error, ": ").concat(tempResult.Response.Message), 'Failed to obtain relevant information');
                        }
                        tempResult = tempResult.Response;
                        return [2 /*return*/, tempResult];
                }
            });
        });
    };
    Platform.prototype.detail = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var token, apts, comParse, package_name, options, rpbody, e_3, tempResult, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getToken()];
                    case 1:
                        token = _a.sent();
                        if (!token) {
                            throw new errors_1.CatchableError("Please perform serverless registry through [s cli registry login]", 'Failed to get serverless registry token');
                        }
                        apts = {
                            boolean: ['help'],
                            alias: { help: 'h' },
                        };
                        comParse = (0, core_1.commandParse)({ args: inputs.args }, apts);
                        if (comParse.data && comParse.data.help) {
                            (0, core_1.help)([{
                                    header: 'Detail',
                                    content: "Query the details of a package"
                                }, {
                                    header: 'Usage',
                                    content: "$ s cli registry detail <options>"
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
                            return [2 /*return*/];
                        }
                        package_name = comParse.data ? comParse.data['name-version'] : null;
                        if (!package_name || !package_name.includes("@")) {
                            throw new errors_1.CatchableError('Component name and version is required.', "Please add --name-version, like: s cli registry delete --name-version thinphp@0.0.1 --type Component");
                        }
                        options = {
                            'method': 'GET',
                            'url': "https://registry.devsapp.cn/simple/".concat(package_name.split("@")[0], "/releases"),
                            'headers': {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        };
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, (0, request_promise_1.default)(options)];
                    case 3:
                        rpbody = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_3 = _a.sent();
                        throw new errors_1.CatchableError('Network exception. Please try again later.', 'Data request exception');
                    case 5:
                        tempResult = JSON.parse(rpbody);
                        if (tempResult.Response.Error) {
                            throw new errors_1.CatchableError("".concat(tempResult.Response.Error, ": ").concat(tempResult.Response.Message), 'Failed to obtain relevant information');
                        }
                        tempResult = tempResult.Response;
                        for (i = 0; i < tempResult.length; i++) {
                            if (tempResult[i].tag_name == package_name.split("@")[1]) {
                                return [2 /*return*/, {
                                        tag_name: tempResult[i].tag_name,
                                        published_at: tempResult[i].published_at,
                                        zipball_url: tempResult[i].zipball_url
                                    }];
                            }
                        }
                        logger.warn("The specified package version was not found.");
                        return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * demo 发布Package
     * @param inputs
     * @returns
     */
    Platform.prototype.publish = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var token, apts, comParse, publish, readme, version_body, syaml, rpbody, e_4, tempResult, uploadUrl, baseDir, codeUri, e_5, tempName, runtime, vm, _a, _b, e_6;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this._getToken()];
                    case 1:
                        token = _d.sent();
                        if (!token) {
                            throw new errors_1.CatchableError("Please perform serverless registry through [s cli registry login]", 'Failed to get serverless registry token');
                        }
                        apts = {
                            boolean: ['help'],
                            alias: { help: 'h' },
                        };
                        comParse = (0, core_1.commandParse)({ args: inputs.args }, apts);
                        if (comParse.data && comParse.data.help) {
                            (0, core_1.help)([{
                                    header: 'Publish',
                                    content: "Publish package to serverless registry"
                                }, {
                                    header: 'Usage',
                                    content: "$ s cli registry publish"
                                }, {
                                    header: 'Examples without Yaml',
                                    content: [
                                        '$ s cli registry publish',
                                    ],
                                },]);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this._getContent(['./publish.yaml', './publish.yml'])];
                    case 2:
                        publish = _d.sent();
                        return [4 /*yield*/, this._getContent(['./readme.md', './README.md', './README.MD', './Readme.MD', './Readme.md'])];
                    case 3:
                        readme = _d.sent();
                        return [4 /*yield*/, this._getContent(['./version.md', './VERSION.md', './VERSION.MD'])];
                    case 4:
                        version_body = _d.sent();
                        return [4 /*yield*/, this._getContent(['./src/s.yaml', './src/s.yml'])];
                    case 5:
                        syaml = _d.sent();
                        _d.label = 6;
                    case 6:
                        _d.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, (0, request_promise_1.default)({
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
                            })];
                    case 7:
                        rpbody = _d.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        e_4 = _d.sent();
                        throw new errors_1.CatchableError('Network exception. Please try again later.', 'Data request exception');
                    case 9:
                        tempResult = JSON.parse(rpbody);
                        if (tempResult.Response.Error) {
                            throw new errors_1.CatchableError("".concat(tempResult.Response.Error, ": ").concat(tempResult.Response.Message), 'Failed to obtain relevant information');
                        }
                        uploadUrl = tempResult.Response.url;
                        baseDir = "./";
                        codeUri = "./";
                        _d.label = 10;
                    case 10:
                        _d.trys.push([10, 12, , 13]);
                        return [4 /*yield*/, core_1.fse.mkdirSync('./.s/')];
                    case 11:
                        _d.sent();
                        return [3 /*break*/, 13];
                    case 12:
                        e_5 = _d.sent();
                        return [3 /*break*/, 13];
                    case 13:
                        tempName = './.s/' + (0, random_string_1.default)({ length: 20 }) + '.zip';
                        runtime = "nodejs12";
                        return [4 /*yield*/, this.zipCode(baseDir, codeUri, tempName, runtime)];
                    case 14:
                        _d.sent();
                        vm = (0, core_1.spinner)('Publishing');
                        _d.label = 15;
                    case 15:
                        _d.trys.push([15, 18, , 19]);
                        _a = request_promise_1.default;
                        _c = {
                            'method': 'PUT',
                            'url': uploadUrl
                        };
                        _b = 'body';
                        return [4 /*yield*/, core_1.fse.readFileSync(tempName)];
                    case 16: return [4 /*yield*/, _a.apply(void 0, [(_c[_b] = _d.sent(),
                                _c)])];
                    case 17:
                        rpbody = _d.sent();
                        vm.succeed('Published successfully');
                        return [3 /*break*/, 19];
                    case 18:
                        e_6 = _d.sent();
                        vm.fail('Publishing failed');
                        throw new errors_1.CatchableError('Network exception. Please try again later.', e_6.body);
                    case 19:
                        try {
                            // 尝试删除
                            core_1.fse.unlinkSync(tempName);
                        }
                        catch (e) {
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * demo 获取发布的列表
     * @param inputs
     * @returns
     */
    Platform.prototype.list = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var token, apts, comParse, options, rpbody, e_7, result, tempResult, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getToken()];
                    case 1:
                        token = _a.sent();
                        if (!token) {
                            throw new errors_1.CatchableError("Please perform serverless registry through [s cli registry login]", 'Failed to get serverless registry token');
                        }
                        apts = {
                            boolean: ['help'],
                            alias: { help: 'h' },
                        };
                        comParse = (0, core_1.commandParse)({ args: inputs.args }, apts);
                        if (comParse.data && comParse.data.help) {
                            (0, core_1.help)([{
                                    header: 'List',
                                    content: "Query the published packge of the current login account"
                                }, {
                                    header: 'Usage',
                                    content: "$ s cli registry list"
                                }, {
                                    header: 'Examples without Yaml',
                                    content: [
                                        '$ s cli registry list',
                                    ],
                                },]);
                            return [2 /*return*/];
                        }
                        options = {
                            'method': 'POST',
                            'url': 'https://registry.devsapp.cn/center/package/publish',
                            'headers': {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            form: {
                                'safety_code': token
                            }
                        };
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, (0, request_promise_1.default)(options)];
                    case 3:
                        rpbody = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_7 = _a.sent();
                        throw new errors_1.CatchableError('Network exception. Please try again later.', 'Data request exception');
                    case 5:
                        result = [];
                        tempResult = JSON.parse(rpbody);
                        if (tempResult.Response.Error) {
                            throw new errors_1.CatchableError("".concat(tempResult.Response.Error, ": ").concat(tempResult.Response.Message), 'Failed to obtain relevant information');
                        }
                        tempResult = tempResult.Response;
                        for (i = 0; i < tempResult.length; i++) {
                            result.push({
                                package: tempResult[i].package,
                                description: tempResult[i].description,
                                version: tempResult[i].version.tag_name,
                                zipball_url: tempResult[i].version.zipball_url
                            });
                        }
                        if (result) {
                            return [2 /*return*/, result];
                        }
                        logger.info('You haven\'t released Package yet');
                        return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * demo 获取某个组件的版本
     * @param inputs
     * @returns
     */
    Platform.prototype.versions = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var apts, comParse, component, options, rpbody, e_8, result, tempResult, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apts = {
                            boolean: ['help'],
                            alias: { help: 'h' },
                        };
                        comParse = (0, core_1.commandParse)({ args: inputs.args }, apts);
                        if (comParse.data && comParse.data.help) {
                            (0, core_1.help)([{
                                    header: 'Versions',
                                    content: "Query the version information of the specified package"
                                }, {
                                    header: 'Usage',
                                    content: "$ s cli registry versions <options>"
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
                            return [2 /*return*/];
                        }
                        component = comParse.data ? comParse.data.name : null;
                        if (!component) {
                            throw new errors_1.CatchableError('Component name is required.', "Please add --name, like: s cli registry versions --name thinphp");
                        }
                        options = {
                            'method': 'GET',
                            'url': "https://registry.devsapp.cn/simple/".concat(component, "/releases"),
                            'headers': {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, request_promise_1.default)(options)];
                    case 2:
                        rpbody = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_8 = _a.sent();
                        throw new errors_1.CatchableError('Network exception. Please try again later.', 'Data request exception');
                    case 4:
                        result = {
                            "PackageName": component,
                            "Versions": []
                        };
                        tempResult = JSON.parse(rpbody);
                        if (tempResult.Response.Error) {
                            throw new errors_1.CatchableError("".concat(tempResult.Response.Error, ": ").concat(tempResult.Response.Message), 'Failed to obtain relevant information');
                        }
                        tempResult = tempResult.Response;
                        for (i = 0; i < tempResult.length; i++) {
                            result.Versions.push({
                                tag_name: tempResult[i].tag_name,
                                published_at: tempResult[i].published_at,
                                zipball_url: tempResult[i].zipball_url
                            });
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * demo 更新token信息
     * @param inputs
     * @returns
     */
    Platform.prototype.retoken = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var token, apts, comParse, options, rpbody, e_9, tempResult, fd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getToken()];
                    case 1:
                        token = _a.sent();
                        if (!token) {
                            throw new errors_1.CatchableError("Please perform serverless registry through [s cli registry login]", 'Failed to get serverless registry token');
                        }
                        apts = {
                            boolean: ['help'],
                            alias: { help: 'h' },
                        };
                        comParse = (0, core_1.commandParse)({ args: inputs.args }, apts);
                        if (comParse.data && comParse.data.help) {
                            (0, core_1.help)([{
                                    header: 'Retoken',
                                    content: "Reset Serverless Registry login token"
                                }, {
                                    header: 'Usage',
                                    content: "$ s cli registry retoken"
                                }, {
                                    header: 'Examples without Yaml',
                                    content: [
                                        '$ s cli registry retoken',
                                    ],
                                },]);
                            return [2 /*return*/];
                        }
                        options = {
                            'method': 'POST',
                            'url': "https://registry.devsapp.cn/user/update/safetycode",
                            'headers': {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            form: {
                                'safety_code': token
                            }
                        };
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, (0, request_promise_1.default)(options)];
                    case 3:
                        rpbody = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_9 = _a.sent();
                        throw new errors_1.CatchableError('Network exception. Please try again later.', 'Data request exception');
                    case 5:
                        tempResult = JSON.parse(rpbody);
                        if (tempResult.Response.Error) {
                            throw new errors_1.CatchableError("".concat(tempResult.Response.Error, ": ").concat(tempResult.Response.Message), 'Failed to obtain relevant information');
                        }
                        tempResult = tempResult.Response;
                        return [4 /*yield*/, core_1.fse.openSync("".concat((0, core_1.getRootHome)(), "/serverless-devs-platform.dat"), 'w+')];
                    case 6:
                        fd = _a.sent();
                        return [4 /*yield*/, core_1.fse.writeSync(fd, tempResult.safety_code)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, core_1.fse.closeSync(fd)];
                    case 8:
                        _a.sent();
                        logger.log("Serverless Registry login token reset succeeded.", "green");
                        return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * demo 获取token信息
     * @param inputs
     * @returns
     */
    Platform.prototype.token = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var token, apts, comParse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getToken()];
                    case 1:
                        token = _a.sent();
                        if (!token) {
                            throw new errors_1.CatchableError("Please perform serverless registry through [s cli registry login]", 'Failed to get serverless registry token');
                        }
                        apts = {
                            boolean: ['help'],
                            alias: { help: 'h' },
                        };
                        comParse = (0, core_1.commandParse)({ args: inputs.args }, apts);
                        if (comParse.data && comParse.data.help) {
                            (0, core_1.help)([{
                                    header: 'Token',
                                    content: "Get Serverless Registry login token"
                                }, {
                                    header: 'Usage',
                                    content: "$ s cli registry token"
                                }]);
                            return [2 /*return*/];
                        }
                        logger.warn("The `token` is a very important new credential information for you to use Serverless Registry. Please keep it properly. In case of leakage, please use the `retoken` command to regenerate it.");
                        return [2 /*return*/, { "Token": token }];
                }
            });
        });
    };
    /**
     * demo 查询package
     * @param inputs
     * @returns
     */
    Platform.prototype.search = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var apts, comParse, packageType, packageKeyword, options, rpbody, e_10, result, tempResult, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apts = {
                            boolean: ['help'],
                            alias: { help: 'h' },
                        };
                        comParse = (0, core_1.commandParse)({ args: inputs.args }, apts);
                        if (comParse.data && comParse.data.help) {
                            (0, core_1.help)([{
                                    header: 'Search',
                                    content: "Search packages"
                                }, {
                                    header: 'Usage',
                                    content: "$ s cli registry search <options>"
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
                            return [2 /*return*/];
                        }
                        packageType = comParse.data ? comParse.data.type : null;
                        packageKeyword = comParse.data ? comParse.data.keyword : null;
                        if (!packageType) {
                            throw new errors_1.CatchableError('Package type is required, value: Component, Application, Plugin', "Please add --type, like: s cli registry versions --type component");
                        }
                        options = {
                            'method': 'POST',
                            'url': "https://registry.devsapp.cn/package/search",
                            'headers': {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            'form': {
                                "type": packageType,
                                "keyword": packageKeyword
                            }
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, request_promise_1.default)(options)];
                    case 2:
                        rpbody = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_10 = _a.sent();
                        throw new errors_1.CatchableError('Network exception. Please try again later.', 'Data request exception');
                    case 4:
                        result = [];
                        tempResult = JSON.parse(rpbody);
                        if (tempResult.Response.Error) {
                            throw new errors_1.CatchableError("".concat(tempResult.Response.Error, ": ").concat(tempResult.Response.Message), 'Failed to obtain relevant information');
                        }
                        tempResult = tempResult.Response;
                        for (i = 0; i < tempResult.length; i++) {
                            result.push({
                                name: tempResult[i].package,
                                description: tempResult[i].description,
                                version: {
                                    tag_name: tempResult[i].version.tag_name,
                                    published_at: tempResult[i].version.published_at,
                                    zipball_url: tempResult[i].version.zipball_url
                                }
                            });
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return Platform;
}());
exports.default = Platform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxnRUFBa0M7QUFDbEMsNENBQXFCO0FBQ3JCLG9FQUFnQztBQUNoQyw2QkFBMkI7QUFDM0IsbUNBQXdDO0FBQ3hDLDhDQUF3QjtBQUN4QixtQ0FBdUQ7QUFDdkQsOENBQXFHO0FBRXJHLElBQU0sTUFBTSxHQUFHLElBQUksYUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3RDLElBQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFBO0FBRTlCLFNBQVMsS0FBSyxDQUFDLEtBQWE7SUFDeEIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU87UUFDdkIsVUFBVSxDQUFDLGNBQU0sT0FBQSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQWIsQ0FBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzNDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUdEO0lBQUE7SUEyc0JBLENBQUM7SUF6c0JTLDRCQUFTLEdBQWY7Ozs7Z0JBQ0ksSUFBSTtvQkFDTSxXQUFXLEdBQUcsVUFBRyxDQUFDLFlBQVksQ0FBQyxVQUFHLElBQUEsa0JBQVcsR0FBRSxrQ0FBK0IsRUFBRSxPQUFPLENBQUMsQ0FBQztvQkFDL0Ysc0JBQU8sV0FBVyxFQUFBO2lCQUNyQjtnQkFBQyxPQUFPLENBQUMsRUFBRTtvQkFDUixzQkFBTyxJQUFJLEVBQUE7aUJBQ2Q7Ozs7S0FDSjtJQUVLLDhCQUFXLEdBQWpCLFVBQWtCLFFBQVE7Ozs7Z0JBQ3RCLEtBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDdEMsSUFBSTt3QkFDQSxzQkFBTyxVQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxP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