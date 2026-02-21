"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CTUCall = void 0;
const IOperationOrSignalDirectionWrapper_1 = require("../../Interfaces/IOperationOrSignalDirectionWrapper");
const Direction_1 = require("../../Enums/Direction");
const SystemFunctionBlockCall_1 = require("./Base/SystemFunctionBlockCall");
class CTUCall extends SystemFunctionBlockCall_1.SystemFunctionBlockCall {
    constructor(instanceName, r = null, pv = null, q = null, cv = null, templateValue = 'Int') {
        super('CTU', instanceName, null);
        this.iface['R'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(r, Direction_1.Direction.Input);
        this.iface['PV'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(pv, Direction_1.Direction.Input);
        this.iface['Q'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(q, Direction_1.Direction.Output);
        this.iface['CV'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(cv, Direction_1.Direction.Output);
        this.templateValueName = 'value_type';
        this.templateValueType = 'Type';
        this.templateValue = templateValue;
        this.hasNoEn = true;
        for (const w of Object.values(this.iface)) {
            if (w.operationOrSignal !== null)
                this.children.push(w.operationOrSignal);
        }
    }
}
exports.CTUCall = CTUCall;
//# sourceMappingURL=CTUCall.js.map