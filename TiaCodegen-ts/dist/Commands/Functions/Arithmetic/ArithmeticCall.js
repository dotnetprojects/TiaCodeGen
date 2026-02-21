"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArithmeticCall = void 0;
const SystemFunctionCall_1 = require("../Base/SystemFunctionCall");
class ArithmeticCall extends SystemFunctionCall_1.SystemFunctionCall {
    constructor(functionName, eno = null) {
        super(functionName, eno);
        this.type = '';
    }
}
exports.ArithmeticCall = ArithmeticCall;
//# sourceMappingURL=ArithmeticCall.js.map