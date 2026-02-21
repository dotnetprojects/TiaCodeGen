"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CTUDCall = void 0;
const IOperationOrSignalDirectionWrapper_1 = require("../../Interfaces/IOperationOrSignalDirectionWrapper");
const Direction_1 = require("../../Enums/Direction");
const SystemFunctionBlockCall_1 = require("./Base/SystemFunctionBlockCall");
class CTUDCall extends SystemFunctionBlockCall_1.SystemFunctionBlockCall {
    constructor(instanceName, cd = null, r = null, ld = null, pv = null, qu = null, qd = null, cv = null, templateValue = 'Int') {
        super('CTUD', instanceName, null);
        this.iface['CD'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(cd, Direction_1.Direction.Input);
        this.iface['R'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(r, Direction_1.Direction.Input);
        this.iface['LD'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(ld, Direction_1.Direction.Input);
        this.iface['PV'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(pv, Direction_1.Direction.Input);
        this.iface['QU'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(qu, Direction_1.Direction.Output);
        this.iface['QD'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(qd, Direction_1.Direction.Output);
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
exports.CTUDCall = CTUDCall;
//# sourceMappingURL=CTUDCall.js.map