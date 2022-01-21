"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatchableError = void 0;
var CatchableError = /** @class */ (function (_super) {
    __extends(CatchableError, _super);
    function CatchableError(tips, message) {
        var _this = _super.call(this, JSON.stringify({
            message: message,
            tips: tips,
        })) || this;
        _this.name = "CatchableError";
        return _this;
    }
    return CatchableError;
}(Error));
exports.CatchableError = CatchableError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Vycm9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtJQUFvQyxrQ0FBSztJQUNyQyx3QkFBWSxJQUFJLEVBQUUsT0FBZ0I7UUFBbEMsWUFDSSxrQkFDSSxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ1gsT0FBTyxTQUFBO1lBQ1AsSUFBSSxNQUFBO1NBQ1AsQ0FBQyxDQUNMLFNBRUo7UUFERyxLQUFJLENBQUMsSUFBSSxHQUFHLGdCQUFnQixDQUFDOztJQUNqQyxDQUFDO0lBQ0wscUJBQUM7QUFBRCxDQUFDLEFBVkQsQ0FBb0MsS0FBSyxHQVV4QztBQVZZLHdDQUFjIn0=