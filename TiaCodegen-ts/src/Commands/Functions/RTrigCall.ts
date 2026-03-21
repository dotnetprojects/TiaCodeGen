import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal.js';
import { IOperationOrSignalDirectionWrapper } from '../../Interfaces/IOperationOrSignalDirectionWrapper.js';
import { Direction } from '../../Enums/Direction.js';
import { SystemFunctionBlockCall } from './Base/SystemFunctionBlockCall.js';

export interface RTrigCallOptions {
    instanceName: string;
    clk?: IOperationOrSignal | null;
    q?: IOperationOrSignal | null;
    eno?: IOperationOrSignal | null;
}

export class RTrigCall extends SystemFunctionBlockCall {
    constructor(options: RTrigCallOptions) {
        const { instanceName, clk = null, q = null, eno = null } = options;
        super({ functionName: 'R_TRIG', instanceName, eno });
        this.iface['CLK'] = new IOperationOrSignalDirectionWrapper(clk, Direction.Input);
        this.iface['Q'] = new IOperationOrSignalDirectionWrapper(q, Direction.Output);

        for (const w of Object.values(this.iface)) {
            if (w.operationOrSignal !== null) this.children.push(w.operationOrSignal);
        }
    }
}
