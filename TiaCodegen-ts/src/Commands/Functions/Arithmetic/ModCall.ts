import { IOperationOrSignal } from '../../../Interfaces/IOperationOrSignal.js';
import { IOperationOrSignalDirectionWrapper } from '../../../Interfaces/IOperationOrSignalDirectionWrapper.js';
import { Direction } from '../../../Enums/Direction.js';
import { ArithmeticCall } from './ArithmeticCall.js';

export interface ModCallOptions {
    type: string;
    in1: IOperationOrSignal;
    in2: IOperationOrSignal;
    out1?: IOperationOrSignal | null;
    eno?: IOperationOrSignal | null;
}

export class ModCall extends ArithmeticCall {
    constructor(options: ModCallOptions) {
        const { type, in1, in2, out1 = null, eno = null } = options;
        super({ functionName: 'Mod', eno });
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
