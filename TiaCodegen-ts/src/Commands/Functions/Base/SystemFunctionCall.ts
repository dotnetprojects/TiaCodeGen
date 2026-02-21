import { IOperationOrSignal } from '../../../Interfaces/IOperationOrSignal';
import { FunctionCall } from './FunctionCall';

export class SystemFunctionCall extends FunctionCall {
    constructor(functionName: string, eno: IOperationOrSignal | null = null) {
        super(functionName, eno);
    }
}
