import { IOperationOrSignal } from '../../../Interfaces/IOperationOrSignal';
import { FunctionBlockCall } from './FunctionBlockCall';
export declare class SystemFunctionBlockCall extends FunctionBlockCall {
    templateValueName: string | null;
    templateValueType: string | null;
    templateValue: string | null;
    constructor(functionName: string, instanceName: string, eno?: IOperationOrSignal | null);
}
//# sourceMappingURL=SystemFunctionBlockCall.d.ts.map