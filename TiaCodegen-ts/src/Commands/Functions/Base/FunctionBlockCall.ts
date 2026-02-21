import { IOperationOrSignal } from '../../../Interfaces/IOperationOrSignal.js';
import { FunctionCall } from './FunctionCall.js';

export class FunctionBlockCall extends FunctionCall {
    instanceName: string;

    constructor(functionName: string, instanceName: string, eno: IOperationOrSignal | null = null) {
        super(functionName, eno);
        this.instanceName = instanceName;
    }
}
