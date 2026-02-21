import { IOperationOrSignal } from '../Interfaces/IOperationOrSignal';
import { Signal } from './Signals/Signal';
import { BaseNPCoil } from './Coils/BaseNPCoil';

export class NCoil extends BaseNPCoil {
    constructor(signal: Signal, helpSignal: Signal, op: IOperationOrSignal | null = null) {
        super(signal, helpSignal, op);
    }
}
