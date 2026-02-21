"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemFunctionBlockCall = void 0;
const FunctionBlockCall_1 = require("./FunctionBlockCall");
class SystemFunctionBlockCall extends FunctionBlockCall_1.FunctionBlockCall {
    constructor(functionName, instanceName, eno = null) {
        super(functionName, instanceName, eno);
        this.templateValueName = null;
        this.templateValueType = null;
        this.templateValue = null;
    }
}
exports.SystemFunctionBlockCall = SystemFunctionBlockCall;
//# sourceMappingURL=SystemFunctionBlockCall.js.map