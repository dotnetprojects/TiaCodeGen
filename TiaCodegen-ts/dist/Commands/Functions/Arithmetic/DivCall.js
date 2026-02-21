"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivCall = void 0;
const IOperationOrSignalDirectionWrapper_1 = require("../../../Interfaces/IOperationOrSignalDirectionWrapper");
const Direction_1 = require("../../../Enums/Direction");
const ArithmeticCall_1 = require("./ArithmeticCall");
class DivCall extends ArithmeticCall_1.ArithmeticCall {
    constructor(type, in1, in2, out1 = null, eno = null) {
        super('Div', eno);
        this.disableEno = true;
        this.type = type;
        this.iface['IN1'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in1, Direction_1.Direction.Input);
        this.iface['IN2'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in2, Direction_1.Direction.Input);
        this.iface['OUT'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(out1, Direction_1.Direction.Output);
        for (const w of Object.values(this.iface)) {
            if (w.operationOrSignal !== null)
                this.children.push(w.operationOrSignal);
        }
    }
}
exports.DivCall = DivCall;
//# sourceMappingURL=DivCall.js.map