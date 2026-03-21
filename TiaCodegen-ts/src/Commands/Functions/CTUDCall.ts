import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal.js';
import { IOperationOrSignalDirectionWrapper } from '../../Interfaces/IOperationOrSignalDirectionWrapper.js';
import { Direction } from '../../Enums/Direction.js';
import { SystemFunctionBlockCall } from './Base/SystemFunctionBlockCall.js';

export interface CTUDCallOptions {
    instanceName: string;
    cd?: IOperationOrSignal | null;
    r?: IOperationOrSignal | null;
    ld?: IOperationOrSignal | null;
    pv?: IOperationOrSignal | null;
    qu?: IOperationOrSignal | null;
    qd?: IOperationOrSignal | null;
    cv?: IOperationOrSignal | null;
    templateValue?: string;
}

export class CTUDCall extends SystemFunctionBlockCall {
    constructor(options: CTUDCallOptions) {
        const { instanceName, cd = null, r = null, ld = null, pv = null, qu = null, qd = null, cv = null, templateValue = 'Int' } = options;
        super({ functionName: 'CTUD', instanceName });
        this.iface['CD'] = new IOperationOrSignalDirectionWrapper(cd, Direction.Input);
        this.iface['R'] = new IOperationOrSignalDirectionWrapper(r, Direction.Input);
        this.iface['LD'] = new IOperationOrSignalDirectionWrapper(ld, Direction.Input);
        this.iface['PV'] = new IOperationOrSignalDirectionWrapper(pv, Direction.Input);
        this.iface['QU'] = new IOperationOrSignalDirectionWrapper(qu, Direction.Output);
        this.iface['QD'] = new IOperationOrSignalDirectionWrapper(qd, Direction.Output);
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
