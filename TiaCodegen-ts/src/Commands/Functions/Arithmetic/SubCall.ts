import { IOperationOrSignal } from '../../../Interfaces/IOperationOrSignal.js';
import { IOperationOrSignalDirectionWrapper } from '../../../Interfaces/IOperationOrSignalDirectionWrapper.js';
import { Direction } from '../../../Enums/Direction.js';
import { ArithmeticCall, numericType } from './ArithmeticCall.js';

export interface SubCallOptions {
    type: numericType;
    in1: IOperationOrSignal;
    in2: IOperationOrSignal;
    out1?: IOperationOrSignal | null;
    eno?: IOperationOrSignal | null;
}

export class SubCall extends ArithmeticCall {
    constructor(options: SubCallOptions) {
        const { type, in1, in2, out1 = null, eno = null } = options;
        super({ functionName: 'Sub', eno });
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
