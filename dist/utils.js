"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.objectDeepTransfromString = exports.getTargetTriggers = exports.transfromTriggerConfig = exports.sleep = exports.promptForConfirmOrDetails = exports.tableShow = exports.getStateFilePath = exports.checkBuildAvailable = exports.formatArgs = exports.generateResourceName = exports.extract = exports.capitalizeFirstLetter = exports.hasHttpPrefix = exports.createProgressBar = void 0;
var core = __importStar(require("@serverless-devs/core"));
var progress_1 = __importDefault(require("progress"));
var path_1 = __importDefault(require("path"));
var crypto_1 = __importDefault(require("crypto"));
var lodash_1 = __importDefault(require("lodash"));
var tty_table_1 = __importDefault(require("tty-table"));
var fse = core.fse, colors = core.colors, inquirer = core.inquirer;
var green = colors.green, white = colors.white;
function createProgressBar(format, options) {
    var opts = Object.assign({
        complete: green('█'),
        incomplete: white('█'),
        width: 20,
        clear: true,
    }, options);
    var bar = new progress_1.default(format, opts);
    var old = bar.tick;
    var loadingChars = ['⣴', '⣆', '⢻', '⢪', '⢫'];
    // @ts-ignore
    bar.tick = function (len, tokens) {
        var newTokens = Object.assign({
            loading: loadingChars[Math.random() * 5],
        }, tokens);
        old.call(bar, len, newTokens);
    };
    return bar;
}
exports.createProgressBar = createProgressBar;
function hasHttpPrefix(s) {
    return s.startsWith('http://');
}
exports.hasHttpPrefix = hasHttpPrefix;
function capitalizeFirstLetter(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
exports.capitalizeFirstLetter = capitalizeFirstLetter;
function extract(regex, endpoint, idx) {
    var matchs = endpoint.match(regex);
    if (matchs) {
        return matchs[idx];
    }
    return null;
}
exports.extract = extract;
function generateResourceName(serviceName, region, accountID) {
    var prefix = serviceName.slice(0, 6);
    var md5Uid = crypto_1.default.createHmac('md5', accountID).update(serviceName).digest('hex');
    return "".concat(prefix, "-").concat(md5Uid.slice(0, 7), "-").concat(region);
}
exports.generateResourceName = generateResourceName;
function formatArgs(args) {
    // 去除 args 的行首以及行尾的空格
    return (args ? args.replace(/(^\s*)|(\s*$)/g, '') : '');
}
exports.formatArgs = formatArgs;
/**
 * 检测 build 是否可用
 * @param serviceName 服务名称
 * @param functionName 函数名称
 */
function checkBuildAvailable(serviceName, functionName, baseDir) {
    if (baseDir === void 0) { baseDir = process.cwd(); }
    return __awaiter(this, void 0, void 0, function () {
        var statusId, statusPath, status;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    statusId = "".concat(serviceName, "-").concat(functionName, "-build");
                    statusPath = path_1.default.join(baseDir, '.s', 'fc-build');
                    return [4 /*yield*/, core.getState(statusId, statusPath)];
                case 1:
                    status = ((_a.sent()) || {}).status;
                    if (status === 'unavailable') {
                        throw new Error("".concat(serviceName, "/").concat(functionName, " build status is unavailable.Please re-execute 's build'"));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.checkBuildAvailable = checkBuildAvailable;
/**
 * 获取缓存文件保存的路径（需要和core.setState的路径实现保持一致）
 * @param id stateId
 * @param dirPath 保存路径
 * @returns 缓存文件路径
 */
function getStateFilePath(id, dirPath) {
    var templateFile = process.env.templateFile;
    var spath = fse.existsSync(templateFile)
        ? path_1.default.join(path_1.default.dirname(templateFile), '.s')
        : path_1.default.join(process.cwd(), '.s');
    fse.ensureDirSync(spath);
    var temp = dirPath ? path_1.default.resolve(spath, dirPath) : spath;
    return path_1.default.join(temp, "".concat(id, ".json"));
}
exports.getStateFilePath = getStateFilePath;
var tableShow = function (data, showKey) {
    var options = {
        borderStyle: 'solid',
        borderColor: 'blue',
        headerAlign: 'center',
        align: 'left',
        color: 'cyan',
        width: '100%',
    };
    var header_option = {
        headerColor: 'cyan',
        color: 'cyan',
        align: 'left',
        width: 'auto',
        formatter: function (value) { return value; },
    };
    var header = showKey.map(function (value) { return (!lodash_1.default.isString() ? (__assign(__assign({}, header_option), { value: value })) : (__assign(__assign({}, header_option), value))); });
    // eslint-disable-next-line no-console
    console.log((0, tty_table_1.default)(header, data, options).render());
};
exports.tableShow = tableShow;
function promptForConfirmOrDetails(message) {
    return __awaiter(this, void 0, void 0, function () {
        var answers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer.prompt([{
                            type: 'list',
                            name: 'prompt',
                            message: message,
                            choices: ['yes', 'no'],
                        }])];
                case 1:
                    answers = _a.sent();
                    return [2 /*return*/, answers.prompt === 'yes'];
            }
        });
    });
}
exports.promptForConfirmOrDetails = promptForConfirmOrDetails;
var sleep = function (ms) {
    if (ms === void 0) { ms = 1000; }
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
exports.sleep = sleep;
function transfromTriggerConfig(triggerConfig, region, accountId) {
    var name = triggerConfig.name, type = triggerConfig.type, config = triggerConfig.config, qualifier = triggerConfig.qualifier, role = triggerConfig.role, sourceArn = triggerConfig.sourceArn;
    if (lodash_1.default.isString(sourceArn) && !lodash_1.default.isNil(sourceArn)) {
        return {
            triggerName: name,
            triggerType: type,
            triggerConfig: config,
            invocationRole: role,
            qualifier: qualifier,
            sourceArn: sourceArn,
        };
    }
    var arn;
    if (type === 'oss') {
        arn = "acs:oss:".concat(region, ":").concat(accountId, ":").concat(config.bucketName);
    }
    else if (type === 'log') {
        arn = "acs:log:".concat(region, ":").concat(accountId, ":project/").concat(config.logConfig.project);
    }
    else if (type === 'mns_topic') {
        arn = "acs:mns:".concat(config.region ? config.region : region, ":").concat(accountId, ":/topics/").concat(config.topicName);
    }
    else if (type === 'cdn_events') {
        arn = "acs:cdn:*:".concat(accountId);
    }
    else if (type === 'tablestore') {
        arn = "acs:ots:".concat(region, ":").concat(accountId, ":instance/").concat(config.instanceName, "/table/").concat(config.tableName);
    }
    return {
        triggerName: name,
        triggerType: type,
        triggerConfig: config,
        invocationRole: role,
        qualifier: qualifier,
        sourceArn: arn,
    };
}
exports.transfromTriggerConfig = transfromTriggerConfig;
function getTargetTriggers(sourceTriggers, onlyDelpoyTriggerName) {
    var needDeployTriggers = [];
    if (lodash_1.default.isString(onlyDelpoyTriggerName)) {
        needDeployTriggers = sourceTriggers.filter(function (_a) {
            var name = _a.name;
            return name === onlyDelpoyTriggerName;
        });
        if (lodash_1.default.isEmpty(needDeployTriggers)) {
            throw new Error("Not found trigger: ".concat(onlyDelpoyTriggerName));
        }
    }
    else {
        var needDeployTriggersName = [];
        for (var _i = 0, sourceTriggers_1 = sourceTriggers; _i < sourceTriggers_1.length; _i++) {
            var triggerConfig = sourceTriggers_1[_i];
            if (onlyDelpoyTriggerName.includes(triggerConfig.name)) {
                needDeployTriggers.push(triggerConfig);
                needDeployTriggersName.push(triggerConfig.name);
            }
        }
        var xor = lodash_1.default.xor(needDeployTriggersName, onlyDelpoyTriggerName);
        if (!lodash_1.default.isEmpty(xor)) {
            throw new Error("Not found trigger: ".concat(xor.toString()));
        }
    }
    return needDeployTriggers;
}
exports.getTargetTriggers = getTargetTriggers;
/**
 * 深度遍历转化为字符串类型
 * @param source object
 * @returns object
 */
function objectDeepTransfromString(source) {
    if (lodash_1.default.isArray(source)) {
        return source.map(function (value) {
            if (typeof value === 'object') {
                return objectDeepTransfromString(value);
            }
            return value === null || value === void 0 ? void 0 : value.toString();
        });
    }
    if (lodash_1.default.isObject(source)) {
        return lodash_1.default.mapValues(source, function (value) {
            if (typeof value === 'object') {
                return objectDeepTransfromString(value);
            }
            // @ts-ignore 不是 object 类型尝试 toString 强制转换为字符串
            return value === null || value === void 0 ? void 0 : value.toString();
        });
    }
    return source;
}
exports.objectDeepTransfromString = objectDeepTransfromString;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMERBQThDO0FBQzlDLHNEQUFtQztBQUNuQyw4Q0FBd0I7QUFDeEIsa0RBQTRCO0FBQzVCLGtEQUF1QjtBQUN2Qix3REFBOEI7QUFFdEIsSUFBQSxHQUFHLEdBQXVCLElBQUksSUFBM0IsRUFBRSxNQUFNLEdBQWUsSUFBSSxPQUFuQixFQUFFLFFBQVEsR0FBSyxJQUFJLFNBQVQsQ0FBVTtBQUMvQixJQUFBLEtBQUssR0FBWSxNQUFNLE1BQWxCLEVBQUUsS0FBSyxHQUFLLE1BQU0sTUFBWCxDQUFZO0FBRWhDLFNBQWdCLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxPQUFPO0lBQy9DLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDekIsUUFBUSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDcEIsVUFBVSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDdEIsS0FBSyxFQUFFLEVBQUU7UUFDVCxLQUFLLEVBQUUsSUFBSTtLQUNaLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDWixJQUFNLEdBQUcsR0FBRyxJQUFJLGtCQUFXLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzFDLElBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFDckIsSUFBTSxZQUFZLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDL0MsYUFBYTtJQUNiLEdBQUcsQ0FBQyxJQUFJLEdBQUcsVUFBQyxHQUFHLEVBQUUsTUFBTTtRQUNyQixJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1lB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