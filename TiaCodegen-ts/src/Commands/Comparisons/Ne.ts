import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal';
import { CompareOperator } from './CompareOperator';

export class Ne extends CompareOperator {
    constructor(...operationOrSignals: IOperationOrSignal[]) {
        super(...operationOrSignals);
    }
}
