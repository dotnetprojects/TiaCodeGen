"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionBlockCall = void 0;
const FunctionCall_1 = require("./FunctionCall");
class FunctionBlockCall extends FunctionCall_1.FunctionCall {
    constructor(functionName, instanceName, eno = null) {
        super(functionName, eno);
        this.instanceName = instanceName;
    }
}
exports.FunctionBlockCall = FunctionBlockCall;
//# sourceMappingURL=FunctionBlockCall.js.map