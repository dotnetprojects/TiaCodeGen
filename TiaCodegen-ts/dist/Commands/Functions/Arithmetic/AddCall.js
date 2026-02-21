"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCall = void 0;
const IOperationOrSignalDirectionWrapper_1 = require("../../../Interfaces/IOperationOrSignalDirectionWrapper");
const Direction_1 = require("../../../Enums/Direction");
const VariableArithmeticCall_1 = require("./VariableArithmeticCall");
class AddCall extends VariableArithmeticCall_1.VariableArithmeticCall {
    constructor(type, in1, in2, in3 = null, in4 = null, in5 = null, in6 = null, in7 = null, in8 = null, in9 = null, in10 = null, in11 = null, in12 = null, in13 = null, in14 = null, in15 = null, in16 = null, in17 = null, in18 = null, in19 = null, in20 = null, in21 = null, in22 = null, in23 = null, in24 = null, in25 = null, in26 = null, in27 = null, in28 = null, in29 = null, in30 = null, in31 = null, in32 = null, in33 = null, in34 = null, in35 = null, in36 = null, in37 = null, in38 = null, in39 = null, in40 = null, in41 = null, in42 = null, in43 = null, in44 = null, in45 = null, in46 = null, in47 = null, in48 = null, in49 = null, in50 = null, out1 = null, eno = null) {
        super('Add', eno);
        this.disableEno = true;
        this.type = type;
        this.iface['IN1'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in1, Direction_1.Direction.Input);
        this.iface['IN2'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in2, Direction_1.Direction.Input);
        this.iface['IN3'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in3, Direction_1.Direction.Input);
        this.iface['IN4'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in4, Direction_1.Direction.Input);
        this.iface['IN5'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in5, Direction_1.Direction.Input);
        this.iface['IN6'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in6, Direction_1.Direction.Input);
        this.iface['IN7'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in7, Direction_1.Direction.Input);
        this.iface['IN8'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in8, Direction_1.Direction.Input);
        this.iface['IN9'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in9, Direction_1.Direction.Input);
        this.iface['IN10'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in10, Direction_1.Direction.Input);
        this.iface['IN11'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in11, Direction_1.Direction.Input);
        this.iface['IN12'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in12, Direction_1.Direction.Input);
        this.iface['IN13'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in13, Direction_1.Direction.Input);
        this.iface['IN14'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in14, Direction_1.Direction.Input);
        this.iface['IN15'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in15, Direction_1.Direction.Input);
        this.iface['IN16'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in16, Direction_1.Direction.Input);
        this.iface['IN17'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in17, Direction_1.Direction.Input);
        this.iface['IN18'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in18, Direction_1.Direction.Input);
        this.iface['IN19'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in19, Direction_1.Direction.Input);
        this.iface['IN20'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in20, Direction_1.Direction.Input);
        this.iface['IN21'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in21, Direction_1.Direction.Input);
        this.iface['IN22'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in22, Direction_1.Direction.Input);
        this.iface['IN23'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in23, Direction_1.Direction.Input);
        this.iface['IN24'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in24, Direction_1.Direction.Input);
        this.iface['IN25'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in25, Direction_1.Direction.Input);
        this.iface['IN26'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in26, Direction_1.Direction.Input);
        this.iface['IN27'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in27, Direction_1.Direction.Input);
        this.iface['IN28'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in28, Direction_1.Direction.Input);
        this.iface['IN29'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in29, Direction_1.Direction.Input);
        this.iface['IN30'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in30, Direction_1.Direction.Input);
        this.iface['IN31'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in31, Direction_1.Direction.Input);
        this.iface['IN32'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in32, Direction_1.Direction.Input);
        this.iface['IN33'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in33, Direction_1.Direction.Input);
        this.iface['IN34'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in34, Direction_1.Direction.Input);
        this.iface['IN35'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in35, Direction_1.Direction.Input);
        this.iface['IN36'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in36, Direction_1.Direction.Input);
        this.iface['IN37'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in37, Direction_1.Direction.Input);
        this.iface['IN38'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in38, Direction_1.Direction.Input);
        this.iface['IN39'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in39, Direction_1.Direction.Input);
        this.iface['IN40'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in40, Direction_1.Direction.Input);
        this.iface['IN41'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in41, Direction_1.Direction.Input);
        this.iface['IN42'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in42, Direction_1.Direction.Input);
        this.iface['IN43'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in43, Direction_1.Direction.Input);
        this.iface['IN44'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in44, Direction_1.Direction.Input);
        this.iface['IN45'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in45, Direction_1.Direction.Input);
        this.iface['IN46'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in46, Direction_1.Direction.Input);
        this.iface['IN47'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in47, Direction_1.Direction.Input);
        this.iface['IN48'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in48, Direction_1.Direction.Input);
        this.iface['IN49'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in49, Direction_1.Direction.Input);
        this.iface['IN50'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(in50, Direction_1.Direction.Input);
        this.iface['OUT'] = new IOperationOrSignalDirectionWrapper_1.IOperationOrSignalDirectionWrapper(out1, Direction_1.Direction.Output);
        for (const w of Object.values(this.iface)) {
            if (w.operationOrSignal !== null)
                this.children.push(w.operationOrSignal);
        }
    }
}
exports.AddCall = AddCall;
//# sourceMappingURL=AddCall.js.map