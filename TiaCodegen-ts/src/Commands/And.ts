import { IOperationOrSignal } from '../Interfaces/IOperationOrSignal.js';
import { BaseOperationOrSignal } from './BaseOperationOrSignal.js';

export class And extends BaseOperationOrSignal {
    constructor(...operationOrSignals: IOperationOrSignal[]) {
        super(...operationOrSignals);
    }
}
