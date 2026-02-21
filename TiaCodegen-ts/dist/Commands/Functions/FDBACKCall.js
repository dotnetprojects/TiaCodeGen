"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FDBACKCall = void 0;
const IOperationOrSignalDirectionWrapper_1 = require("../../Interfaces/IOperationOrSignalDirectionWrapper");
const Direction_1 = require("../../Enums/Direction");
const SystemFunctionBlockCall_1 = require("./Base/SystemFunctionBlockCall");
class FDBACKCall extends SystemFunctionBlockCall_1.SystemFunctionBlockCall {
    constructor(instanceName, on = null, feedback = null, qbad_fio = null, ack_nec = null, ack = null, fdb_time = null, q = null, error = null, ack_req = null, diag = null) {
        super('FDBACK', instanceName, null);
        this.iface['ON'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(on, Direction_1.Direction.Input);
        this.iface['FEEDBACK'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(feedback, Direction_1.Direction.Input);
        this.iface['QBAD_FIO'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(qbad_fio, Direction_1.Direction.Input);
        this.iface['ACK_NEC'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(ack_nec, Direction_1.Direction.Input);
        this.iface['ACK'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(ack, Direction_1.Direction.Input);
        this.iface['FDB_TIME'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(fdb_time, Direction_1.Direction.Input);
        this.iface['Q'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(q, Direction_1.Direction.Output);
        this.iface['ERROR'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(error, Direction_1.Direction.Output);
        this.iface['ACK_REQ'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(ack_req, Direction_1.Direction.Output);
        this.iface['DIAG'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(diag, Direction_1.Direction.Output);
        this.additionalSafetyTemplateValues = `      <TemplateValue Name="f_user_card" Type="Cardinality">1</TemplateValue>
      <TemplateValue Name="f_image_card" Type="Cardinality">0</TemplateValue>`;
        for (const w of Object.values(this.iface)) {
            if (w.operationOrSignal !== null)
                this.children.push(w.operationOrSignal);
        }
    }
}
exports.FDBACKCall = FDBACKCall;
//# sourceMappingURL=FDBACKCall.js.map