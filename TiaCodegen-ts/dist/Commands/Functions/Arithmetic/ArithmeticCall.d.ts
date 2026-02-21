import { IOperationOrSignal } from '../../../Interfaces/IOperationOrSignal';
import { SystemFunctionCall } from '../Base/SystemFunctionCall';
export declare abstract class ArithmeticCall extends SystemFunctionCall {
    type: string;
    constructor(functionName: string, eno?: IOperationOrSignal | null);
}
//# sourceMappingURL=ArithmeticCall.d.ts.map