import { Signal } from '../Signals/Signal.js';
import { IPartName } from '../../Interfaces/IPartName.js';
import { BaseNPCoil } from '../Coils/BaseNPCoil.js';

export class NTrigCall extends BaseNPCoil implements IPartName {
    partName: string;

    constructor(signal: Signal) {
        super(signal, null, null);
        this.partName = 'NBox';
    }
}
