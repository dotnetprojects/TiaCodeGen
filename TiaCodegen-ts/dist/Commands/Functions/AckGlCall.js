"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AckGlCall = void 0;
const IOperationOrSignalDirectionWrapper_1 = require("../../Interfaces/IOperationOrSignalDirectionWrapper");
const Direction_1 = require("../../Enums/Direction");
const SystemFunctionBlockCall_1 = require("./Base/SystemFunctionBlockCall");
class AckGlCall extends SystemFunctionBlockCall_1.SystemFunctionBlockCall {
    constructor(instanceName, ackGlob = null, eno = null) {
        super('ACK_GL', instanceName, eno);
        this.iface['ACK_GLOB'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(ackGlob, Direction_1.Direction.Input);
        this.additionalSafetyTemplateValues = `
<TemplateValue Name="f_user_card" Type="Cardinality">1</TemplateValue>
<TemplateValue Name="f_image_card" Type="Cardinality">0</TemplateValue>
<TemplateValue Name="codedbool_type" Type="Type">DInt</TemplateValue>
`;
        for (const w of Object.values(this.iface)) {
            if (w.operationOrSignal !== null)
                this.children.push(w.operationOrSignal);
        }
    }
}
exports.AckGlCall = AckGlCall;
//# sourceMappingURL=AckGlCall.js.map