import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal.js';
import { Signal } from '../Signals/Signal.js';
import { BaseNPCoil } from './BaseNPCoil.js';

export class PCoil extends BaseNPCoil {
    constructor(signal: Signal, helpSignal: Signal, op: IOperationOrSignal | null = null) {
        super(signal, helpSignal, op);
    }
}
