"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FTrigCall = void 0;
const IOperationOrSignalDirectionWrapper_1 = require("../../Interfaces/IOperationOrSignalDirectionWrapper");
const Direction_1 = require("../../Enums/Direction");
const SystemFunctionBlockCall_1 = require("./Base/SystemFunctionBlockCall");
class FTrigCall extends SystemFunctionBlockCall_1.SystemFunctionBlockCall {
    constructor(instanceName, clk = null, q = null, eno = null) {
        super('F_TRIG', instanceName, eno);
        this.iface['CLK'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(clk, Direction_1.Direction.Input);
        this.iface['Q'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(q, Direction_1.Direction.Output);
        for (const w of Object.values(this.iface)) {
            if (w.operationOrSignal !== null)
                this.children.push(w.operationOrSignal);
        }
    }
}
exports.FTrigCall = FTrigCall;
//# sourceMappingURL=FTrigCall.js.map