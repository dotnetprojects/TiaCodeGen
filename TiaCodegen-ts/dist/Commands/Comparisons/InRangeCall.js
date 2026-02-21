"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InRangeCall = void 0;
const IOperationOrSignalDirectionWrapper_1 = require("../../Interfaces/IOperationOrSignalDirectionWrapper");
const Direction_1 = require("../../Enums/Direction");
const SystemFunctionCall_1 = require("../Functions/Base/SystemFunctionCall");
class InRangeCall extends SystemFunctionCall_1.SystemFunctionCall {
    constructor(min, inParam, max, out, eno = null) {
        super('InRange', eno);
        this.disableEno = false;
        this.iface['min'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(min, Direction_1.Direction.Input);
        this.iface['in'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(inParam, Direction_1.Direction.Input);
        this.iface['max'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(max, Direction_1.Direction.Input);
        this.iface['out'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(out, Direction_1.Direction.Output);
        for (const w of Object.values(this.iface)) {
            if (w.operationOrSignal !== null)
                this.children.push(w.operationOrSignal);
        }
    }
}
exports.InRangeCall = InRangeCall;
//# sourceMappingURL=InRangeCall.js.map