import { IOperationOrSignal } from '../../../Interfaces/IOperationOrSignal.js';
import { IOperationOrSignalDirectionWrapper } from '../../../Interfaces/IOperationOrSignalDirectionWrapper.js';
import { Direction } from '../../../Enums/Direction.js';
import { VariableArithmeticCall } from './VariableArithmeticCall.js';

export interface MulCallOptions {
    type: string;
    in1: IOperationOrSignal;
    in2: IOperationOrSignal;
    in3?: IOperationOrSignal | null;
    in4?: IOperationOrSignal | null;
    in5?: IOperationOrSignal | null;
    in6?: IOperationOrSignal | null;
    in7?: IOperationOrSignal | null;
    in8?: IOperationOrSignal | null;
    in9?: IOperationOrSignal | null;
    in10?: IOperationOrSignal | null;
    in11?: IOperationOrSignal | null;
    in12?: IOperationOrSignal | null;
    in13?: IOperationOrSignal | null;
    in14?: IOperationOrSignal | null;
    in15?: IOperationOrSignal | null;
    in16?: IOperationOrSignal | null;
    in17?: IOperationOrSignal | null;
    in18?: IOperationOrSignal | null;
    in19?: IOperationOrSignal | null;
    in20?: IOperationOrSignal | null;
    in21?: IOperationOrSignal | null;
    in22?: IOperationOrSignal | null;
    in23?: IOperationOrSignal | null;
    in24?: IOperationOrSignal | null;
    in25?: IOperationOrSignal | null;
    in26?: IOperationOrSignal | null;
    in27?: IOperationOrSignal | null;
    in28?: IOperationOrSignal | null;
    in29?: IOperationOrSignal | null;
    in30?: IOperationOrSignal | null;
    in31?: IOperationOrSignal | null;
    in32?: IOperationOrSignal | null;
    in33?: IOperationOrSignal | null;
    in34?: IOperationOrSignal | null;
    in35?: IOperationOrSignal | null;
    in36?: IOperationOrSignal | null;
    in37?: IOperationOrSignal | null;
    in38?: IOperationOrSignal | null;
    in39?: IOperationOrSignal | null;
    in40?: IOperationOrSignal | null;
    in41?: IOperationOrSignal | null;
    in42?: IOperationOrSignal | null;
    in43?: IOperationOrSignal | null;
    in44?: IOperationOrSignal | null;
    in45?: IOperationOrSignal | null;
    in46?: IOperationOrSignal | null;
    in47?: IOperationOrSignal | null;
    in48?: IOperationOrSignal | null;
    in49?: IOperationOrSignal | null;
    in50?: IOperationOrSignal | null;
    out1?: IOperationOrSignal | null;
    eno?: IOperationOrSignal | null;
}

export class MulCall extends VariableArithmeticCall {
    constructor(options: MulCallOptions) {
        const { type, in1, in2, out1 = null, eno = null } = options;
        super({ functionName: 'Mul', eno });
        this.disableEno = true;
        this.type = type;
        this.iface['IN1'] = new IOperationOrSignalDirectionWrapper(in1, Direction.Input);
        this.iface['IN2'] = new IOperationOrSignalDirectionWrapper(in2, Direction.Input);
        this.addVariableInputs(options, 3, 50);
        this.iface['OUT'] = new IOperationOrSignalDirectionWrapper(out1, Direction.Output);

        for (const w of Object.values(this.iface)) {
            if (w.operationOrSignal !== null) this.children.push(w.operationOrSignal);
        }
    }
}
