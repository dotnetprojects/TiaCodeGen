import { IOperationOrSignal } from '../Interfaces/IOperationOrSignal';
import { IFunctionOperation } from '../Interfaces/IFunctionOperation';
import { BaseOperationOrSignal } from './BaseOperationOrSignal';

export class Convert extends BaseOperationOrSignal implements IFunctionOperation {
    constructor(...operationOrSignals: IOperationOrSignal[]) {
        super(...operationOrSignals);
    }
}
