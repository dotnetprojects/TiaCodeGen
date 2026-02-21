import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal.js';
import { IOperationOrSignalDirectionWrapper } from '../../Interfaces/IOperationOrSignalDirectionWrapper.js';
import { Direction } from '../../Enums/Direction.js';
import { SystemFunctionBlockCall } from './Base/SystemFunctionBlockCall.js';

export class FTrigCall extends SystemFunctionBlockCall {
    constructor(
        instanceName: string,
        clk: IOperationOrSignal | null = null,
        q: IOperationOrSignal | null = null,
        eno: IOperationOrSignal | null = null,
    ) {
        super('F_TRIG', instanceName, eno);
        this.iface['CLK'] = new IOperationOrSignalDirectionWrapper(clk, Direction.Input);
        this.iface['Q'] = new IOperationOrSignalDirectionWrapper(q, Direction.Output);

        for (const w of Object.values(this.iface)) {
            if (w.operationOrSignal !== null) this.children.push(w.operationOrSignal);
        }
    }
}
