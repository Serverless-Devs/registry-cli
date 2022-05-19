"use strict";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiemlwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3ppcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUE2QjtBQUM3QiwwREFBOEM7QUFDOUMsd0NBQTRCO0FBQzVCLGlDQUEwQztBQUMxQywrQkFBOEM7QUFDOUMsMkRBQXFDO0FBRTlCLElBQUEsR0FBRyxHQUFzQixJQUFJLElBQTFCLEVBQUUsTUFBTSxHQUFjLElBQUksT0FBbEIsRUFBRSxRQUFRLEdBQUksSUFBSSxTQUFSLENBQVM7QUFDOUIsSUFBQSxLQUFLLEdBQVUsTUFBTSxNQUFoQixFQUFFLElBQUksR0FBSSxNQUFNLEtBQVYsQ0FBVztBQUc3QixJQUFNLFNBQVMsR0FBWSxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQztBQUV4RCxTQUFzQixJQUFJLENBQUMsSUFBWSxFQUFFLFVBQWUsRUFBRSxPQUFZOzs7Ozt3QkFHekMscUJBQU0sTUFBTSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxFQUFBOztvQkFBckUsY0FBYyxHQUFJLENBQUEsU0FBbUQsQ0FBQSxlQUF2RDtvQkFHRCxxQkFBTSxJQUFBLGtCQUFXLEVBQUMsT0FBTyxDQUFDLEVBQUE7O29CQUF4QyxXQUFXLEdBQUcsU0FBMEI7b0JBQ3hDLGNBQWMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsVUFBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLFdBQVcsQ0FBRSxDQUFDLENBQUM7b0JBQ3BHLHFCQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxFQUFBOztvQkFBekMsU0FBeUMsQ0FBQztvQkFFMUMsc0JBQU87NEJBQ0gsUUFBUSxF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