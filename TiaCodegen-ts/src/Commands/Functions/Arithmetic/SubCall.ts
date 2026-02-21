import { IOperationOrSignal } from '../../../Interfaces/IOperationOrSignal.js';
import { IOperationOrSignalDirectionWrapper } from '../../../Interfaces/IOperationOrSignalDirectionWrapper.js';
import { Direction } from '../../../Enums/Direction.js';
import { ArithmeticCall } from './ArithmeticCall.js';

export class SubCall extends ArithmeticCall {
    constructor(
        type: string,
        in1: IOperationOrSignal,
        in2: IOperationOrSignal,
        out1: IOperationOrSignal | null = null,
        eno: IOperationOrSignal | null = null,
    ) {
        super('Sub', eno);
        this.disableEno = true;
        this.type = type;
        this.iface['IN1'] = new IOperationOrSignalDirectionWrapper(in1, Direction.Input);
        this.iface['IN2'] = new IOperationOrSignalDirectionWrapper(in2, Direction.Input);
        this.iface['OUT'] = new IOperationOrSignalDirectionWrapper(out1, Direction.Output);

        for (const w of Object.values(this.iface)) {
            if (w.operationOrSignal !== null) this.children.push(w.operationOrSignal);
        }
    }
}
