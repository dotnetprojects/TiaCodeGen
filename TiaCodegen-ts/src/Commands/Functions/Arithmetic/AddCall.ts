import { IOperationOrSignal } from '../../../Interfaces/IOperationOrSignal.js';
import { IOperationOrSignalDirectionWrapper } from '../../../Interfaces/IOperationOrSignalDirectionWrapper.js';
import { Direction } from '../../../Enums/Direction.js';
import { VariableArithmeticCall } from './VariableArithmeticCall.js';

export class AddCall extends VariableArithmeticCall {
    constructor(
                type: string,
        in1: IOperationOrSignal,
        in2: IOperationOrSignal,
        in3: IOperationOrSignal | null = null,
        in4: IOperationOrSignal | null = null,
        in5: IOperationOrSignal | null = null,
        in6: IOperationOrSignal | null = null,
        in7: IOperationOrSignal | null = null,
        in8: IOperationOrSignal | null = null,
        in9: IOperationOrSignal | null = null,
        in10: IOperationOrSignal | null = null,
        in11: IOperationOrSignal | null = null,
        in12: IOperationOrSignal | null = null,
        in13: IOperationOrSignal | null = null,
        in14: IOperationOrSignal | null = null,
        in15: IOperationOrSignal | null = null,
        in16: IOperationOrSignal | null = null,
        in17: IOperationOrSignal | null = null,
        in18: IOperationOrSignal | null = null,
        in19: IOperationOrSignal | null = null,
        in20: IOperationOrSignal | null = null,
        in21: IOperationOrSignal | null = null,
        in22: IOperationOrSignal | null = null,
        in23: IOperationOrSignal | null = null,
        in24: IOperationOrSignal | null = null,
        in25: IOperationOrSignal | null = null,
        in26: IOperationOrSignal | null = null,
        in27: IOperationOrSignal | null = null,
        in28: IOperationOrSignal | null = null,
        in29: IOperationOrSignal | null = null,
        in30: IOperationOrSignal | null = null,
        in31: IOperationOrSignal | null = null,
        in32: IOperationOrSignal | null = null,
        in33: IOperationOrSignal | null = null,
        in34: IOperationOrSignal | null = null,
        in35: IOperationOrSignal | null = null,
        in36: IOperationOrSignal | null = null,
        in37: IOperationOrSignal | null = null,
        in38: IOperationOrSignal | null = null,
        in39: IOperationOrSignal | null = null,
        in40: IOperationOrSignal | null = null,
        in41: IOperationOrSignal | null = null,
        in42: IOperationOrSignal | null = null,
        in43: IOperationOrSignal | null = null,
        in44: IOperationOrSignal | null = null,
        in45: IOperationOrSignal | null = null,
        in46: IOperationOrSignal | null = null,
        in47: IOperationOrSignal | null = null,
        in48: IOperationOrSignal | null = null,
        in49: IOperationOrSignal | null = null,
        in50: IOperationOrSignal | null = null,
        out1: IOperationOrSignal | null = null,
        eno: IOperationOrSignal | null = null,
    ) {
        super('Add', eno);
        this.disableEno = true;
        this.type = type;
        this.iface['IN1'] = new IOperationOrSignalDirectionWrapper(in1, Direction.Input);
        this.iface['IN2'] = new IOperationOrSignalDirectionWrapper(in2, Direction.Input);
        this.iface['IN3'] = new IOperationOrSignalDirectionWrapper(in3, Direction.Input);
        this.iface['IN4'] = new IOperationOrSignalDirectionWrapper(in4, Direction.Input);
        this.iface['IN5'] = new IOperationOrSignalDirectionWrapper(in5, Direction.Input);
        this.iface['IN6'] = new IOperationOrSignalDirectionWrapper(in6, Direction.Input);
        this.iface['IN7'] = new IOperationOrSignalDirectionWrapper(in7, Direction.Input);
        this.iface['IN8'] = new IOperationOrSignalDirectionWrapper(in8, Direction.Input);
        this.iface['IN9'] = new IOperationOrSignalDirectionWrapper(in9, Direction.Input);
        this.iface['IN10'] = new IOperationOrSignalDirectionWrapper(in10, Direction.Input);
        this.iface['IN11'] = new IOperationOrSignalDirectionWrapper(in11, Direction.Input);
        this.iface['IN12'] = new IOperationOrSignalDirectionWrapper(in12, Direction.Input);
        this.iface['IN13'] = new IOperationOrSignalDirectionWrapper(in13, Direction.Input);
        this.iface['IN14'] = new IOperationOrSignalDirectionWrapper(in14, Direction.Input);
        this.iface['IN15'] = new IOperationOrSignalDirectionWrapper(in15, Direction.Input);
        this.iface['IN16'] = new IOperationOrSignalDirectionWrapper(in16, Direction.Input);
        this.iface['IN17'] = new IOperationOrSignalDirectionWrapper(in17, Direction.Input);
        this.iface['IN18'] = new IOperationOrSignalDirectionWrapper(in18, Direction.Input);
        this.iface['IN19'] = new IOperationOrSignalDirectionWrapper(in19, Direction.Input);
        this.iface['IN20'] = new IOperationOrSignalDirectionWrapper(in20, Direction.Input);
        this.iface['IN21'] = new IOperationOrSignalDirectionWrapper(in21, Direction.Input);
        this.iface['IN22'] = new IOperationOrSignalDirectionWrapper(in22, Direction.Input);
        this.iface['IN23'] = new IOperationOrSignalDirectionWrapper(in23, Direction.Input);
        this.iface['IN24'] = new IOperationOrSignalDirectionWrapper(in24, Direction.Input);
        this.iface['IN25'] = new IOperationOrSignalDirectionWrapper(in25, Direction.Input);
        this.iface['IN26'] = new IOperationOrSignalDirectionWrapper(in26, Direction.Input);
        this.iface['IN27'] = new IOperationOrSignalDirectionWrapper(in27, Direction.Input);
        this.iface['IN28'] = new IOperationOrSignalDirectionWrapper(in28, Direction.Input);
        this.iface['IN29'] = new IOperationOrSignalDirectionWrapper(in29, Direction.Input);
        this.iface['IN30'] = new IOperationOrSignalDirectionWrapper(in30, Direction.Input);
        this.iface['IN31'] = new IOperationOrSignalDirectionWrapper(in31, Direction.Input);
        this.iface['IN32'] = new IOperationOrSignalDirectionWrapper(in32, Direction.Input);
        this.iface['IN33'] = new IOperationOrSignalDirectionWrapper(in33, Direction.Input);
        this.iface['IN34'] = new IOperationOrSignalDirectionWrapper(in34, Direction.Input);
        this.iface['IN35'] = new IOperationOrSignalDirectionWrapper(in35, Direction.Input);
        this.iface['IN36'] = new IOperationOrSignalDirectionWrapper(in36, Direction.Input);
        this.iface['IN37'] = new IOperationOrSignalDirectionWrapper(in37, Direction.Input);
        this.iface['IN38'] = new IOperationOrSignalDirectionWrapper(in38, Direction.Input);
        this.iface['IN39'] = new IOperationOrSignalDirectionWrapper(in39, Direction.Input);
        this.iface['IN40'] = new IOperationOrSignalDirectionWrapper(in40, Direction.Input);
        this.iface['IN41'] = new IOperationOrSignalDirectionWrapper(in41, Direction.Input);
        this.iface['IN42'] = new IOperationOrSignalDirectionWrapper(in42, Direction.Input);
        this.iface['IN43'] = new IOperationOrSignalDirectionWrapper(in43, Direction.Input);
        this.iface['IN44'] = new IOperationOrSignalDirectionWrapper(in44, Direction.Input);
        this.iface['IN45'] = new IOperationOrSignalDirectionWrapper(in45, Direction.Input);
        this.iface['IN46'] = new IOperationOrSignalDirectionWrapper(in46, Direction.Input);
        this.iface['IN47'] = new IOperationOrSignalDirectionWrapper(in47, Direction.Input);
        this.iface['IN48'] = new IOperationOrSignalDirectionWrapper(in48, Direction.Input);
        this.iface['IN49'] = new IOperationOrSignalDirectionWrapper(in49, Direction.Input);
        this.iface['IN50'] = new IOperationOrSignalDirectionWrapper(in50, Direction.Input);
        this.iface['OUT'] = new IOperationOrSignalDirectionWrapper(out1, Direction.Output);

        for (const w of Object.values(this.iface)) {
            if (w.operationOrSignal !== null) this.children.push(w.operationOrSignal);
        }
    }
}
