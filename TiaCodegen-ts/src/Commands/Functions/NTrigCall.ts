import { Signal } from '../Signals/Signal';
import { IPartName } from '../../Interfaces/IPartName';
import { BaseNPCoil } from '../Coils/BaseNPCoil';

export class NTrigCall extends BaseNPCoil implements IPartName {
    partName: string;

    constructor(signal: Signal) {
        super(signal, null, null);
        this.partName = 'NBox';
    }
}
