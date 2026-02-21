import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal.js';
import { BaseOperationOrSignal } from '../BaseOperationOrSignal.js';

export abstract class CompareOperator extends BaseOperationOrSignal {
    constructor(...operationOrSignals: IOperationOrSignal[]) {
        super(...operationOrSignals);
    }
}
