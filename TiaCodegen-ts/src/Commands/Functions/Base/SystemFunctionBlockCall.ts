import { IOperationOrSignal } from '../../../Interfaces/IOperationOrSignal';
import { FunctionBlockCall } from './FunctionBlockCall';

export class SystemFunctionBlockCall extends FunctionBlockCall {
    templateValueName: string | null = null;
    templateValueType: string | null = null;
    templateValue: string | null = null;

    constructor(functionName: string, instanceName: string, eno: IOperationOrSignal | null = null) {
        super(functionName, instanceName, eno);
    }
}
