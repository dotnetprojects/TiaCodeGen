import { IOperationOrSignal } from '../../Interfaces/IOperationOrSignal.js';
import { SignalType } from '../../Enums/SignalType.js';
import { StringBuilder } from '../../utils/StringBuilder.js';

export class Signal implements IOperationOrSignal {
    debugInfo: string | null = null;
    operationId: number = 0;
    signalId: number = 0;
    name: string;
    description: string | null;
    signalType: SignalType;
    customType: string | null;
    children: IOperationOrSignal[];
    parent: IOperationOrSignal | null = null;
    doNotCreateContact: boolean = false;
    cardinality: number = 0;

    constructor(nameOrValue: string | number | boolean, signalType?: SignalType, customType?: string, description?: string) {
        if (typeof nameOrValue === 'number') {
            this.name = nameOrValue.toString();
            this.signalType = SignalType.ConstantInt;
            this.description = null;
            this.customType = null;
        } else if (typeof nameOrValue === 'boolean') {
            this.name = nameOrValue.toString().toUpperCase();
            this.signalType = SignalType.ConstantBool;
            this.description = null;
            this.customType = null;
        } else {
            this.name = nameOrValue;
            this.signalType = signalType ?? SignalType.Bool;
            this.customType = customType ?? null;
            this.description = description ?? null;
        }
        this.children = [];
    }

    createContactAndFillCardinality(_parent: IOperationOrSignal): number {
        this.cardinality = 1;
        return this.cardinality;
    }

    escape(txt: string): string {
        return txt.replace(/\\\./g, '\uD83C\uDF34');
    }

    unescape(txt: string): string {
        return txt.replace(/\uD83C\uDF34/g, '.').replace(/\\\\/g, '\\');
    }

    clone(): IOperationOrSignal {
        const inst = new Signal(this.name, this.signalType, this.customType ?? undefined, this.description ?? undefined);
        inst.debugInfo = this.debugInfo;
        for (const c of this.children) {
            inst.children.push(c.clone());
        }
        return inst;
    }

    addXmlToStringBuilder(id: number, sb: StringBuilder): void {
        const name = this.name;
        const signalType = this.signalType;

        if (signalType === SignalType.Constant && !name.startsWith('#')) {
            const value = name.indexOf(',');
            sb.appendLine(`<Access Scope="GlobalConstant" UId="${id}">`);
            if (value === -1)
                sb.appendLine(`<Constant Name="${name}">`);
            else
                sb.appendLine(`<Constant Name="${name.substring(0, value)}">`);
            sb.appendLine('</Constant>');
            sb.appendLine('</Access>');
        } else if (signalType === SignalType.ConstantBool && !name.startsWith('#')) {
            sb.appendLine(`<Access Scope="LiteralConstant" UId="${id}">`);
            sb.appendLine('<Constant>');
            sb.appendLine('<ConstantType>Bool</ConstantType>');
            sb.appendLine(`<ConstantValue>${name}</ConstantValue>`);
            sb.appendLine('</Constant>');
            sb.appendLine('</Access>');
        } else if (signalType === SignalType.ConstantTime && !name.startsWith('#')) {
            sb.appendLine(`<Access Scope="TypedConstant" UId="${id}">`);
            sb.appendLine('<Constant>');
            sb.appendLine(`<ConstantValue>${name}</ConstantValue>`);
            sb.appendLine('</Constant>');
            sb.appendLine('</Access>');
        } else if (signalType === SignalType.ConstantUInt && !name.startsWith('#')) {
            sb.appendLine(`<Access Scope="LiteralConstant" UId="${id}">`);
            sb.appendLine('<Constant>');
            sb.appendLine('<ConstantType>UInt</ConstantType>');
            sb.appendLine(`<ConstantValue>${name}</ConstantValue>`);
            sb.appendLine('</Constant>');
            sb.appendLine('</Access>');
        } else if (signalType === SignalType.ConstantUDInt && !name.startsWith('#')) {
            sb.appendLine(`<Access Scope="LiteralConstant" UId="${id}">`);
            sb.appendLine('<Constant>');
            sb.appendLine('<ConstantType>UDInt</ConstantType>');
            sb.appendLine(`<ConstantValue>${name}</ConstantValue>`);
            sb.appendLine('</Constant>');
            sb.appendLine('</Access>');
        } else if (signalType === SignalType.ConstantInt && !name.startsWith('#')) {
            sb.appendLine(`<Access Scope="LiteralConstant" UId="${id}">`);
            sb.appendLine('<Constant>');
            sb.appendLine('<ConstantType>Int</ConstantType>');
            sb.appendLine(`<ConstantValue>${name}</ConstantValue>`);
            sb.appendLine('</Constant>');
            sb.appendLine('</Access>');
        } else if (signalType === SignalType.ConstantReal && !name.startsWith('#')) {
            sb.appendLine(`<Access Scope="LiteralConstant" UId="${id}">`);
            sb.appendLine('<Constant>');
            sb.appendLine('<ConstantType>Real</ConstantType>');
            sb.appendLine(`<ConstantValue>${name}</ConstantValue>`);
            sb.appendLine('</Constant>');
            sb.appendLine('</Access>');
        } else if (signalType === SignalType.ConstantString && !name.startsWith('#')) {
            sb.appendLine(`<Access Scope="LiteralConstant" UId="${id}">`);
            sb.appendLine('<Constant>');
            sb.appendLine('<ConstantType>String</ConstantType>');
            sb.appendLine(`<ConstantValue>${name}</ConstantValue>`);
            sb.appendLine('</Constant>');
            sb.appendLine('</Access>');
        } else if (signalType === SignalType.ConstantWord && !name.startsWith('#')) {
            sb.appendLine(`<Access Scope="TypedConstant" UId="${id}">`);
            sb.appendLine('<Constant>');
            sb.appendLine(`<ConstantValue>${name}</ConstantValue>`);
            sb.appendLine('</Constant>');
            sb.appendLine('</Access>');
        } else if (signalType === SignalType.Void && !name.startsWith('#')) {
            sb.appendLine(`<Access Scope="LiteralConstant" UId="${id}">`);
            sb.appendLine('<Constant>');
            sb.appendLine('<ConstantType>Void</ConstantType>');
            sb.appendLine(`<ConstantValue>${name}</ConstantValue>`);
            sb.appendLine('</Constant>');
            sb.appendLine('</Access>');
        } else if (signalType === SignalType.UDT && !name.startsWith('#')) {
            sb.appendLine(`<Access Scope="GlobalVariable" UId="${id}">  <!-- P1: ${name} -->`);
            sb.appendLine('<Symbol>');
            const escapedParts = this.escape(name).split('.');
            for (let i = 0; i < escapedParts.length; i++) {
                const part = this.unescape(escapedParts[i]);
                const idx = part.indexOf('[') + 1;
                if (idx > 0) {
                    sb.appendLine(`<Component Name="${part.substring(0, idx - 1)}">`);
                    const arrays = part.substring(idx, part.length - 1);

                    if (arrays.includes('"')) {
                        sb.appendLine('<Access Scope="GlobalConstant">');
                        sb.appendLine(`<Constant Name=${arrays}>`);
                        sb.appendLine('</Constant>');
                        sb.appendLine('</Access>');
                    } else if (!part.includes(']')) {
                        let p1: string | null = part.slice(idx);
                        let accessType = 'GlobalVariable';
                        if (p1[0] === '#') {
                            p1 = p1.substring(1);
                            accessType = 'LocalVariable';
                        }
                        sb.appendLine(`<Access Scope="${accessType}">`);
                        sb.appendLine('<Symbol>');
                        sb.appendLine(`<Component Name="${p1}" />`);
                        while (p1 !== null) {
                            i++;
                            p1 = this.unescape(this.escape(name).split('.')[i]);
                            if (p1.includes(']')) {
                                sb.appendLine(`<Component Name="${p1.substring(0, p1.length - 1)}" />`);
                                p1 = null;
                            } else {
                                sb.appendLine(`<Component Name="${p1}" />`);
                            }
                        }
                        sb.appendLine('</Symbol>');
                        sb.appendLine('</Access>');
                    } else {
                        for (const arr of arrays.split(',')) {
                            sb.appendLine('<Access Scope="LiteralConstant">');
                            sb.appendLine('<Constant>');
                            sb.appendLine('<ConstantType>DInt</ConstantType>');
                            sb.appendLine(`<ConstantValue>${arr}</ConstantValue>`);
                            sb.appendLine('</Constant>');
                            sb.appendLine('</Access>');
                        }
                    }
                } else {
                    sb.appendLine(`<Component Name="${part}">`);
                }
                sb.appendLine('</Component>');
            }
            sb.appendLine('<Address Area="None" Type="Block_UDT" BlockNumber="0" BitOffset="0" Informative="true" />');
            sb.appendLine('</Symbol>');
            sb.appendLine('</Access>');
        } else if (signalType === SignalType.Byte && !name.startsWith('#')) {
            sb.appendLine(`<Access Scope="GlobalVariable" UId="${id}">`);
            sb.appendLine('<Symbol>');
            for (const parte of this.escape(name).split('.')) {
                const part = this.unescape(parte);
                sb.appendLine(`<Component Name="${part}" />`);
            }
            sb.appendLine('<Address Informative="true" BitOffset="0" BlockNumber="0" Type="Byte" Area="None" />');
            sb.appendLine('</Symbol>');
            sb.appendLine('</Access>');
        } else if (signalType === SignalType.String && !name.startsWith('#')) {
            sb.appendLine(`<Access Scope="GlobalVariable" UId="${id}">  <!-- P2: ${name} -->`);
            sb.appendLine('<Symbol>');
            for (const parte of this.escape(name).split('.')) {
                const part = this.unescape(parte);
                const idx = part.indexOf('[') + 1;
                if (idx > 0) {
                    sb.appendLine(`<Component Name="${part.substring(0, idx - 1)}">`);
                    const arrays = part.substring(idx, part.length - 1);
                    if (arrays.includes('"')) {
                        sb.appendLine('<Access Scope="GlobalConstant">');
                        sb.appendLine(`<Constant Name=${arrays}>`);
                        sb.appendLine('</Constant>');
                        sb.appendLine('</Access>');
                    } else {
                        for (const arr of arrays.split(',')) {
                            sb.appendLine('<Access Scope="LiteralConstant">');
                            sb.appendLine('<Constant>');
                            sb.appendLine('<ConstantType>DInt</ConstantType>');
                            sb.appendLine(`<ConstantValue>${arr}</ConstantValue>`);
                            sb.appendLine('</Constant>');
                            sb.appendLine('</Access>');
                        }
                    }
                } else {
                    sb.appendLine(`<Component Name="${part}">`);
                }
                sb.appendLine('</Component>');
            }
            sb.appendLine('<Address Area="None" Type="String" BlockNumber="0" BitOffset="0" Informative="true" />');
            sb.appendLine('</Symbol>');
            sb.appendLine('</Access>');
        } else {
            let localName = name;
            if (name.startsWith('#')) {
                sb.appendLine(`<Access Scope="LocalVariable" UId="${id}">`);
                localName = name.substring(1);
            } else {
                sb.appendLine(`<Access Scope="GlobalVariable" UId="${id}">  <!-- P3: ${name} -->`);
            }
            sb.appendLine('<Symbol>');
            const escapedLocal = this.escape(localName).split('.');
            const cnt = (this instanceof FixedSignal) ? 1 : escapedLocal.length;
            for (let i = 0; i < cnt; i++) {
                let part = this.unescape(escapedLocal[i]);
                if (this instanceof FixedSignal) part = localName;

                const idx = part.indexOf('[') + 1;
                if (idx > 0) {
                    sb.appendLine(`<Component Name="${part.substring(0, idx - 1)}">`);
                    const arrays = part.substring(idx, part.length - 1);

                    if (arrays.includes('"')) {
                        sb.appendLine('<Access Scope="GlobalConstant">');
                        sb.appendLine(`<Constant Name=${arrays}>`);
                        sb.appendLine('</Constant>');
                        sb.appendLine('</Access>');
                    } else if (!part.includes(']')) {
                        let p1: string | null = part.slice(idx);
                        let accessType = 'GlobalVariable';
                        if (p1[0] === '#') {
                            p1 = p1.substring(1);
                            accessType = 'LocalVariable';
                        }
                        sb.appendLine(`<Access Scope="${accessType}">`);
                        sb.appendLine('<Symbol>');
                        sb.appendLine(`<Component Name="${p1}" />`);
                        let noClose = false;
                        while (p1 !== null) {
                            i++;
                            p1 = this.unescape(this.escape(localName).split('.')[i]);
                            if (p1.includes(',')) {
                                const innerParts = p1.split(',');
                                sb.appendLine(`<Component Name="${innerParts[0]}" />`);
                                for (const p of innerParts.slice(1)) {
                                    let pNe = p.trim();
                                    if (pNe.includes(']')) {
                                        pNe = pNe.substring(0, pNe.length - 1);
                                    }
                                    if (!isNaN(parseInt(pNe, 10)) && pNe.match(/^\d+$/)) {
                                        noClose = true;
                                        sb.appendLine('</Symbol>');
                                        sb.appendLine('</Access>');
                                        sb.appendLine('<Access Scope="LiteralConstant">');
                                        sb.appendLine('<Constant>');
                                        sb.appendLine('<ConstantType>DInt</ConstantType>');
                                        sb.appendLine(`<ConstantValue>${pNe}</ConstantValue>`);
                                        sb.appendLine('</Constant>');
                                        sb.appendLine('</Access>');
                                    } else {
                                        sb.appendLine('</Symbol>');
                                        sb.appendLine('</Access>');
                                        let accessTypePne = 'GlobalVariable';
                                        if (pNe[0] === '#') {
                                            pNe = pNe.substring(1);
                                            accessTypePne = 'LocalVariable';
                                        }
                                        sb.appendLine(`<Access Scope="${accessTypePne}">`);
                                        sb.appendLine('<Symbol>');
                                        sb.appendLine(`<Component Name="${pNe}" />`);
                                    }
                                }
                                if (p1.includes(']')) {
                                    p1 = null;
                                }
                            } else {
                                if (p1.includes(']')) {
                                    sb.appendLine(`<Component Name="${p1.substring(0, p1.length - 1)}" />`);
                                    p1 = null;
                                } else {
                                    sb.appendLine(`<Component Name="${p1}" />`);
                                }
                            }
                        }
                        if (!noClose) {
                            sb.appendLine('</Symbol>');
                            sb.appendLine('</Access>');
                        }
                    } else {
                        for (const arr of arrays.split(',')) {
                            sb.appendLine('<Access Scope="LiteralConstant">');
                            sb.appendLine('<Constant>');
                            sb.appendLine('<ConstantType>DInt</ConstantType>');
                            sb.appendLine(`<ConstantValue>${arr}</ConstantValue>`);
                            sb.appendLine('</Constant>');
                            sb.appendLine('</Access>');
                        }
                    }
                } else {
                    if (this instanceof FixedPeripherySignal) {
                        sb.appendLine(`<Component Name="${part}" SimpleAccessModifier="Periphery">`);
                    } else {
                        sb.appendLine(`<Component Name="${part}">`);
                    }
                }
                sb.appendLine('</Component>');
            }
            sb.appendLine('</Symbol>');
            sb.appendLine('</Access>');
        }
    }

    toString(): string {
        return `${this.constructor.name}(${this.name})`;
    }
}

export class FixedSignal extends Signal {
    constructor(name: string, signalType: SignalType = SignalType.Bool, customType?: string) {
        super(name, signalType, customType);
    }
}

export class FixedPeripherySignal extends FixedSignal {
    constructor(name: string, signalType: SignalType = SignalType.Bool, customType?: string) {
        super(name, signalType, customType);
    }
}
