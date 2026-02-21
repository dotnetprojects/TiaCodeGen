import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal';
import { CompareOperator } from './CompareOperator';

export class Eq extends CompareOperator {
    constructor(...operationOrSignals: IOperationOrSignal[]) {
        super(...operationOrSignals);
    }
}
