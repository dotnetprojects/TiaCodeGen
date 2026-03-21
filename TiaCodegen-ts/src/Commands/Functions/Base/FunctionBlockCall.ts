import { IOperationOrSignal } from '../../../Interfaces/IOperationOrSignal.js';
import { FunctionCall } from './FunctionCall.js';

export interface FunctionBlockCallOptions {
    functionName: string;
    instanceName: string;
    eno?: IOperationOrSignal | null;
}

export class FunctionBlockCall extends FunctionCall {
    instanceName: string;

    constructor(options: FunctionBlockCallOptions) {
        const { functionName, instanceName, eno = null } = options;
        super({ functionName, eno });
        this.instanceName = instanceName;
    }
}
