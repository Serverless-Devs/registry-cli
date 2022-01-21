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
exports.getFileSize = exports.getFileHash = exports.readLines = void 0;
var readline_1 = __importDefault(require("readline"));
var md5_file_1 = __importDefault(require("md5-file"));
var core = __importStar(require("@serverless-devs/core"));
var fse = core.fse;
function readLines(fileName) {
    return new Promise(function (resolve, reject) {
        var lines = [];
        readline_1.default.createInterface({ input: fse.createReadStream(fileName) })
            .on('line', function (line) { return lines.push(line); })
            .on('close', function () { return resolve(lines); })
            .on('error', reject);
    });
}
exports.readLines = readLines;
function getFileHash(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, isFile(filePath)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, md5_file_1.default)(filePath)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3: throw new Error("Get file hash error, target is not a file, target path is: ".concat(filePath));
            }
        });
    });
}
exports.getFileHash = getFileHash;
function isFile(inputPath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pathJudge(inputPath, 'isFile')];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function pathJudge(inputPath, type) {
    return __awaiter(this, void 0, void 0, function () {
        var stats, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fse.lstat(inputPath)];
                case 1:
                    stats = _a.sent();
                    switch (type) {
                        case 'exists': return [2 /*return*/, true];
                        case 'isFile': return [2 /*return*/, stats.isFile()];
                        case 'isDir': return [2 /*return*/, stats.isDirectory()];
                        default: throw new Error('Unsupported type in pathJudge function.');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    if (error_1.code === 'ENOENT') {
                        return [2 /*return*/, false];
                    }
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getFileSize(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var stat;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fse.lstat(filePath)];
                case 1:
                    stat = _a.sent();
                    return [2 /*return*/, stat.size];
            }
        });
    });
}
exports.getFileSize = getFileSize;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9maWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzREFBZ0M7QUFDaEMsc0RBQStCO0FBQy9CLDBEQUE4QztBQUV0QyxJQUFBLEdBQUcsR0FBSyxJQUFJLElBQVQsQ0FBVTtBQUVyQixTQUFnQixTQUFTLENBQUMsUUFBZ0I7SUFDeEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1FBQ2pDLElBQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUVqQixrQkFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQzthQUNoRSxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQUMsSUFBSSxJQUFLLE9BQUEsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBaEIsQ0FBZ0IsQ0FBQzthQUN0QyxFQUFFLENBQUMsT0FBTyxFQUFFLGNBQU0sT0FBQSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQWQsQ0FBYyxDQUFDO2FBQ2pDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDekIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBVEQsOEJBU0M7QUFFRCxTQUFzQixXQUFXLENBQUMsUUFBZ0I7Ozs7d0JBQzVDLHFCQUFNLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBQTs7eUJBQXRCLFNBQXNCLEVBQXRCLHdCQUFzQjtvQkFDakIscUJBQU0sSUFBQSxrQkFBTyxFQUFDLFFBQVEsQ0FBQyxFQUFBO3dCQUE5QixzQkFBTyxTQUF1QixFQUFDO3dCQUVqQyxNQUFNLElBQUksS0FBSyxDQUFDLHFFQUErRCxRQUFRLENBQUUsQ0FBQyxDQUFDOzs7O0NBQzVGO0FBTEQsa0NBS0M7QUFFRCxTQUFlLE1BQU0sQ0FBQyxTQUFTOzs7O3dCQUN0QixxQkFBTSxTQUFTLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxFQUFBO3dCQUEzQyxzQkFBTyxTQUFvQyxFQUFDOzs7O0NBQzdDO0FBRUQsU0FBZSxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUk7Ozs7Ozs7b0JBRXRCLHFCQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUE7O29CQUFsQyxLQUFLLEdBQUcsU0FBMEI7b0JBQ3hDLFFBQVEsSUFBSSxFQUFFO3dCQUNaLEtBQUssUUFBUSxDQUFDLENBQUMsc0JBQU8sSUFBSSxFQUFDO3dCQUMzQixLQUFLLFFBQVEsQ0FBQyxDQUFDLHNCQUFPLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBQzt3QkFDckMsS0FBSyxPQUFPLENBQUMsQ0FBQyxzQkFBTyxLQUFLLENBQUMsV0FBVyxFQUFFLEVBQUM7d0JBQ3pDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMseUNBQXlDLENBQUMsQ0FBQztxQkFDckU7Ozs7b0JBRUQsSUFBSSxPQUFLLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTt3QkFDM0Isc0JBQU8sS0FBSyxFQUFDO3FCQUNkO29CQUNELE1BQU0sT0FBSyxDQUFDOzs7OztDQUVmO0FBRUQsU0FBc0IsV0FBVyxDQUFDLFFBQVE7Ozs7O3dCQUMzQixxQkFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFBOztvQkFBaEMsSUFBSSxHQUFHLFNBQXlCO29CQUN0QyxzQkFBTyxJQUFJLENBQUMsSUFBSSxFQUFDOzs7O0NBQ2xCO0FBSEQsa0NBR0MifQ==