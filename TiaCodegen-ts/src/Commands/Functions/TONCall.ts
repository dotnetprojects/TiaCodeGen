import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal.js';
import { IOperationOrSignalDirectionWrapper } from '../../Interfaces/IOperationOrSignalDirectionWrapper.js';
import { Direction } from '../../Enums/Direction.js';
import { SystemFunctionBlockCall } from './Base/SystemFunctionBlockCall.js';

export interface TONCallOptions {
    instanceName: string;
    pt?: IOperationOrSignal | null;
    q?: IOperationOrSignal | null;
    et?: IOperationOrSignal | null;
}

export class TONCall extends SystemFunctionBlockCall {
    constructor(options: TONCallOptions) {
        const { instanceName, pt = null, q = null, et = null } = options;
        super({ functionName: 'TON', instanceName });
        this.iface['PT'] = new IOperationOrSignalDirectionWrapper(pt, Direction.Input);

        this.iface['Q'] = new IOperationOrSignalDirectionWrapper(q, Direction.Output);
        this.iface['ET'] = new IOperationOrSignalDirectionWrapper(et, Direction.Output);

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
            if (w.operationOrSignal !== null) this.children.push(w.operationOrSignal);
        }
    }
}
