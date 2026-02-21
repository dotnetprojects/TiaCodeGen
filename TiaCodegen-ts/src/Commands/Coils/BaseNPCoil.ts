import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal.js';
import { Signal } from '../Signals/Signal.js';
import { BaseCoil } from './BaseCoil.js';

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
