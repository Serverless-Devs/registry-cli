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
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBEQUE4QztBQUM5QyxzREFBbUM7QUFDbkMsOENBQXdCO0FBQ3hCLGtEQUE0QjtBQUM1QixrREFBdUI7QUFDdkIsd0RBQThCO0FBRXRCLElBQUEsR0FBRyxHQUF1QixJQUFJLElBQTNCLEVBQUUsTUFBTSxHQUFlLElBQUksT0FBbkIsRUFBRSxRQUFRLEdBQUssSUFBSSxTQUFULENBQVU7QUFDL0IsSUFBQSxLQUFLLEdBQVksTUFBTSxNQUFsQixFQUFFLEtBQUssR0FBSyxNQUFNLE1BQVgsQ0FBWTtBQUVoQyxTQUFnQixpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsT0FBTztJQUMvQyxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ3pCLFFBQVEsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQ3BCLFVBQVUsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQ3RCLEtBQUssRUFBRSxFQUFFO1FBQ1QsS0FBSyxFQUFFLElBQUk7S0FDWixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ1osSUFBTSxHQUFHLEdBQUcsSUFBSSxrQkFBVyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMxQyxJQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO0lBQ3JCLElBQU0sWUFBWSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQy9DLGFBQWE7SUFDYixHQUFHLENBQUMsSUFBSSxHQUFHLFVBQUMsR0FBRyxFQUFFLE1BQU07UUFDckIsSUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FB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