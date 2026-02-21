import { IOperationOrSignal } from '../Interfaces/IOperationOrSignal';
import { ICoil } from '../Interfaces/ICoil';
import { IFunctionOperation } from '../Interfaces/IFunctionOperation';
import { IPartName } from '../Interfaces/IPartName';
import { StringBuilder } from '../utils/StringBuilder';
import { flatten } from '../Internal/IEnumerableExtensions';
import { NaturalComparer } from '../Extensions/NaturalComparer';
import { CodeBlock } from '../Blocks/CodeBlock';
import { Network } from '../Blocks/Network';
import { And } from '../Commands/And';
import { Or } from '../Commands/Or';
import { Not } from '../Commands/Not';
import { Distributor } from '../Commands/Distributor';
import { Move } from '../Commands/Move';
import { Convert } from '../Commands/Convert';
import { S_Move } from '../Commands/S_Move';
import { Signal } from '../Commands/Signals/Signal';
import { BaseCoil } from '../Commands/Coils/BaseCoil';
import { BaseNPCoil } from '../Commands/Coils/BaseNPCoil';
import { Coil } from '../Commands/Coils/Coil';
import { SCoil } from '../Commands/Coils/SCoil';
import { RCoil } from '../Commands/Coils/RCoil';
import { BaseOperationOrSignal } from '../Commands/BaseOperationOrSignal';
import { CompareOperator } from '../Commands/Comparisons/CompareOperator';
import { InRangeCall } from '../Commands/Comparisons/InRangeCall';
import { OutRangeCall } from '../Commands/Comparisons/OutRangeCall';
import { FunctionCall } from '../Commands/Functions/Base/FunctionCall';
import { FunctionBlockCall } from '../Commands/Functions/Base/FunctionBlockCall';
import { SystemFunctionCall } from '../Commands/Functions/Base/SystemFunctionCall';
import { SystemFunctionBlockCall } from '../Commands/Functions/Base/SystemFunctionBlockCall';
import { ArithmeticCall } from '../Commands/Functions/Arithmetic/ArithmeticCall';
import { VariableArithmeticCall } from '../Commands/Functions/Arithmetic/VariableArithmeticCall';
import { AckGlCall } from '../Commands/Functions/AckGlCall';
import { CTUCall } from '../Commands/Functions/CTUCall';
import { CTUDCall } from '../Commands/Functions/CTUDCall';
import { tryGetParent } from '../Extensions/OperationOrSignalExtensions';

export class KopCodeHelper {
    static flattenOrdered<T>(e: T[], f: (t: T) => T[]): T[] {
        const result: T[] = [];
        for (const el of e) {
            for (const el2 of KopCodeHelper.flattenOrdered(f(el), f)) {
                result.push(el2);
            }
            result.push(el);
        }
        return result;
    }

    private _currentId: number = 21;
    private _block: CodeBlock;
    private _sb: StringBuilder;

    constructor(block: CodeBlock) {
        this._block = block;
        this._sb = new StringBuilder();
    }

    private addSignalDefinitions(network: Network): void {
        const allChildren = flatten(network.children, x => x.children);
        const signals = allChildren
            .filter((x): x is Signal => x instanceof Signal)
            .slice()
            .sort((a, b) => new NaturalComparer().compare(a.name, b.name));

        for (const signal of signals) {
            signal.addXmlToStringBuilder(this._currentId, this._sb);
            signal.signalId = this._currentId;
            this._currentId++;
        }
    }

    private checkAndAndOr(block: CodeBlock, network: Network): void {
        const allChildren = flatten(network.children, x => x.children);
        const ors = allChildren.filter((x): x is Or => x instanceof Or);

        for (const or of ors) {
            if (or.children.length === 0) {
                throw new Error(`Empty Or im Baustein "${block.name}" Netzwerk "${network.networkTitle}"`);
            }
        }
    }

    private printTree(signal: IOperationOrSignal, sb: StringBuilder, level: number = 0): void {
        sb.appendLine(' '.repeat(level * 4) + signal.toString() + ' OP ID: ' + signal.operationId);
        for (const s of signal.children) {
            this.printTree(s, sb, level + 1);
        }
    }

    private addContactDefinitions(network: Network, block: CodeBlock): void {
        const ops = KopCodeHelper.flattenOrdered(network.children, x => x.children)
            .filter((x): x is IOperationOrSignal => true);

        for (const op of ops) {
            if (op instanceof Signal) {
                // nothing
            } else if (op instanceof And || (op instanceof Or && op.children.length === 1)) {
                // nothing
            } else {
                if (op instanceof Or && op.children.length > 1) {
                    op.createContactAndFillCardinality(op);
                }
            }
        }

        for (const op of ops) {
            if (op instanceof Signal) {
                if (
                    !(op.parent instanceof BaseCoil) &&
                    !(op.parent instanceof Not) &&
                    !(op.parent instanceof FunctionCall) &&
                    !(op.parent instanceof CompareOperator) &&
                    !(op.parent instanceof Move) &&
                    !(op.parent instanceof Convert) &&
                    !(op.parent instanceof S_Move)
                ) {
                    op.operationId = this._currentId;
                    this._currentId++;
                }
            } else if (op instanceof And || (op instanceof Or && op.children.length === 1)) {
                op.operationId = op.children[op.children.length - 1].operationId;
            } else {
                op.operationId = this._currentId;
                if (op instanceof Not || op instanceof BaseCoil || op instanceof SystemFunctionBlockCall || op instanceof SystemFunctionCall) {
                    if (op.children.length > 0) {
                        op.children[0].operationId = this._currentId;
                    }
                }

                if (op instanceof Or && op.children.length > 1) {
                    op.createContactAndFillCardinality(op);
                }

                if (!(op instanceof Distributor) && !op.doNotCreateContact) {
                    this._currentId++;
                }
            }
        }

        for (const op of ops) {
            let partname = op.constructor.name;
            if (this.isIPartName(op)) {
                partname = (op as unknown as IPartName).partName;
            }

            if (op instanceof Signal) {
                if (
                    !(op.parent instanceof BaseCoil) &&
                    !(op.parent instanceof Not) &&
                    !(op.parent instanceof FunctionCall) &&
                    !(op.parent instanceof CompareOperator) &&
                    !(op.parent instanceof Move) &&
                    !(op.parent instanceof Convert) &&
                    !(op.parent instanceof S_Move)
                ) {
                    this._sb.appendLine(`<Part Name="Contact" UId="${op.operationId}" /><!-- ${(op as Signal).name} -->`);
                }
            } else if (op instanceof Or && op.children.length > 1) {
                if (!op.doNotCreateContact) {
                    this._sb.appendLine(`<Part Name="O" UId="${op.operationId}"><!-- Or (Signals...) -->`);
                    this._sb.appendLine(`<TemplateValue Name="Card" Type="Cardinality">${op.cardinality}</TemplateValue>`);
                    this._sb.appendLine('</Part>');
                }
            } else if (op instanceof CompareOperator) {
                this._sb.appendLine(`<Part Name="${op.constructor.name}" UId="${op.operationId}">`);
                let srctype = (op.children[0] as Signal).signalType.toString();
                if (srctype.startsWith('Constant')) srctype = srctype.substring(8);
                this._sb.appendLine(`<TemplateValue Name="SrcType" Type="Type">${srctype}</TemplateValue>`);
                this._sb.appendLine('</Part>');
            } else if (op instanceof Convert) {
                this._sb.appendLine(`<Part Name="${op.constructor.name}" UId="${op.operationId}">`);
                let srctype = (op.children[op.children.length - 1] as Signal).signalType.toString();
                let desttype = (op.children[0] as Signal).signalType.toString();
                if (srctype.startsWith('Constant')) srctype = srctype.substring(8);
                if (desttype.startsWith('Constant')) desttype = desttype.substring(8);
                this._sb.appendLine(`<TemplateValue Name="SrcType" Type="Type">${srctype}</TemplateValue>`);
                this._sb.appendLine(`<TemplateValue Name="DestType" Type="Type">${desttype}</TemplateValue>`);
                this._sb.appendLine('</Part>');
            } else if (op instanceof Move) {
                this._sb.appendLine(`<Part Name="Move" UId="${op.operationId}" ${this._block.safety ? '' : 'DisabledENO="true"'}>`);
                this._sb.appendLine(`<TemplateValue Name="Card" Type="Cardinality">${op.cardinality}</TemplateValue>`);
                this._sb.appendLine('</Part>');
            } else if (op instanceof S_Move) {
                this._sb.appendLine(`<Part Name="S_Move" UId="${op.operationId}" ${this._block.safety ? '' : 'DisabledENO="true"'} />`);
            } else if (op instanceof Not) {
                this._sb.appendLine(`<Part Name="Contact" UId="${op.operationId}">`);
                this._sb.appendLine('<Negated Name="operand"/>');
                this._sb.appendLine('</Part>');
            } else if (op instanceof BaseCoil) {
                const coil = op as BaseCoil;
                if (coil.negated) {
                    this._sb.appendLine(`<Part Name="${partname}" UId="${op.operationId}"><!-- ${coil.signal.name} -->`);
                    this._sb.appendLine('\t<Negated Name="operand" />');
                    this._sb.appendLine('</Part>');
                } else {
                    this._sb.appendLine(`<Part Name="${partname}" UId="${op.operationId}"/><!-- ${coil.signal.name} -->`);
                }
            } else if (op instanceof And || op instanceof Or) {
                // nothing
            } else if (op instanceof SystemFunctionBlockCall) {
                const fc = op as SystemFunctionBlockCall;
                this._sb.appendLine(`<Part Name="${fc.functionName}" UId="${op.operationId}">`);
                if (fc.additionalInnerXml !== null) this._sb.appendLine(fc.additionalInnerXml);

                const fb = op as FunctionBlockCall;

                if (fb.instanceName.startsWith('"')) {
                    this._sb.appendLine(`<Instance UId="${this._currentId}" Scope="GlobalVariable">`);
                    this._currentId++;
                    this._sb.appendLine(`<Component Name="${fb.instanceName.replace(/"/g, '')}" />`);
                    this._sb.appendLine('</Instance>');
                } else {
                    this._sb.appendLine(`<Instance UId="${this._currentId}" Scope="LocalVariable">`);
                    this._currentId++;

                    for (const part of fb.instanceName.split('.')) {
                        const idx = part.indexOf('[') + 1;
                        if (idx > 0) {
                            this._sb.appendLine(`<Component Name="${part.substring(0, idx - 1)}">`);
                            const arrays = part.substring(idx, part.length - idx - 1);

                            if (arrays.includes('"')) {
                                this._sb.appendLine('<Access Scope="GlobalConstant">');
                                this._sb.appendLine(`<Constant Name=${arrays}>`);
                                this._sb.appendLine('</Constant>');
                                this._sb.appendLine('</Access>');
                            } else {
                                for (const arr of arrays.split(',')) {
                                    this._sb.appendLine(`<Access Scope="LiteralConstant" UId="${this._currentId}" >`);
                                    this._currentId++;
                                    this._sb.appendLine('<Constant>');
                                    this._sb.appendLine('<ConstantType>DInt</ConstantType>');
                                    this._sb.appendLine(`<ConstantValue>${arr}</ConstantValue>`);
                                    this._sb.appendLine('</Constant>');
                                    this._sb.appendLine('</Access>');
                                }
                            }
                        } else {
                            this._sb.appendLine(`<Component Name="${part}">`);
                        }
                        this._sb.appendLine('</Component>');
                    }
                    this._sb.appendLine('</Instance>');
                }
                if (fc.templateValueName !== null) {
                    this._sb.appendLine(`<TemplateValue Name="${fc.templateValueName}" Type="${fc.templateValueType}">${fc.templateValue}</TemplateValue>`);
                    if (fc.safetyTemplateString !== null && tryGetParent(fc, CodeBlock)?.safety === true) {
                        this._sb.appendLine(fc.safetyTemplateString);
                    }
                }

                if (this._block.safety && fc.additionalSafetyTemplateValues !== null) {
                    this._sb.appendLine(fc.additionalSafetyTemplateValues);
                }
                this._sb.appendLine('</Part>');
            } else if (op instanceof SystemFunctionCall) {
                const fc = op as FunctionCall;

                if (fc.functionName === 'Serialize' || fc.functionName === 'Deserialize') {
                    this._sb.appendLine(`<Part Name="${fc.functionName}" Version="2.0" UId="${op.operationId}"${fc.disableEno ? ' DisabledENO="true"' : ''}>`);
                } else {
                    this._sb.appendLine(`<Part Name="${fc.functionName}" UId="${op.operationId}"${fc.disableEno ? ' DisabledENO="true"' : ''}>`);
                }
                if (fc.additionalInnerXml !== null) this._sb.appendLine(fc.additionalInnerXml);

                if (fc instanceof ArithmeticCall) {
                    if (fc instanceof VariableArithmeticCall) {
                        this._sb.appendLine(`<TemplateValue Name="Card" Type="Cardinality">${fc.children.length - 1}</TemplateValue>`);
                    }
                    this._sb.appendLine(`<TemplateValue Name="SrcType" Type="Type">${fc.type}</TemplateValue>`);
                } else if (fc instanceof InRangeCall || fc instanceof OutRangeCall) {
                    let srctype = (op.children[0] as Signal).signalType.toString();
                    if (srctype.startsWith('Constant')) srctype = srctype.substring(8);
                    this._sb.appendLine(`<TemplateValue Name="SrcType" Type="Type">${srctype}</TemplateValue>`);
                } else if (fc.functionName === 'DPRD_DAT' || fc.functionName === 'DPWR_DAT') {
                    this._sb.appendLine('<TemplateValue Name="ptr_type" Type="Type">Variant</TemplateValue>');
                    this._sb.appendLine('<TemplateValue Name="laddr_type" Type="Type">HW_IO</TemplateValue>');
                }
                this._sb.appendLine('</Part>');
            } else if (op instanceof FunctionCall) {
                const fc = op as FunctionCall;

                if (op instanceof AckGlCall) {
                    this._sb.appendLine(`<Part Name="ACK_GL" Version="1.3" UId="${op.operationId}">`);
                } else if (op instanceof FunctionBlockCall) {
                    this._sb.appendLine(`<Call UId="${op.operationId}">`);
                    this._sb.appendLine(`<CallInfo Name="${fc.functionName}" BlockType="FB">`);
                } else {
                    this._sb.appendLine(`<Call UId="${op.operationId}">`);
                    this._sb.appendLine(`<CallInfo Name="${fc.functionName}" BlockType="FC">`);
                }

                if (op instanceof FunctionBlockCall) {
                    const fb = op as FunctionBlockCall;

                    if (fb.instanceName.startsWith('"')) {
                        this._sb.appendLine(`<Instance UId="${this._currentId}" Scope="GlobalVariable">`);
                    } else {
                        this._sb.appendLine(`<Instance UId="${this._currentId}" Scope="LocalVariable">`);
                    }
                    this._currentId++;

                    for (const part of fb.instanceName.split('.')) {
                        let instanceNamePart: string;
                        if (part.startsWith('"')) {
                            instanceNamePart = part.replace(/"/g, '');
                        } else {
                            instanceNamePart = part;
                        }

                        const idx = instanceNamePart.indexOf('[') + 1;
                        if (idx > 0) {
                            this._sb.appendLine(`<Component Name="${instanceNamePart.substring(0, idx - 1)}">`);
                            const arrays = instanceNamePart.substring(idx, instanceNamePart.length - idx - 1);

                            if (arrays.includes('"')) {
                                this._sb.appendLine('<Access Scope="GlobalConstant">');
                                this._sb.appendLine(`<Constant Name=${arrays}>`);
                                this._sb.appendLine('</Constant>');
                                this._sb.appendLine('</Access>');
                            } else {
                                for (const arr of arrays.split(',')) {
                                    this._sb.appendLine(`<Access Scope="LiteralConstant" UId="${this._currentId}" >`);
                                    this._currentId++;
                                    this._sb.appendLine('<Constant>');
                                    this._sb.appendLine('<ConstantType>DInt</ConstantType>');
                                    this._sb.appendLine(`<ConstantValue>${arr}</ConstantValue>`);
                                    this._sb.appendLine('</Constant>');
                                    this._sb.appendLine('</Access>');
                                }
                            }
                        } else {
                            this._sb.appendLine(`<Component Name="${instanceNamePart}">`);
                        }
                        this._sb.appendLine('</Component>');
                    }
                    this._sb.appendLine('</Instance>');
                }

                if (op instanceof AckGlCall) {
                    this._sb.appendLine('<TemplateValue Name="f_user_card" Type="Cardinality">1</TemplateValue>');
                    this._sb.appendLine('<TemplateValue Name="f_image_card" Type="Cardinality">0</TemplateValue>');
                    this._sb.appendLine('<TemplateValue Name="codedbool_type" Type="Type">DInt</TemplateValue>');
                    this._sb.appendLine('</Part>');
                } else {
                    for (const [key, intf] of Object.entries(fc.iface)) {
                        if (intf.direction !== 'Eno') {
                            let type = 'Bool';
                            if (intf.operationOrSignal instanceof Signal) {
                                const sig = intf.operationOrSignal as Signal;
                                if (sig.signalType === 'Custom') {
                                    type = sig.customType ?? 'Bool';
                                } else {
                                    type = sig.signalType.toString();
                                }
                            }
                            if (type !== 'Constant' && type.startsWith('Constant')) {
                                type = type.substring(8);
                            }
                            type = intf.type !== null ? intf.type.toString() : type;
                            if (intf.length > 0) {
                                this._sb.appendLine(`<Parameter Name="${key}" Section="${intf.direction.toString()}" Type="${type}[${intf.length}]" />`);
                            } else {
                                this._sb.appendLine(`<Parameter Name="${key}" Section="${intf.direction.toString()}" Type="${type}" />`);
                            }
                        }
                    }
                    this._sb.appendLine('</CallInfo>');
                    this._sb.appendLine('</Call>');
                }
            }
        }
    }

    private static readonly debug: string | null = null;

    private addWires(op: IOperationOrSignal): void {
        if (op.children !== null) {
            for (const lop of op.children) {
                this.addWires(lop);
            }
        }

        if (op instanceof FunctionCall) {
            const fc = op as FunctionCall;
            for (const [key, intf] of Object.entries(fc.iface)) {
                const sng = intf.operationOrSignal;
                if (fc instanceof ArithmeticCall && sng === null) {
                    // skip
                } else if (sng === null) {
                    this._sb.appendLine(`<Wire UId="${this._currentId}"><!-- Wire 1 FunctionCall -->`);
                    this._currentId++;
                    this._sb.appendLine(`<NameCon UId="${op.operationId}" Name="${key}" />`);
                    this._sb.appendLine(`<OpenCon UId="${this._currentId}" />`);
                    this._currentId++;
                    this._sb.appendLine('</Wire>');
                } else if (intf.direction === 'Input' || intf.direction === 'InOut') {
                    this._sb.appendLine(`<Wire UId="${this._currentId}"><!-- Wire 2 FunctionCall -->`);
                    if (sng instanceof Signal) {
                        this._sb.appendLine(`<IdentCon UId="${(sng as Signal).signalId}" />  <!-- ${(sng as Signal).name} -->`);
                    } else {
                        if (sng instanceof Or) {
                            this._sb.appendLine(`<NameCon UId="${sng.operationId}" Name="out" />`);
                        } else {
                            this._sb.appendLine(`<NameCon UId="${sng.children[sng.children.length - 1].operationId}" Name="out" />`);
                        }
                    }
                    this._sb.appendLine(`<NameCon UId="${op.operationId}" Name="${key}" />`);
                    this._sb.appendLine('</Wire>');
                    this._currentId++;
                } else if (intf.direction === 'Eno') {
                    this._sb.appendLine(`<Wire UId="${this._currentId}"><!-- Wire 3 FunctionCall -->`);
                    this._sb.appendLine(`<NameCon UId="${op.operationId}" Name="eno" />`);
                    this._sb.appendLine(`<NameCon UId="${sng.children[sng.children.length - 1].operationId}" Name="in" />`);
                    this._sb.appendLine('</Wire>');
                    this._currentId++;
                } else {
                    this._sb.appendLine(`<Wire UId="${this._currentId}"><!-- Wire 4 FunctionCall -->`);
                    this._sb.appendLine(`<NameCon UId="${op.operationId}" Name="${key}" />`);
                    if (sng instanceof Distributor) {
                        this._sb.appendLine('<!-- Distributor -->');
                        for (const c of (sng as Distributor).children) {
                            if (c instanceof Signal) {
                                this._sb.appendLine(`<IdentCon UId="${(c as Signal).signalId}" />  <!-- ${(c as Signal).name} -->`);
                            } else if (c instanceof And && c.children.length > 0 && c.children[0] instanceof Or) {
                                for (const chIn of c.children[0].children) {
                                    for (const ch of this.getAllOrSignals(chIn)) {
                                        const inName = ch instanceof FunctionCall
                                            ? ((ch instanceof InRangeCall || ch instanceof OutRangeCall) ? 'pre' : 'en')
                                            : 'in';
                                        this._sb.appendLine(`<NameCon UId="${ch.operationId}" Name="${inName}" />`);
                                    }
                                }
                            } else {
                                const inName = c instanceof FunctionCall
                                    ? ((c instanceof InRangeCall || c instanceof OutRangeCall) ? 'pre' : 'en')
                                    : 'in';
                                this._sb.appendLine(`<NameCon UId="${c.operationId}" Name="${inName}" />`);
                            }
                        }
                    } else {
                        if (sng instanceof Signal) {
                            this._sb.appendLine(`<IdentCon UId="${(sng as Signal).signalId}" />  <!-- ${(sng as Signal).name} -->`);
                        } else {
                            const inName = sng instanceof FunctionCall
                                ? ((sng instanceof InRangeCall || sng instanceof OutRangeCall) ? 'pre' : 'en')
                                : 'in';
                            this._sb.appendLine(`<NameCon UId="${sng.operationId}" Name="${inName}" />`);
                        }
                    }
                    this._sb.appendLine('</Wire>');
                    this._currentId++;
                }
            }
        } else if (
            op instanceof Signal &&
            !(op.parent instanceof FunctionCall) &&
            !(op.parent instanceof CompareOperator) &&
            !(op.parent instanceof Move) &&
            !(op.parent instanceof Convert) &&
            !(op.parent instanceof S_Move)
        ) {
            this._sb.appendLine(`<Wire UId="${this._currentId}"><!-- Wire Parent FunctionCall (Parent:${op.parent?.toString()}) -->`);
            this._sb.appendLine(`<IdentCon UId="${(op as Signal).signalId}" />  <!-- ${(op as Signal).name} -->`);

            let tname = 'operand';
            if (op.parent instanceof BaseNPCoil) tname = 'bit';
            this._sb.appendLine(`<NameCon UId="${(op as Signal).operationId}" Name="${tname}" />  <!-- ${(op as Signal).name} -->`);
            this._sb.appendLine('</Wire>');
            this._currentId++;
        } else if (op instanceof Or && op.children.length > 1) {
            let orInputCounter = 1;
            const importChildOrs = (childOr: Or): void => {
                for (const ch of childOr.children) {
                    if (ch.children.length > 0 && ch.children[ch.children.length - 1] instanceof Or) {
                        importChildOrs(ch.children[ch.children.length - 1] as Or);
                    } else {
                        this._sb.appendLine(`<Wire UId="${this._currentId}">${op.debugInfo !== null ? ` <!-- dbg: ${op.debugInfo}-->` : ''}<!-- Wire 2 Or -->`);
                        this._sb.appendLine(`<NameCon UId="${ch.operationId}" Name="out" />  <!-- ${ch.toString()} -->`);
                        this._sb.appendLine(`<NameCon UId="${op.operationId}" Name="in${orInputCounter}" />  <!-- ${op.toString()} -->`);
                        this._sb.appendLine('</Wire>');
                        orInputCounter++;
                        this._currentId++;
                    }
                }
            };
            if (!op.doNotCreateContact) {
                importChildOrs(op);
            }
        } else if (op instanceof CompareOperator) {
            let i = 1;
            for (const ch of op.children) {
                this._sb.appendLine(`<Wire UId="${this._currentId}"><!-- Wire CompareOperator -->`);
                this._sb.appendLine(`<IdentCon UId="${(ch as Signal).signalId}" />  <!-- ${ch.toString()} -->`);
                this._sb.appendLine(`<NameCon UId="${op.operationId}" Name="in${i}" />  <!-- ${op.toString()} -->`);
                this._sb.appendLine('</Wire>');
                i++;
                this._currentId++;
            }
        } else if (op instanceof Move || op instanceof S_Move || op instanceof Convert) {
            this._sb.appendLine(`<Wire UId="${this._currentId}"><!-- Wire Move or S_Move -->`);
            this._sb.appendLine(`<IdentCon UId="${(op.children[op.children.length - 1] as Signal).signalId}" />  <!-- ${(op.children[op.children.length - 1] as Signal).name} -->`);
            this._sb.appendLine(`<NameCon UId="${op.operationId}" Name="in" />  <!-- ${op.toString()} -->`);
            this._sb.appendLine('</Wire>');
            this._currentId++;
            if (op instanceof S_Move) {
                this._sb.appendLine(`<Wire UId="${this._currentId}">`);
                this._sb.appendLine(`<NameCon UId="${op.operationId}" Name="out" />  <!-- ${op.toString()} -->`);
                this._sb.appendLine(`<IdentCon UId="${(op.children[0] as Signal).signalId}" />  <!-- ${(op.children[0] as Signal).name} -->`);
                this._sb.appendLine('</Wire>');
                this._currentId++;
            } else if (op instanceof Convert) {
                this._sb.appendLine(`<Wire UId="${this._currentId}">`);
                this._sb.appendLine(`<NameCon UId="${op.operationId}" Name="out" />  <!-- ${op.constructor.name} -->`);
                this._sb.appendLine(`<IdentCon UId="${(op.children[0] as Signal).signalId}" />  <!-- ${(op.children[0] as Signal).name} -->`);
                this._sb.appendLine('</Wire>');
                this._currentId++;
            } else {
                for (let n = 0; n < op.children.length - 1; n++) {
                    this._sb.appendLine(`<Wire UId="${this._currentId}">`);
                    this._sb.appendLine(`<NameCon UId="${op.operationId}" Name="out${n + 1}" />  <!-- ${op.constructor.name} -->`);
                    this._sb.appendLine(`<IdentCon UId="${(op.children[n] as Signal).signalId}" />  <!-- ${(op.children[n] as Signal).name} -->`);
                    this._sb.appendLine('</Wire>');
                    this._currentId++;
                }
            }
        } else if (op instanceof And) {
            for (let n = 0; n < op.children.length - 1; n++) {
                const ch = op.children[n];
                const next = op.children[n + 1];
                if (next instanceof Or) {
                    this._sb.appendLine(`<Wire UId="${this._currentId}">${op.debugInfo !== null ? ` <!-- dbg: ${op.debugInfo}-->` : ''}<!-- Wire And next Or -->`);
                    this._sb.appendLine(`<NameCon UId="${ch.operationId}" Name="out" />${ch instanceof Signal ? '  <!-- ' + (ch as Signal).name + ' -->' : ''}`);
                    for (const orSignal of next.children) {
                        for (const os of this.getAllOrSignals(orSignal)) {
                            const opId = os.operationId;
                            let ipName = 'in';
                            if (
                                os instanceof BaseOperationOrSignal &&
                                (
                                    (os as BaseOperationOrSignal).getFirstChildNotAnd() instanceof CompareOperator ||
                                    (os as BaseOperationOrSignal).getFirstChildNotAnd() instanceof InRangeCall ||
                                    (os as BaseOperationOrSignal).getFirstChildNotAnd() instanceof OutRangeCall
                                )
                            ) {
                                ipName = 'pre';
                            }
                            this._sb.appendLine(`<NameCon UId="${opId}" Name="${ipName}" />${os instanceof Signal ? '  <!-- ' + (os as Signal).name + ' -->' : ''}`);
                        }
                    }
                    this._sb.appendLine('</Wire>');
                    this._currentId++;
                } else {
                    this._sb.appendLine(`<Wire UId="${this._currentId}">${op.debugInfo !== null ? ` <!-- dbg: ${op.debugInfo}-->` : ''}<!-- Wire And -->`);
                    let outName = 'out';
                    if (ch instanceof FunctionCall || ch instanceof S_Move || ch instanceof Move || ch instanceof Convert)
                        outName = 'eno';

                    const srcName = ch instanceof Signal ? (ch as Signal).name : ch.constructor.name;
                    const dstName = next instanceof Signal ? (next as Signal).name : next.constructor.name;
                    this._sb.appendLine(`<NameCon UId="${ch.operationId}" Name="${outName}" />  <!-- ${srcName} -->`);

                    if (next instanceof CompareOperator || next instanceof InRangeCall || next instanceof OutRangeCall) {
                        this._sb.appendLine(`<NameCon UId="${next.operationId}" Name="pre" />  <!-- ${dstName} -->`);
                    } else if (next instanceof CTUCall || next instanceof CTUDCall) {
                        this._sb.appendLine(`<NameCon UId="${next.operationId}" Name="CU" />  <!-- ${dstName} -->`);
                    } else if (next instanceof FunctionCall) {
                        const noEnName = (next as FunctionCall).hasNoEn ? 'in' : 'en';
                        this._sb.appendLine(`<NameCon UId="${next.operationId}" Name="${noEnName}" />  <!-- ${dstName} -->`);
                    } else if (this.isIFunctionOperation(next)) {
                        this._sb.appendLine(`<NameCon UId="${next.operationId}" Name="en" />  <!-- ${dstName} -->`);
                    } else if (next instanceof Distributor) {
                        this._sb.appendLine('<!-- Distributor -->');
                        for (const c of next.children) {
                            let akC: IOperationOrSignal = c;
                            if (c instanceof BaseCoil && c.children.length > 0) {
                                akC = c.children[c.children.length - 1];
                            } else if (c instanceof And && c.children.length > 0) {
                                akC = c.children[0];
                            }

                            let l: IOperationOrSignal[] = [akC];
                            if (akC instanceof Or) l = akC.children;

                            for (const sIn of l) {
                                for (const s of this.getAllOrSignals(sIn)) {
                                    if (s instanceof CompareOperator || s instanceof InRangeCall || s instanceof OutRangeCall) {
                                        this._sb.appendLine(`<NameCon UId="${s.operationId}" Name="pre" />  <!-- ${s.constructor.name} -->`);
                                    } else if (s instanceof FunctionCall) {
                                        const noEnName2 = (s as FunctionCall).hasNoEn ? 'in' : 'en';
                                        this._sb.appendLine(`<NameCon UId="${s.operationId}" Name="${noEnName2}" />  <!-- ${s.constructor.name} -->`);
                                    } else if (this.isIFunctionOperation(s)) {
                                        this._sb.appendLine(`<NameCon UId="${s.operationId}" Name="en" />  <!-- ${s.constructor.name} -->`);
                                    } else {
                                        this._sb.appendLine(`<NameCon UId="${s.operationId}" Name="in" />  <!-- ${s.constructor.name} -->`);
                                    }
                                }
                            }
                        }
                    } else {
                        this._sb.appendLine(`<NameCon UId="${next.operationId}" Name="in" />  <!-- ${dstName} -->`);
                    }
                    this._sb.appendLine('</Wire>');
                    this._currentId++;
                }
            }
        } else if (op instanceof BaseCoil) {
            if (op.children.length > 1) {
                let ch: IOperationOrSignal;
                if (op.children[1] instanceof Signal) {
                    ch = op.children[1];
                } else {
                    ch = op.children[1].children[op.children[1].children.length - 1];
                }

                if (
                    op.children[1] instanceof Or ||
                    op.children[1] instanceof CompareOperator ||
                    op.children[1] instanceof Move ||
                    op.children[1] instanceof Convert ||
                    op.children[1] instanceof S_Move ||
                    op.children[1] instanceof BaseCoil
                ) {
                    ch = op.children[op.children.length - 1];
                }
                const sig = op.children[0];

                let outName = 'out';
                if (ch instanceof FunctionCall || ch instanceof Move || ch instanceof S_Move || ch instanceof Convert)
                    outName = 'eno';

                this._sb.appendLine(`<Wire UId="${this._currentId}"><!-- Wire ${op.toString()} -->`);
                this._sb.appendLine(`<NameCon UId="${ch.operationId}" Name="${outName}" />  <!-- ${ch.constructor.name}${ch instanceof Signal ? ' (' + (ch as Signal).name + ')' : ''} -->`);
                this._sb.appendLine(`<NameCon UId="${sig.operationId}" Name="in" />  <!-- ${sig.constructor.name}${sig instanceof Signal ? ' (' + (sig as Signal).name + ')' : ''} -->`);
                this._sb.appendLine('</Wire>');
                this._currentId++;
            }
        }
    }

    private addPowerrails(network: Network): void {
        const ops = KopCodeHelper.flattenOrdered(network.children, x => x.children);
        this._sb.appendLine(`<Wire UId="${this._currentId}">`);
        this._sb.appendLine('<Powerrail />');

        for (const s of ops) {
            let noPowerRail = false;
            let p: IOperationOrSignal = s;

            if (s instanceof FunctionCall) {
                while (p.parent !== null) {
                    const pp = p.parent;
                    if (
                        pp instanceof And ||
                        pp instanceof CompareOperator ||
                        pp instanceof Convert ||
                        pp instanceof Move ||
                        pp instanceof S_Move
                    ) {
                        if (pp.children.indexOf(p) > 0) noPowerRail = true;
                    }
                    p = p.parent;
                    if (noPowerRail) break;
                }
                if (!noPowerRail) {
                    if (s instanceof InRangeCall || s instanceof OutRangeCall) {
                        this._sb.appendLine(`<NameCon UId="${s.operationId}" Name="pre" />  <!-- ${(s as FunctionCall).functionName} -->`);
                    } else {
                        this._sb.appendLine(`<NameCon UId="${s.operationId}" Name="en" />  <!-- ${(s as FunctionCall).functionName} -->`);
                    }
                }
                noPowerRail = true;
            } else if (s.parent instanceof FunctionCall) {
                noPowerRail = true;
            } else if (s.parent instanceof BaseCoil && s.parent.children.indexOf(p) === 0) {
                noPowerRail = true;
            } else if (
                (s instanceof Coil || s instanceof SCoil || s instanceof RCoil) &&
                s.children.length === 1 &&
                s.children[0] instanceof Signal &&
                (s.parent === null || s.parent instanceof Network)
            ) {
                this._sb.appendLine(`<NameCon UId="${s.operationId}" Name="in" />  <!-- ${s.toString()} - ${s.children[0].toString()} -->`);
            } else if (s instanceof Signal) {
                if (p.parent instanceof FunctionCall) {
                    noPowerRail = true;
                } else {
                    while (p.parent !== null) {
                        const pp = p.parent;
                        if (
                            pp instanceof And ||
                            pp instanceof CompareOperator ||
                            pp instanceof Convert ||
                            pp instanceof Move ||
                            pp instanceof S_Move
                        ) {
                            if (pp.children.indexOf(p) > 0) noPowerRail = true;
                        } else if (pp instanceof FunctionCall) {
                            break;
                        }
                        p = p.parent;
                        if (noPowerRail) break;
                    }
                }
            }

            if (!noPowerRail && s instanceof Signal) {
                const sng = s as Signal;
                const par = s.parent;

                if (par instanceof CompareOperator) {
                    this._sb.appendLine(`<NameCon UId="${par.operationId}" Name="pre" />  <!-- ${par.constructor.name} -->`);
                } else if (par instanceof Move || par instanceof S_Move || par instanceof Convert) {
                    this._sb.appendLine(`<NameCon UId="${par.operationId}" Name="en" />  <!-- ${par.constructor.name} -->`);
                } else {
                    this._sb.appendLine(`<NameCon UId="${sng.operationId}" Name="in" />  <!-- ${sng.name} -->`);
                }
            }
        }
        this._sb.appendLine('</Wire>');
        this._currentId++;
    }

    private fixChildAndsAndSingleOr(s: IOperationOrSignal | null): void {
        let fixAgain = false;
        const newChildren: IOperationOrSignal[] = [];
        if (s !== null && s.children !== null) {
            if (s instanceof BaseCoil && s.children.length === 2 && s.children[1] instanceof Signal) {
                s.children[1] = new And(s.children[1]);
            } else {
                for (const op of s.children.slice()) {
                    if ((s instanceof And || s instanceof Or) && op instanceof Or && op.children.length === 1) {
                        for (const p of op.children) {
                            newChildren.push(p);
                            fixAgain = true;
                        }
                    } else if (s instanceof And && op instanceof And) {
                        for (const p of op.children) {
                            newChildren.push(p);
                            s.children.push(p);
                            fixAgain = true;
                        }
                    } else {
                        newChildren.push(op);
                        this.fixChildAndsAndSingleOr(op);
                    }
                }
                s.children = newChildren;
                if (fixAgain) this.fixChildAndsAndSingleOr(s);
            }
        }
    }

    private escapeForXml(text: string): string {
        return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    private printTreeParent(signal: IOperationOrSignal | null): string {
        if (signal !== null) {
            let t = '';
            if (signal instanceof Signal) t = ` (${(signal as Signal).name})`;
            if (signal instanceof Coil) t = ` (${(signal as Coil).signal.name})`;
            if (signal instanceof Network) t = ` (${(signal as Network).networkTitle ?? ''})`;
            if (signal instanceof CodeBlock) t = ` (${(signal as CodeBlock).name ?? ''})`;
            const p = this.printTreeParent(signal.parent);
            return (p !== '' ? p + ' -> ' : '') + signal.constructor.name + t;
        }
        return '';
    }

    private setParent(s: IOperationOrSignal): void {
        for (const op of s.children) {
            if (op.parent !== null) {
                throw new Error(
                    '\n\nIOperationOrSignal reused wich is not valid!\n' +
                    this.printTreeParent(op.parent) + '\n\n' +
                    this.printTreeParent(s) + '\n\n'
                );
            }
            op.parent = s;
            this.setParent(op);
        }
    }

    getXml(idRef: { value: number }): string {
        this.fixChildAndsAndSingleOr(this._block);
        this.setParent(this._block);
        const allChildren = flatten(this._block.children, x => x.children);
        const networks = allChildren.filter((x): x is Network => x instanceof Network);

        for (const network of networks) {
            this.checkAndAndOr(this._block, network);
            try {
                this._sb.appendLine(`<SW.Blocks.CompileUnit ID="${idRef.value}" CompositionName="CompileUnits"> <!--${this.escapeForXml(network.networkTitle ?? '').replace(/-/g, '')}-->`);
                idRef.value++;
                this._sb.appendLine('<AttributeList>');
                if (network.children.length > 0) {
                    this._sb.appendLine('<NetworkSource><FlgNet xmlns="http://www.siemens.com/automation/Openness/SW/NetworkSource/FlgNet/v1">');
                    this._sb.appendLine('<Parts>');
                    this.addSignalDefinitions(network);
                    this.addContactDefinitions(network, this._block);
                    this._sb.appendLine('</Parts>');
                    this._sb.appendLine('<Wires>');
                    this.addPowerrails(network);
                    this.addWires(network);
                    this._sb.appendLine('</Wires>');
                    this._sb.appendLine('</FlgNet></NetworkSource>');
                }
                this._sb.appendLine(`<ProgrammingLanguage>${this._block.safety ? 'F_LAD' : 'LAD'}</ProgrammingLanguage>`);
                this._sb.appendLine('</AttributeList>');
                this._sb.appendLine('<ObjectList>');

                this._sb.appendLine(`<MultilingualText ID="${idRef.value}" CompositionName="Comment">`);
                idRef.value++;
                this._sb.appendLine('<ObjectList>');
                this._sb.appendLine(`<MultilingualTextItem ID="${idRef.value}" CompositionName="Items">`);
                idRef.value++;
                this._sb.appendLine('<AttributeList>');
                this._sb.appendLine('<Culture>de-DE</Culture>');
                this._sb.appendLine(`<Text>${network.description}</Text>`);
                this._sb.appendLine('</AttributeList>');
                this._sb.appendLine('</MultilingualTextItem>');
                this._sb.appendLine(`<MultilingualTextItem ID="${idRef.value}" CompositionName="Items">`);
                idRef.value++;
                this._sb.appendLine('<AttributeList>');
                this._sb.appendLine('<Culture>en-GB</Culture>');
                this._sb.appendLine(`<Text>${network.descriptionEnglish}</Text>`);
                this._sb.appendLine('</AttributeList>');
                this._sb.appendLine('</MultilingualTextItem>');
                this._sb.appendLine('</ObjectList>');
                this._sb.appendLine('</MultilingualText>');

                this._sb.appendLine(`<MultilingualText ID="${idRef.value}" CompositionName="Title">`);
                idRef.value++;
                this._sb.appendLine('<ObjectList>');
                this._sb.appendLine(`<MultilingualTextItem ID="${idRef.value}" CompositionName="Items">`);
                idRef.value++;
                this._sb.appendLine('<AttributeList>');
                this._sb.appendLine('<Culture>de-DE</Culture>');
                this._sb.appendLine(`<Text>${this.escapeForXml(network.networkTitle ?? '')}</Text>`);
                this._sb.appendLine('</AttributeList>');
                this._sb.appendLine('</MultilingualTextItem>');
                this._sb.appendLine(`<MultilingualTextItem ID="${idRef.value}" CompositionName="Items">`);
                idRef.value++;
                this._sb.appendLine('<AttributeList>');
                this._sb.appendLine('<Culture>en-GB</Culture>');
                this._sb.appendLine(`<Text>${this.escapeForXml(network.networkTitleEnglish ?? '')}</Text>`);
                this._sb.appendLine('</AttributeList>');
                this._sb.appendLine('</MultilingualTextItem>');
                this._sb.appendLine('</ObjectList>');
                this._sb.appendLine('</MultilingualText>');
                this._sb.appendLine('</ObjectList>');
                this._sb.appendLine('</SW.Blocks.CompileUnit>');
            } catch (ex) {
                throw new Error(`Error generating Network: ${network.networkTitle} in Block: ${this._block.name}\n${(ex as Error).message}`);
            }
        }

        return this._sb.toString();
    }

    getAllOrSignals(sng: IOperationOrSignal): IOperationOrSignal[] {
        const result: IOperationOrSignal[] = [];
        if (sng instanceof And) {
            if (sng.children.length > 0 && sng.children[0] instanceof Or) {
                const or = sng.children[0] as Or;
                for (const o of or.children) {
                    result.push(...this.getAllOrSignals(o));
                }
            } else {
                result.push(sng.children[0]);
            }
        } else {
            result.push(sng);
        }
        return result;
    }

    private isIPartName(op: IOperationOrSignal): boolean {
        return 'partName' in op && typeof (op as any).partName === 'string';
    }

    private isIFunctionOperation(op: IOperationOrSignal): boolean {
        // Check if op implements IFunctionOperation (Move, Convert, S_Move)
        return op instanceof Move || op instanceof Convert || op instanceof S_Move;
    }
}
