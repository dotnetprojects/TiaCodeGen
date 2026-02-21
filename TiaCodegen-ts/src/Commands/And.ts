import { IOperationOrSignal } from '../Interfaces/IOperationOrSignal';
import { BaseOperationOrSignal } from './BaseOperationOrSignal';

export class And extends BaseOperationOrSignal {
    constructor(...operationOrSignals: IOperationOrSignal[]) {
        super(...operationOrSignals);
    }
}
