import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal.js';
import { IOperationOrSignalDirectionWrapper } from '../../Interfaces/IOperationOrSignalDirectionWrapper.js';
import { Direction } from '../../Enums/Direction.js';
import { SystemFunctionCall } from '../Functions/Base/SystemFunctionCall.js';

export class InRangeCall extends SystemFunctionCall {
    constructor(
        min: IOperationOrSignal,
        inParam: IOperationOrSignal,
        max: IOperationOrSignal,
        out: IOperationOrSignal,
        eno: IOperationOrSignal | null = null,
    ) {
        super('InRange', eno);
        this.disableEno = false;
        this.iface['min'] = new IOperationOrSignalDirectionWrapper(min, Direction.Input);
        this.iface['in'] = new IOperationOrSignalDirectionWrapper(inParam, Direction.Input);
        this.iface['max'] = new IOperationOrSignalDirectionWrapper(max, Direction.Input);
        this.iface['out'] = new IOperationOrSignalDirectionWrapper(out, Direction.Output);

        for (const w of Object.values(this.iface)) {
            if (w.operationOrSignal !== null) this.children.push(w.operationOrSignal);
        }
    }
}
