import { IOperationOrSignal } from '../../../Interfaces/IOperationOrSignal';
import { FunctionCall } from './FunctionCall';

export class FunctionBlockCall extends FunctionCall {
    instanceName: string;

    constructor(functionName: string, instanceName: string, eno: IOperationOrSignal | null = null) {
        super(functionName, eno);
        this.functionName = functionName;
        this.instanceName = instanceName;
    }
}
