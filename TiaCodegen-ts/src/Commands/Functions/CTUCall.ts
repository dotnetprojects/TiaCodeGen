import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal.js';
import { IOperationOrSignalDirectionWrapper } from '../../Interfaces/IOperationOrSignalDirectionWrapper.js';
import { Direction } from '../../Enums/Direction.js';
import { SystemFunctionBlockCall } from './Base/SystemFunctionBlockCall.js';

export interface CTUCallOptions {
    instanceName: string;
    r?: IOperationOrSignal | null;
    pv?: IOperationOrSignal | null;
    q?: IOperationOrSignal | null;
    cv?: IOperationOrSignal | null;
    templateValue?: string;
}

export class CTUCall extends SystemFunctionBlockCall {
    constructor(options: CTUCallOptions) {
        const { instanceName, r = null, pv = null, q = null, cv = null, templateValue = 'Int' } = options;
        super({ functionName: 'CTU', instanceName });
        this.iface['R'] = new IOperationOrSignalDirectionWrapper(r, Direction.Input);
        this.iface['PV'] = new IOperationOrSignalDirectionWrapper(pv, Direction.Input);
        this.iface['Q'] = new IOperationOrSignalDirectionWrapper(q, Direction.Output);
        this.iface['CV'] = new IOperationOrSignalDirectionWrapper(cv, Direction.Output);

        this.templateValueName = 'value_type';
        this.templateValueType = 'Type';
        this.templateValue = templateValue;
        this.hasNoEn = true;

        for (const w of Object.values(this.iface)) {
            if (w.operationOrSignal !== null) this.children.push(w.operationOrSignal);
        }
    }
}
