import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal';
import { Signal } from '../Signals/Signal';
import { BaseNPCoil } from './BaseNPCoil';

export class PCoil extends BaseNPCoil {
    constructor(signal: Signal, helpSignal: Signal, op: IOperationOrSignal | null = null) {
        super(signal, helpSignal, op);
    }
}
