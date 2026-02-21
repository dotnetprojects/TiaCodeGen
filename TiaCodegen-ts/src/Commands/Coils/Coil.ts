import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal';
import { Signal } from '../Signals/Signal';
import { BaseCoil } from './BaseCoil';

export class Coil extends BaseCoil {
    constructor(signal: Signal, op: IOperationOrSignal | null = null) {
        super(signal, op);
    }
}
