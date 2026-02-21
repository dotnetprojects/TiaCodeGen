"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TONCall = void 0;
const IOperationOrSignalDirectionWrapper_1 = require("../../Interfaces/IOperationOrSignalDirectionWrapper");
const Direction_1 = require("../../Enums/Direction");
const SystemFunctionBlockCall_1 = require("./Base/SystemFunctionBlockCall");
class TONCall extends SystemFunctionBlockCall_1.SystemFunctionBlockCall {
    constructor(instanceName, pt = null, q = null, et = null) {
        super('TON', instanceName, null);
        this.iface['PT'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(pt, Direction_1.Direction.Input);
        this.iface['Q'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(q, Direction_1.Direction.Output);
        this.iface['ET'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(et, Direction_1.Direction.Output);
        this.templateValueName = 'time_type';
        this.templateValueType = 'Type';
        this.templateValue = 'Time';
        this.hasNoEn = true;
        this.safetyTemplateString = `      <TemplateValue Name="f_user_card" Type="Cardinality">1</TemplateValue>
      <TemplateValue Name="f_image_card" Type="Cardinality">0</TemplateValue>
      <TemplateValue Name="f_imageclassic_card" Type="Cardinality">0</TemplateValue>
      <TemplateValue Name="f_imageplus_card" Type="Cardinality">0</TemplateValue>
      <TemplateValue Name="codedbool_type" Type="Type">DInt</TemplateValue>`;
        for (const w of Object.values(this.iface)) {
            if (w.operationOrSignal !== null)
                this.children.push(w.operationOrSignal);
        }
    }
}
exports.TONCall = TONCall;
//# sourceMappingURL=TONCall.js.map