import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal.js';
import { IOperationOrSignalDirectionWrapper } from '../../Interfaces/IOperationOrSignalDirectionWrapper.js';
import { Direction } from '../../Enums/Direction.js';
import { SystemFunctionBlockCall } from './Base/SystemFunctionBlockCall.js';

export class CTUCall extends SystemFunctionBlockCall {
    constructor(
        instanceName: string,
        r: IOperationOrSignal | null = null,
        pv: IOperationOrSignal | null = null,
        q: IOperationOrSignal | null = null,
        cv: IOperationOrSignal | null = null,
        templateValue: string = 'Int',
    ) {
        super('CTU', instanceName, null);
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
