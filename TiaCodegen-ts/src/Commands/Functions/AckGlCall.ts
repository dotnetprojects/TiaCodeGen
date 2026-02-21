import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal.js';
import { IOperationOrSignalDirectionWrapper } from '../../Interfaces/IOperationOrSignalDirectionWrapper.js';
import { Direction } from '../../Enums/Direction.js';
import { SystemFunctionBlockCall } from './Base/SystemFunctionBlockCall.js';

export class AckGlCall extends SystemFunctionBlockCall {
    constructor(
        instanceName: string,
        ackGlob: IOperationOrSignal | null = null,
        eno: IOperationOrSignal | null = null,
    ) {
        super('ACK_GL', instanceName, eno);
        this.iface['ACK_GLOB'] = new IOperationOrSignalDirectionWrapper(ackGlob, Direction.Input);

        this.additionalSafetyTemplateValues = `
<TemplateValue Name="f_user_card" Type="Cardinality">1</TemplateValue>
<TemplateValue Name="f_image_card" Type="Cardinality">0</TemplateValue>
<TemplateValue Name="codedbool_type" Type="Type">DInt</TemplateValue>
`;

        for (const w of Object.values(this.iface)) {
            if (w.operationOrSignal !== null) this.children.push(w.operationOrSignal);
        }
    }
}
