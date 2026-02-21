import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal.js';
import { Signal } from '../Signals/Signal.js';
import { BaseCoil } from './BaseCoil.js';

export class Coil extends BaseCoil {
    constructor(signal: Signal, op: IOperationOrSignal | null = null) {
        super(signal, op);
    }
}
