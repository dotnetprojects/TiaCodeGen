import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal';
import { Signal } from '../Signals/Signal';
import { BaseCoil } from './BaseCoil';

export class BaseNPCoil extends BaseCoil {
    helpSignal: Signal | null;

    constructor(signal: Signal, helpSignal: Signal | null, op: IOperationOrSignal | null = null) {
        super(signal, op);
        this.helpSignal = helpSignal;
        if (helpSignal !== null) {
            this.children.push(helpSignal);
        }
    }
}
