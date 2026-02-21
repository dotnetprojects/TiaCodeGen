import { IOperationOrSignal } from '../Interfaces/IOperationOrSignal.js';
import { Signal } from './Signals/Signal.js';
import { BaseNPCoil } from './Coils/BaseNPCoil.js';

export class NCoil extends BaseNPCoil {
    constructor(signal: Signal, helpSignal: Signal, op: IOperationOrSignal | null = null) {
        super(signal, helpSignal, op);
    }
}
