"use strict";
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
exports.pack = void 0;
var path = __importStar(require("path"));
var core = __importStar(require("@serverless-devs/core"));
var _ = __importStar(require("lodash"));
var utils_1 = require("./utils");
var file_1 = require("./file");
var logger_1 = __importDefault(require("./common/logger"));
var fse = core.fse, colors = core.colors, archiver = core.archiver;
var green = colors.green, grey = colors.grey;
var isWindows = process.platform === 'win32';
function pack(file, codeignore, zipPath) {
    return __awaiter(this, void 0, void 0, function () {
        var compressedSize, zipFileHash, zipPathWithMd5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, packTo(file, codeignore, zipPath, "package/")];
                case 1:
                    compressedSize = (_a.sent()).compressedSize;
                    return [4 /*yield*/, (0, file_1.getFileHash)(zipPath)];
                case 2:
                    zipFileHash = _a.sent();
                    zipPathWithMd5 = path.join(path.dirname(zipPath), "".concat(path.basename(zipPath) || zipFileHash));
                    return [4 /*yield*/, fse.rename(zipPath, zipPathWithMd5)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, {
                            filePath: zipPathWithMd5,
                            fileSizeInBytes: compressedSize,
                            fileHash: zipFileHash,
                        }];
            }
        });
    });
}
exports.pack = pack;
function packTo(file, codeignore, targetPath, prefix, zlibOptions) {
    if (prefix === void 0) { prefix = ''; }
    if (zlibOptions === void 0) { zlibOptions = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var stats, bar, output, zipArchiver, count, asbFilePath, isBootstrap;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fse.pathExists(file)];
                case 1:
                    if (!(_a.sent())) {
                        throw new Error("Zip file ".concat(file, " is not exist."));
                    }
                    return [4 /*yield*/, fse.lstat(file)];
                case 2:
                    stats = _a.sent();
                    if (codeignore && codeignore(file)) {
                        throw new Error("File ".concat(file, " is ignored."));
                    }
                    bar = (0, utils_1.createProgressBar)("".concat(green(':zipping'), " :bar :current/:total :rate files/s, :percent :etas"), { total: 0 });
                    output = fse.createWriteStream(targetPath);
                    zipArchiver = archiver('zip', {
                        zlib: _.merge({
                            level: 6,
                        }, zlibOptions),
                    }).on('progress', function (progress) {
                        bar.total = progress.entries.total;
                        bar.tick({
                            total: progress.entries.processed,
                        });
                    }).on('warning', function (err) {
                        logger_1.default.log(err, 'yellow');
                    }).on('error', function (err) {
                        logger_1.default.log("    ".concat(green('x'), " ").concat(targetPath, " - ").concat(grey('zip error')), 'red');
                        throw err;
                    });
                    // copied from https://github.com/archiverjs/node-archiver/blob/master/lib/core.js#L834-L877
                    // but add mode support
                    zipArchiver.symlink = function (filepath, target, _a) {
                        var mode = _a.mode;
                        var data = Object.assign({}, {
                            type: 'symlink',
                            name: filepath.replace(/\\/g, '/'),
                            linkname: target.replace(/\\/g, '/'),
                            sourceType: 'buffer',
                        });
                        if (mode) {
                            Object.assign(data, {
                                mode: mode,
                            });
                        }
                        this._entriesCount++;
                        this._queue.push({
                            data: data,
                            source: Buffer.alloc(0),
                        });
                        return this;
                    };
                    zipArchiver.pipe(output);
                    asbFilePath = path.resolve(file);
                    isBootstrap = isBootstrapPath(asbFilePath, asbFilePath, true);
                    if (!stats.isFile()) return [3 /*break*/, 3];
                    zipArchiver.file(asbFilePath, {
                        name: path.basename(file),
                        prefix: prefix,
                        mode: (isBootstrap || isWindows) ? stats.mode | 73 : stats.mode, // add execution permission, the binary of 73 is 001001001
                    });
                    count = 1;
                    return [3 /*break*/, 6];
                case 3:
                    if (!stats.isDirectory()) return [3 /*break*/, 5];
                    return [4 /*yield*/, zipFolder(zipArchiver, file, [], codeignore, file, prefix)];
                case 4:
                    count = _a.sent();
                    return [3 /*break*/, 6];
                case 5: throw new Error("File ".concat(file, " must be a regular file or directory."));
                case 6: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        output.on('close', function () {
                            var compressedSize = zipArchiver.pointer();
                            resolve({ count: count, compressedSize: compressedSize });
                        });
                        try {
                            zipArchiver.finalize();
                        }
                        catch (err) {
                            reject(err);
                        }
                    })];
                case 7: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function zipFolder(zipArchiver, folder, folders, codeignore, codeUri, prefix) {
    if (prefix === void 0) { prefix = ''; }
    return __awaiter(this, void 0, void 0, function () {
        var absCodeUri, dir, dirItems, absDir, relativeFromCodeUri;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    folders.push(folder);
                    absCodeUri = path.resolve(codeUri);
                    dir = path.join.apply(path, folders);
                    return [4 /*yield*/, fse.readdir(dir)];
                case 1:
                    dirItems = _a.sent();
                    absDir = path.resolve(dir);
                    relativeFromCodeUri = path.relative(absCodeUri, absDir);
                    if (!_.isEmpty(relativeFromCodeUri)) {
                        zipArchiver.append(null, {
                            name: relativeFromCodeUri,
                            type: 'directory',
                            prefix: prefix,
                        });
                    }
                    return [4 /*yield*/, Promise.all(dirItems.map(function (f) { return __awaiter(_this, void 0, void 0, function () {
                            var fPath, s, error_1, absFilePath, relative, isBootstrap, content, target;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        fPath = path.join(dir, f);
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, fse.lstat(fPath)];
                                    case 2:
                                        s = _a.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_1 = _a.sent();
                                        return [2 /*return*/, 0];
                                    case 4:
                                        if (codeignore && codeignore(fPath)) {
                                            core.Logger.debug('REGISTRY', "file ".concat(fPath, " is ignored."));
                                            return [2 /*return*/, 0];
                                        }
                                        absFilePath = path.resolve(fPath);
                                        relative = path.relative(absCodeUri, absFilePath);
                                        isBootstrap = isBootstrapPath(absFilePath, absCodeUri, false);
                                        if (!(s.size === 1067)) return [3 /*break*/, 6];
                                        return [4 /*yield*/, (0, file_1.readLines)(fPath)];
                                    case 5:
                                        content = _a.sent();
                                        if (_.head(content) === 'XSym' && content.length === 5) {
                                            target = content[3];
                                            zipArchiver.symlink(relative, target, {
                                                mode: (isBootstrap || isWindows) ? s.mode | 73 : s.mode,
                                            });
                                            return [2 /*return*/, 1];
                                        }
                                        _a.label = 6;
                                    case 6:
                                        if (!(s.isFile() || s.isSymbolicLink())) return [3 /*break*/, 7];
                                        zipArchiver.file(fPath, {
                                            name: relative,
                                            prefix: prefix,
                                            mode: (isBootstrap || isWindows) ? s.mode | 73 : s.mode,
                                            stats: s, // The archiver uses fse.stat by default, and pasing the result of lstat to ensure that the symbolic link is properly packaged
                                        });
                                        return [2 /*return*/, 1];
                                    case 7:
                                        if (!s.isDirectory()) return [3 /*break*/, 9];
                                        return [4 /*yield*/, zipFolder(zipArchiver, f, folders.slice(), codeignore, codeUri, prefix)];
                                    case 8: return [2 /*return*/, _a.sent()];
                                    case 9:
                                        logger_1.default.log("Ignore file ".concat(absFilePath, ", because it isn't a file, symbolic link or directory"), 'red');
                                        return [2 /*return*/, 0];
                                }
                            });
                        }); }))];
                case 2: return [2 /*return*/, (_a.sent()).reduce((function (sum, curr) { return sum + curr; }), 0)];
            }
        });
    });
}
function isBootstrapPath(absFilePath, absCodeUri, isFile) {
    if (isFile === void 0) { isFile = true; }
    var absBootstrapDir;
    if (isFile) {
        absBootstrapDir = path.dirname(absCodeUri);
    }
    else {
        absBootstrapDir = absCodeUri;
    }
    return path.join(absBootstrapDir, 'bootstrap') === absFilePath;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiemlwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3ppcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBQTZCO0FBQzdCLDBEQUE4QztBQUM5Qyx3Q0FBNEI7QUFDNUIsaUNBQTBDO0FBQzFDLCtCQUE4QztBQUM5QywyREFBcUM7QUFFOUIsSUFBQSxHQUFHLEdBQXNCLElBQUksSUFBMUIsRUFBRSxNQUFNLEdBQWMsSUFBSSxPQUFsQixFQUFFLFFBQVEsR0FBSSxJQUFJLFNBQVIsQ0FBUztBQUM5QixJQUFBLEtBQUssR0FBVSxNQUFNLE1BQWhCLEVBQUUsSUFBSSxHQUFJLE1BQU0sS0FBVixDQUFXO0FBRzdCLElBQU0sU0FBUyxHQUFZLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxDQUFDO0FBRXhELFNBQXNCLElBQUksQ0FBQyxJQUFZLEVBQUUsVUFBZSxFQUFFLE9BQVk7Ozs7O3dCQUd6QyxxQkFBTSxNQUFNLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLEVBQUE7O29CQUFyRSxjQUFjLEdBQUksQ0FBQSxTQUFtRCxDQUFBLGVBQXZEO29CQUdELHFCQUFNLElBQUEsa0JBQVcsRUFBQyxPQUFPLENBQUMsRUFBQTs7b0JBQXhDLFdBQVcsR0FBRyxTQUEwQjtvQkFDeEMsY0FBYyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxVQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksV0FBVyxDQUFFLENBQUMsQ0FBQztvQkFDcEcscUJBQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLEVBQUE7O29CQUF6QyxTQUF5QyxDQUFDO29CQUUxQyxzQkFBTzs0QkFDSCxRQUFRLEVBQUUs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