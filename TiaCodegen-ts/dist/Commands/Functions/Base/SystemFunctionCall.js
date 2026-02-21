"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemFunctionCall = void 0;
const FunctionCall_1 = require("./FunctionCall");
class SystemFunctionCall extends FunctionCall_1.FunctionCall {
    constructor(functionName, eno = null) {
        super(functionName, eno);
    }
}
exports.SystemFunctionCall = SystemFunctionCall;
//# sourceMappingURL=SystemFunctionCall.js.map