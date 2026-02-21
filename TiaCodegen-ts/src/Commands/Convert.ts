import { IOperationOrSignal } from '../Interfaces/IOperationOrSignal.js';
import { IFunctionOperation } from '../Interfaces/IFunctionOperation.js';
import { BaseOperationOrSignal } from './BaseOperationOrSignal.js';

export class Convert extends BaseOperationOrSignal implements IFunctionOperation {
    constructor(...operationOrSignals: IOperationOrSignal[]) {
        super(...operationOrSignals);
    }
}
