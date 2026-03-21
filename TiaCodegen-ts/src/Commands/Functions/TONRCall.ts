import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal.js';
import { IOperationOrSignalDirectionWrapper } from '../../Interfaces/IOperationOrSignalDirectionWrapper.js';
import { Direction } from '../../Enums/Direction.js';
import { SystemFunctionBlockCall } from './Base/SystemFunctionBlockCall.js';

export interface TONRCallOptions {
    instanceName: string;
    pt?: IOperationOrSignal | null;
    r?: IOperationOrSignal | null;
    q?: IOperationOrSignal | null;
    et?: IOperationOrSignal | null;
}

export class TONRCall extends SystemFunctionBlockCall {
    constructor(options: TONRCallOptions) {
        const { instanceName, pt = null, r = null, q = null, et = null } = options;
        super({ functionName: 'TONR', instanceName });
        this.iface['PT'] = new IOperationOrSignalDirectionWrapper(pt, Direction.Input);
        this.iface['R'] = new IOperationOrSignalDirectionWrapper(r, Direction.Input);
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
