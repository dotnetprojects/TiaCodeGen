import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal.js';
import { CompareOperator } from './CompareOperator.js';

export class Lt extends CompareOperator {
    constructor(...operationOrSignals: IOperationOrSignal[]) {
        super(...operationOrSignals);
    }
}
