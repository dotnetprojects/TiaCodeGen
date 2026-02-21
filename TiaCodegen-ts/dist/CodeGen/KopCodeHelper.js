"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KopCodeHelper = void 0;
const StringBuilder_1 = require("../utils/StringBuilder");
const IEnumerableExtensions_1 = require("../Internal/IEnumerableExtensions");
const NaturalComparer_1 = require("../Extensions/NaturalComparer");
const CodeBlock_1 = require("../Blocks/CodeBlock");
const Network_1 = require("../Blocks/Network");
const And_1 = require("../Commands/And");
const Or_1 = require("../Commands/Or");
const Not_1 = require("../Commands/Not");
const Distributor_1 = require("../Commands/Distributor");
const Move_1 = require("../Commands/Move");
const Convert_1 = require("../Commands/Convert");
const S_Move_1 = require("../Commands/S_Move");
const Signal_1 = require("../Commands/Signals/Signal");
const BaseCoil_1 = require("../Commands/Coils/BaseCoil");
const BaseNPCoil_1 = require("../Commands/Coils/BaseNPCoil");
const Coil_1 = require("../Commands/Coils/Coil");
const SCoil_1 = require("../Commands/Coils/SCoil");
const RCoil_1 = require("../Commands/Coils/RCoil");
const BaseOperationOrSignal_1 = require("../Commands/BaseOperationOrSignal");
const CompareOperator_1 = require("../Commands/Comparisons/CompareOperator");
const InRangeCall_1 = require("../Commands/Comparisons/InRangeCall");
const OutRangeCall_1 = require("../Commands/Comparisons/OutRangeCall");
const FunctionCall_1 = require("../Commands/Functions/Base/FunctionCall");
const FunctionBlockCall_1 = require("../Commands/Functions/Base/FunctionBlockCall");
const SystemFunctionCall_1 = require("../Commands/Functions/Base/SystemFunctionCall");
const SystemFunctionBlockCall_1 = require("../Commands/Functions/Base/SystemFunctionBlockCall");
const ArithmeticCall_1 = require("../Commands/Functions/Arithmetic/ArithmeticCall");
const VariableArithmeticCall_1 = require("../Commands/Functions/Arithmetic/VariableArithmeticCall");
const AckGlCall_1 = require("../Commands/Functions/AckGlCall");
const CTUCall_1 = require("../Commands/Functions/CTUCall");
const CTUDCall_1 = require("../Commands/Functions/CTUDCall");
const OperationOrSignalExtensions_1 = require("../Extensions/OperationOrSignalExtensions");
class KopCodeHelper {
    static flattenOrdered(e, f) {
        const result = [];
        for (const el of e) {
            for (const el2 of KopCodeHelper.flattenOrdered(f(el), f)) {
                result.push(el2);
            }
            result.push(el);
        }
        return result;
    }
    constructor(block) {
        this._currentId = 21;
        this._block = block;
        this._sb = new StringBuilder_1.StringBuilder();
    }
    addSignalDefinitions(network) {
        const allChildren = (0, IEnumerableExtensions_1.flatten)(network.children, x => x.children);
        const signals = allChildren
            .filter((x) => x instanceof Signal_1.Signal)
            .slice()
            .sort((a, b) => new NaturalComparer_1.NaturalComparer().compare(a.name, b.name));
        for (const signal of signals) {
            signal.addXmlToStringBuilder(this._currentId, this._sb);
            signal.signalId = this._currentId;
            this._currentId++;
        }
    }
    checkAndAndOr(block, network) {
        const allChildren = (0, IEnumerableExtensions_1.flatten)(network.children, x => x.children);
        const ors = allChildren.filter((x) => x instanceof Or_1.Or);
        for (const or of ors) {
            if (or.children.length === 0) {
                throw new Error(`Empty Or im Baustein "${block.name}" Netzwerk "${network.networkTitle}"`);
            }
        }
    }
    printTree(signal, sb, level = 0) {
        sb.appendLine(' '.repeat(level * 4) + signal.toString() + ' OP ID: ' + signal.operationId);
        for (const s of signal.children) {
            this.printTree(s, sb, level + 1);
        }
    }
    addContactDefinitions(network, block) {
        const ops = KopCodeHelper.flattenOrdered(network.children, x => x.children)
            .filter((x) => true);
        for (const op of ops) {
            if (op instanceof Signal_1.Signal) {
                // nothing
            }
            else if (op instanceof And_1.And || (op instanceof Or_1.Or && op.children.length === 1)) {
                // nothing
            }
            else {
                if (op instanceof Or_1.Or && op.children.length > 1) {
                    op.createContactAndFillCardinality(op);
                }
            }
        }
        for (const op of ops) {
            if (op instanceof Signal_1.Signal) {
                if (!(op.parent instanceof BaseCoil_1.BaseCoil) &&
                    !(op.parent instanceof Not_1.Not) &&
                    !(op.parent instanceof FunctionCall_1.FunctionCall) &&
                    !(op.parent instanceof CompareOperator_1.CompareOperator) &&
                    !(op.parent instanceof Move_1.Move) &&
                    !(op.parent instanceof Convert_1.Convert) &&
                    !(op.parent instanceof S_Move_1.S_Move)) {
                    op.operationId = this._currentId;
                    this._currentId++;
                }
            }
            else if (op instanceof And_1.And || (op instanceof Or_1.Or && op.children.length === 1)) {
                op.operationId = op.children[op.children.length - 1].operationId;
            }
            else {
                op.operationId = this._currentId;
                if (op instanceof Not_1.Not || op instanceof BaseCoil_1.BaseCoil || op instanceof SystemFunctionBlockCall_1.SystemFunctionBlockCall || op instanceof SystemFunctionCall_1.SystemFunctionCall) {
                    if (op.children.length > 0) {
                        op.children[0].operationId = this._currentId;
                    }
                }
                if (op instanceof Or_1.Or && op.children.length > 1) {
                    op.createContactAndFillCardinality(op);
                }
                if (!(op instanceof Distributor_1.Distributor) && !op.doNotCreateContact) {
                    this._currentId++;
                }
            }
        }
        for (const op of ops) {
            let partname = op.constructor.name;
            if (this.isIPartName(op)) {
                partname = op.partName;
            }
            if (op instanceof Signal_1.Signal) {
                if (!(op.parent instanceof BaseCoil_1.BaseCoil) &&
                    !(op.parent instanceof Not_1.Not) &&
                    !(op.parent instanceof FunctionCall_1.FunctionCall) &&
                    !(op.parent instanceof CompareOperator_1.CompareOperator) &&
                    !(op.parent instanceof Move_1.Move) &&
                    !(op.parent instanceof Convert_1.Convert) &&
                    !(op.parent instanceof S_Move_1.S_Move)) {
                    this._sb.appendLine(`<Part Name="Contact" UId="${op.operationId}" /><!-- ${op.name} -->`);
                }
            }
            else if (op instanceof Or_1.Or && op.children.length > 1) {
                if (!op.doNotCreateContact) {
                    this._sb.appendLine(`<Part Name="O" UId="${op.operationId}"><!-- Or (Signals...) -->`);
                    this._sb.appendLine(`<TemplateValue Name="Card" Type="Cardinality">${op.cardinality}</TemplateValue>`);
                    this._sb.appendLine('</Part>');
                }
            }
            else if (op instanceof CompareOperator_1.CompareOperator) {
                this._sb.appendLine(`<Part Name="${op.constructor.name}" UId="${op.operationId}">`);
                let srctype = op.children[0].signalType.toString();
                if (srctype.startsWith('Constant'))
                    srctype = srctype.substring(8);
                this._sb.appendLine(`<TemplateValue Name="SrcType" Type="Type">${srctype}</TemplateValue>`);
                this._sb.appendLine('</Part>');
            }
            else if (op instanceof Convert_1.Convert) {
                this._sb.appendLine(`<Part Name="${op.constructor.name}" UId="${op.operationId}">`);
                let srctype = op.children[op.children.length - 1].signalType.toString();
                let desttype = op.children[0].signalType.toString();
                if (srctype.startsWith('Constant'))
                    srctype = srctype.substring(8);
                if (desttype.startsWith('Constant'))
                    desttype = desttype.substring(8);
                this._sb.appendLine(`<TemplateValue Name="SrcType" Type="Type">${srctype}</TemplateValue>`);
                this._sb.appendLine(`<TemplateValue Name="DestType" Type="Type">${desttype}</TemplateValue>`);
                this._sb.appendLine('</Part>');
            }
            else if (op instanceof Move_1.Move) {
                this._sb.appendLine(`<Part Name="Move" UId="${op.operationId}" ${this._block.safety ? '' : 'DisabledENO="true"'}>`);
                this._sb.appendLine(`<TemplateValue Name="Card" Type="Cardinality">${op.cardinality}</TemplateValue>`);
                this._sb.appendLine('</Part>');
            }
            else if (op instanceof S_Move_1.S_Move) {
                this._sb.appendLine(`<Part Name="S_Move" UId="${op.operationId}" ${this._block.safety ? '' : 'DisabledENO="true"'} />`);
            }
            else if (op instanceof Not_1.Not) {
                this._sb.appendLine(`<Part Name="Contact" UId="${op.operationId}">`);
                this._sb.appendLine('<Negated Name="operand"/>');
                this._sb.appendLine('</Part>');
            }
            else if (op instanceof BaseCoil_1.BaseCoil) {
                const coil = op;
                if (coil.negated) {
                    this._sb.appendLine(`<Part Name="${partname}" UId="${op.operationId}"><!-- ${coil.signal.name} -->`);
                    this._sb.appendLine('\t<Negated Name="operand" />');
                    this._sb.appendLine('</Part>');
                }
                else {
                    this._sb.appendLine(`<Part Name="${partname}" UId="${op.operationId}"/><!-- ${coil.signal.name} -->`);
                }
            }
            else if (op instanceof And_1.And || op instanceof Or_1.Or) {
                // nothing
            }
            else if (op instanceof SystemFunctionBlockCall_1.SystemFunctionBlockCall) {
                const fc = op;
                this._sb.appendLine(`<Part Name="${fc.functionName}" UId="${op.operationId}">`);
                if (fc.additionalInnerXml !== null)
                    this._sb.appendLine(fc.additionalInnerXml);
                const fb = op;
                if (fb.instanceName.startsWith('"')) {
                    this._sb.appendLine(`<Instance UId="${this._currentId}" Scope="GlobalVariable">`);
                    this._currentId++;
                    this._sb.appendLine(`<Component Name="${fb.instanceName.replace(/"/g, '')}" />`);
                    this._sb.appendLine('</Instance>');
                }
                else {
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
                            }
                            else {
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
                        }
                        else {
                            this._sb.appendLine(`<Component Name="${part}">`);
                        }
                        this._sb.appendLine('</Component>');
                    }
                    this._sb.appendLine('</Instance>');
                }
                if (fc.templateValueName !== null) {
                    this._sb.appendLine(`<TemplateValue Name="${fc.templateValueName}" Type="${fc.templateValueType}">${fc.templateValue}</TemplateValue>`);
                    if (fc.safetyTemplateString !== null && (0, OperationOrSignalExtensions_1.tryGetParent)(fc, CodeBlock_1.CodeBlock)?.safety === true) {
                        this._sb.appendLine(fc.safetyTemplateString);
                    }
                }
                if (this._block.safety && fc.additionalSafetyTemplateValues !== null) {
                    this._sb.appendLine(fc.additionalSafetyTemplateValues);
                }
                this._sb.appendLine('</Part>');
            }
            else if (op instanceof SystemFunctionCall_1.SystemFunctionCall) {
                const fc = op;
                if (fc.functionName === 'Serialize' || fc.functionName === 'Deserialize') {
                    this._sb.appendLine(`<Part Name="${fc.functionName}" Version="2.0" UId="${op.operationId}"${fc.disableEno ? ' DisabledENO="true"' : ''}>`);
                }
                else {
                    this._sb.appendLine(`<Part Name="${fc.functionName}" UId="${op.operationId}"${fc.disableEno ? ' DisabledENO="true"' : ''}>`);
                }
                if (fc.additionalInnerXml !== null)
                    this._sb.appendLine(fc.additionalInnerXml);
                if (fc instanceof ArithmeticCall_1.ArithmeticCall) {
                    if (fc instanceof VariableArithmeticCall_1.VariableArithmeticCall) {
                        this._sb.appendLine(`<TemplateValue Name="Card" Type="Cardinality">${fc.children.length - 1}</TemplateValue>`);
                    }
                    this._sb.appendLine(`<TemplateValue Name="SrcType" Type="Type">${fc.type}</TemplateValue>`);
                }
                else if (fc instanceof InRangeCall_1.InRangeCall || fc instanceof OutRangeCall_1.OutRangeCall) {
                    let srctype = op.children[0].signalType.toString();
                    if (srctype.startsWith('Constant'))
                        srctype = srctype.substring(8);
                    this._sb.appendLine(`<TemplateValue Name="SrcType" Type="Type">${srctype}</TemplateValue>`);
                }
                else if (fc.functionName === 'DPRD_DAT' || fc.functionName === 'DPWR_DAT') {
                    this._sb.appendLine('<TemplateValue Name="ptr_type" Type="Type">Variant</TemplateValue>');
                    this._sb.appendLine('<TemplateValue Name="laddr_type" Type="Type">HW_IO</TemplateValue>');
                }
                this._sb.appendLine('</Part>');
            }
            else if (op instanceof FunctionCall_1.FunctionCall) {
                const fc = op;
                if (op instanceof AckGlCall_1.AckGlCall) {
                    this._sb.appendLine(`<Part Name="ACK_GL" Version="1.3" UId="${op.operationId}">`);
                }
                else if (op instanceof FunctionBlockCall_1.FunctionBlockCall) {
                    this._sb.appendLine(`<Call UId="${op.operationId}">`);
                    this._sb.appendLine(`<CallInfo Name="${fc.functionName}" BlockType="FB">`);
                }
                else {
                    this._sb.appendLine(`<Call UId="${op.operationId}">`);
                    this._sb.appendLine(`<CallInfo Name="${fc.functionName}" BlockType="FC">`);
                }
                if (op instanceof FunctionBlockCall_1.FunctionBlockCall) {
                    const fb = op;
                    if (fb.instanceName.startsWith('"')) {
                        this._sb.appendLine(`<Instance UId="${this._currentId}" Scope="GlobalVariable">`);
                    }
                    else {
                        this._sb.appendLine(`<Instance UId="${this._currentId}" Scope="LocalVariable">`);
                    }
                    this._currentId++;
                    for (const part of fb.instanceName.split('.')) {
                        let instanceNamePart;
                        if (part.startsWith('"')) {
                            instanceNamePart = part.replace(/"/g, '');
                        }
                        else {
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
                            }
                            else {
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
                        }
                        else {
                            this._sb.appendLine(`<Component Name="${instanceNamePart}">`);
                        }
                        this._sb.appendLine('</Component>');
                    }
                    this._sb.appendLine('</Instance>');
                }
                if (op instanceof AckGlCall_1.AckGlCall) {
                    this._sb.appendLine('<TemplateValue Name="f_user_card" Type="Cardinality">1</TemplateValue>');
                    this._sb.appendLine('<TemplateValue Name="f_image_card" Type="Cardinality">0</TemplateValue>');
                    this._sb.appendLine('<TemplateValue Name="codedbool_type" Type="Type">DInt</TemplateValue>');
                    this._sb.appendLine('</Part>');
                }
                else {
                    for (const [key, intf] of Object.entries(fc.iface)) {
                        if (intf.direction !== 'Eno') {
                            let type = 'Bool';
                            if (intf.operationOrSignal instanceof Signal_1.Signal) {
                                const sig = intf.operationOrSignal;
                                if (sig.signalType === 'Custom') {
                                    type = sig.customType ?? 'Bool';
                                }
                                else {
                                    type = sig.signalType.toString();
                                }
                            }
                            if (type !== 'Constant' && type.startsWith('Constant')) {
                                type = type.substring(8);
                            }
                            type = intf.type !== null ? intf.type.toString() : type;
                            if (intf.length > 0) {
                                this._sb.appendLine(`<Parameter Name="${key}" Section="${intf.direction.toString()}" Type="${type}[${intf.length}]" />`);
                            }
                            else {
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
    addWires(op) {
        if (op.children !== null) {
            for (const lop of op.children) {
                this.addWires(lop);
            }
        }
        if (op instanceof FunctionCall_1.FunctionCall) {
            const fc = op;
            for (const [key, intf] of Object.entries(fc.iface)) {
                const sng = intf.operationOrSignal;
                if (fc instanceof ArithmeticCall_1.ArithmeticCall && sng === null) {
                    // skip
                }
                else if (sng === null) {
                    this._sb.appendLine(`<Wire UId="${this._currentId}"><!-- Wire 1 FunctionCall -->`);
                    this._currentId++;
                    this._sb.appendLine(`<NameCon UId="${op.operationId}" Name="${key}" />`);
                    this._sb.appendLine(`<OpenCon UId="${this._currentId}" />`);
                    this._currentId++;
                    this._sb.appendLine('</Wire>');
                }
                else if (intf.direction === 'Input' || intf.direction === 'InOut') {
                    this._sb.appendLine(`<Wire UId="${this._currentId}"><!-- Wire 2 FunctionCall -->`);
                    if (sng instanceof Signal_1.Signal) {
                        this._sb.appendLine(`<IdentCon UId="${sng.signalId}" />  <!-- ${sng.name} -->`);
                    }
                    else {
                        if (sng instanceof Or_1.Or) {
                            this._sb.appendLine(`<NameCon UId="${sng.operationId}" Name="out" />`);
                        }
                        else {
                            this._sb.appendLine(`<NameCon UId="${sng.children[sng.children.length - 1].operationId}" Name="out" />`);
                        }
                    }
                    this._sb.appendLine(`<NameCon UId="${op.operationId}" Name="${key}" />`);
                    this._sb.appendLine('</Wire>');
                    this._currentId++;
                }
                else if (intf.direction === 'Eno') {
                    this._sb.appendLine(`<Wire UId="${this._currentId}"><!-- Wire 3 FunctionCall -->`);
                    this._sb.appendLine(`<NameCon UId="${op.operationId}" Name="eno" />`);
                    this._sb.appendLine(`<NameCon UId="${sng.children[sng.children.length - 1].operationId}" Name="in" />`);
                    this._sb.appendLine('</Wire>');
                    this._currentId++;
                }
                else {
                    this._sb.appendLine(`<Wire UId="${this._currentId}"><!-- Wire 4 FunctionCall -->`);
                    this._sb.appendLine(`<NameCon UId="${op.operationId}" Name="${key}" />`);
                    if (sng instanceof Distributor_1.Distributor) {
                        this._sb.appendLine('<!-- Distributor -->');
                        for (const c of sng.children) {
                            if (c instanceof Signal_1.Signal) {
                                this._sb.appendLine(`<IdentCon UId="${c.signalId}" />  <!-- ${c.name} -->`);
                            }
                            else if (c instanceof And_1.And && c.children.length > 0 && c.children[0] instanceof Or_1.Or) {
                                for (const chIn of c.children[0].children) {
                                    for (const ch of this.getAllOrSignals(chIn)) {
                                        const inName = ch instanceof FunctionCall_1.FunctionCall
                                            ? ((ch instanceof InRangeCall_1.InRangeCall || ch instanceof OutRangeCall_1.OutRangeCall) ? 'pre' : 'en')
                                            : 'in';
                                        this._sb.appendLine(`<NameCon UId="${ch.operationId}" Name="${inName}" />`);
                                    }
                                }
                            }
                            else {
                                const inName = c instanceof FunctionCall_1.FunctionCall
                                    ? ((c instanceof InRangeCall_1.InRangeCall || c instanceof OutRangeCall_1.OutRangeCall) ? 'pre' : 'en')
                                    : 'in';
                                this._sb.appendLine(`<NameCon UId="${c.operationId}" Name="${inName}" />`);
                            }
                        }
                    }
                    else {
                        if (sng instanceof Signal_1.Signal) {
                            this._sb.appendLine(`<IdentCon UId="${sng.signalId}" />  <!-- ${sng.name} -->`);
                        }
                        else {
                            const inName = sng instanceof FunctionCall_1.FunctionCall
                                ? ((sng instanceof InRangeCall_1.InRangeCall || sng instanceof OutRangeCall_1.OutRangeCall) ? 'pre' : 'en')
                                : 'in';
                            this._sb.appendLine(`<NameCon UId="${sng.operationId}" Name="${inName}" />`);
                        }
                    }
                    this._sb.appendLine('</Wire>');
                    this._currentId++;
                }
            }
        }
        else if (op instanceof Signal_1.Signal &&
            !(op.parent instanceof FunctionCall_1.FunctionCall) &&
            !(op.parent instanceof CompareOperator_1.CompareOperator) &&
            !(op.parent instanceof Move_1.Move) &&
            !(op.parent instanceof Convert_1.Convert) &&
            !(op.parent instanceof S_Move_1.S_Move)) {
            this._sb.appendLine(`<Wire UId="${this._currentId}"><!-- Wire Parent FunctionCall (Parent:${op.parent?.toString()}) -->`);
            this._sb.appendLine(`<IdentCon UId="${op.signalId}" />  <!-- ${op.name} -->`);
            let tname = 'operand';
            if (op.parent instanceof BaseNPCoil_1.BaseNPCoil)
                tname = 'bit';
            this._sb.appendLine(`<NameCon UId="${op.operationId}" Name="${tname}" />  <!-- ${op.name} -->`);
            this._sb.appendLine('</Wire>');
            this._currentId++;
        }
        else if (op instanceof Or_1.Or && op.children.length > 1) {
            let orInputCounter = 1;
            const importChildOrs = (childOr) => {
                for (const ch of childOr.children) {
                    if (ch.children.length > 0 && ch.children[ch.children.length - 1] instanceof Or_1.Or) {
                        importChildOrs(ch.children[ch.children.length - 1]);
                    }
                    else {
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
        }
        else if (op instanceof CompareOperator_1.CompareOperator) {
            let i = 1;
            for (const ch of op.children) {
                this._sb.appendLine(`<Wire UId="${this._currentId}"><!-- Wire CompareOperator -->`);
                this._sb.appendLine(`<IdentCon UId="${ch.signalId}" />  <!-- ${ch.toString()} -->`);
                this._sb.appendLine(`<NameCon UId="${op.operationId}" Name="in${i}" />  <!-- ${op.toString()} -->`);
                this._sb.appendLine('</Wire>');
                i++;
                this._currentId++;
            }
        }
        else if (op instanceof Move_1.Move || op instanceof S_Move_1.S_Move || op instanceof Convert_1.Convert) {
            this._sb.appendLine(`<Wire UId="${this._currentId}"><!-- Wire Move or S_Move -->`);
            this._sb.appendLine(`<IdentCon UId="${op.children[op.children.length - 1].signalId}" />  <!-- ${op.children[op.children.length - 1].name} -->`);
            this._sb.appendLine(`<NameCon UId="${op.operationId}" Name="in" />  <!-- ${op.toString()} -->`);
            this._sb.appendLine('</Wire>');
            this._currentId++;
            if (op instanceof S_Move_1.S_Move) {
                this._sb.appendLine(`<Wire UId="${this._currentId}">`);
                this._sb.appendLine(`<NameCon UId="${op.operationId}" Name="out" />  <!-- ${op.toString()} -->`);
                this._sb.appendLine(`<IdentCon UId="${op.children[0].signalId}" />  <!-- ${op.children[0].name} -->`);
                this._sb.appendLine('</Wire>');
                this._currentId++;
            }
            else if (op instanceof Convert_1.Convert) {
                this._sb.appendLine(`<Wire UId="${this._currentId}">`);
                this._sb.appendLine(`<NameCon UId="${op.operationId}" Name="out" />  <!-- ${op.constructor.name} -->`);
                this._sb.appendLine(`<IdentCon UId="${op.children[0].signalId}" />  <!-- ${op.children[0].name} -->`);
                this._sb.appendLine('</Wire>');
                this._currentId++;
            }
            else {
                for (let n = 0; n < op.children.length - 1; n++) {
                    this._sb.appendLine(`<Wire UId="${this._currentId}">`);
                    this._sb.appendLine(`<NameCon UId="${op.operationId}" Name="out${n + 1}" />  <!-- ${op.constructor.name} -->`);
                    this._sb.appendLine(`<IdentCon UId="${op.children[n].signalId}" />  <!-- ${op.children[n].name} -->`);
                    this._sb.appendLine('</Wire>');
                    this._currentId++;
                }
            }
        }
        else if (op instanceof And_1.And) {
            for (let n = 0; n < op.children.length - 1; n++) {
                const ch = op.children[n];
                const next = op.children[n + 1];
                if (next instanceof Or_1.Or) {
                    this._sb.appendLine(`<Wire UId="${this._currentId}">${op.debugInfo !== null ? ` <!-- dbg: ${op.debugInfo}-->` : ''}<!-- Wire And next Or -->`);
                    this._sb.appendLine(`<NameCon UId="${ch.operationId}" Name="out" />${ch instanceof Signal_1.Signal ? '  <!-- ' + ch.name + ' -->' : ''}`);
                    for (const orSignal of next.children) {
                        for (const os of this.getAllOrSignals(orSignal)) {
                            const opId = os.operationId;
                            let ipName = 'in';
                            if (os instanceof BaseOperationOrSignal_1.BaseOperationOrSignal &&
                                (os.getFirstChildNotAnd() instanceof CompareOperator_1.CompareOperator ||
                                    os.getFirstChildNotAnd() instanceof InRangeCall_1.InRangeCall ||
                                    os.getFirstChildNotAnd() instanceof OutRangeCall_1.OutRangeCall)) {
                                ipName = 'pre';
                            }
                            this._sb.appendLine(`<NameCon UId="${opId}" Name="${ipName}" />${os instanceof Signal_1.Signal ? '  <!-- ' + os.name + ' -->' : ''}`);
                        }
                    }
                    this._sb.appendLine('</Wire>');
                    this._currentId++;
                }
                else {
                    this._sb.appendLine(`<Wire UId="${this._currentId}">${op.debugInfo !== null ? ` <!-- dbg: ${op.debugInfo}-->` : ''}<!-- Wire And -->`);
                    let outName = 'out';
                    if (ch instanceof FunctionCall_1.FunctionCall || ch instanceof S_Move_1.S_Move || ch instanceof Move_1.Move || ch instanceof Convert_1.Convert)
                        outName = 'eno';
                    const srcName = ch instanceof Signal_1.Signal ? ch.name : ch.constructor.name;
                    const dstName = next instanceof Signal_1.Signal ? next.name : next.constructor.name;
                    this._sb.appendLine(`<NameCon UId="${ch.operationId}" Name="${outName}" />  <!-- ${srcName} -->`);
                    if (next instanceof CompareOperator_1.CompareOperator || next instanceof InRangeCall_1.InRangeCall || next instanceof OutRangeCall_1.OutRangeCall) {
                        this._sb.appendLine(`<NameCon UId="${next.operationId}" Name="pre" />  <!-- ${dstName} -->`);
                    }
                    else if (next instanceof CTUCall_1.CTUCall || next instanceof CTUDCall_1.CTUDCall) {
                        this._sb.appendLine(`<NameCon UId="${next.operationId}" Name="CU" />  <!-- ${dstName} -->`);
                    }
                    else if (next instanceof FunctionCall_1.FunctionCall) {
                        const noEnName = next.hasNoEn ? 'in' : 'en';
                        this._sb.appendLine(`<NameCon UId="${next.operationId}" Name="${noEnName}" />  <!-- ${dstName} -->`);
                    }
                    else if (this.isIFunctionOperation(next)) {
                        this._sb.appendLine(`<NameCon UId="${next.operationId}" Name="en" />  <!-- ${dstName} -->`);
                    }
                    else if (next instanceof Distributor_1.Distributor) {
                        this._sb.appendLine('<!-- Distributor -->');
                        for (const c of next.children) {
                            let akC = c;
                            if (c instanceof BaseCoil_1.BaseCoil && c.children.length > 0) {
                                akC = c.children[c.children.length - 1];
                            }
                            else if (c instanceof And_1.And && c.children.length > 0) {
                                akC = c.children[0];
                            }
                            let l = [akC];
                            if (akC instanceof Or_1.Or)
                                l = akC.children;
                            for (const sIn of l) {
                                for (const s of this.getAllOrSignals(sIn)) {
                                    if (s instanceof CompareOperator_1.CompareOperator || s instanceof InRangeCall_1.InRangeCall || s instanceof OutRangeCall_1.OutRangeCall) {
                                        this._sb.appendLine(`<NameCon UId="${s.operationId}" Name="pre" />  <!-- ${s.constructor.name} -->`);
                                    }
                                    else if (s instanceof FunctionCall_1.FunctionCall) {
                                        const noEnName2 = s.hasNoEn ? 'in' : 'en';
                                        this._sb.appendLine(`<NameCon UId="${s.operationId}" Name="${noEnName2}" />  <!-- ${s.constructor.name} -->`);
                                    }
                                    else if (this.isIFunctionOperation(s)) {
                                        this._sb.appendLine(`<NameCon UId="${s.operationId}" Name="en" />  <!-- ${s.constructor.name} -->`);
                                    }
                                    else {
                                        this._sb.appendLine(`<NameCon UId="${s.operationId}" Name="in" />  <!-- ${s.constructor.name} -->`);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        this._sb.appendLine(`<NameCon UId="${next.operationId}" Name="in" />  <!-- ${dstName} -->`);
                    }
                    this._sb.appendLine('</Wire>');
                    this._currentId++;
                }
            }
        }
        else if (op instanceof BaseCoil_1.BaseCoil) {
            if (op.children.length > 1) {
                let ch;
                if (op.children[1] instanceof Signal_1.Signal) {
                    ch = op.children[1];
                }
                else {
                    ch = op.children[1].children[op.children[1].children.length - 1];
                }
                if (op.children[1] instanceof Or_1.Or ||
                    op.children[1] instanceof CompareOperator_1.CompareOperator ||
                    op.children[1] instanceof Move_1.Move ||
                    op.children[1] instanceof Convert_1.Convert ||
                    op.children[1] instanceof S_Move_1.S_Move ||
                    op.children[1] instanceof BaseCoil_1.BaseCoil) {
                    ch = op.children[op.children.length - 1];
                }
                const sig = op.children[0];
                let outName = 'out';
                if (ch instanceof FunctionCall_1.FunctionCall || ch instanceof Move_1.Move || ch instanceof S_Move_1.S_Move || ch instanceof Convert_1.Convert)
                    outName = 'eno';
                this._sb.appendLine(`<Wire UId="${this._currentId}"><!-- Wire ${op.toString()} -->`);
                this._sb.appendLine(`<NameCon UId="${ch.operationId}" Name="${outName}" />  <!-- ${ch.constructor.name}${ch instanceof Signal_1.Signal ? ' (' + ch.name + ')' : ''} -->`);
                this._sb.appendLine(`<NameCon UId="${sig.operationId}" Name="in" />  <!-- ${sig.constructor.name}${sig instanceof Signal_1.Signal ? ' (' + sig.name + ')' : ''} -->`);
                this._sb.appendLine('</Wire>');
                this._currentId++;
            }
        }
    }
    addPowerrails(network) {
        const ops = KopCodeHelper.flattenOrdered(network.children, x => x.children);
        this._sb.appendLine(`<Wire UId="${this._currentId}">`);
        this._sb.appendLine('<Powerrail />');
        for (const s of ops) {
            let noPowerRail = false;
            let p = s;
            if (s instanceof FunctionCall_1.FunctionCall) {
                while (p.parent !== null) {
                    const pp = p.parent;
                    if (pp instanceof And_1.And ||
                        pp instanceof CompareOperator_1.CompareOperator ||
                        pp instanceof Convert_1.Convert ||
                        pp instanceof Move_1.Move ||
                        pp instanceof S_Move_1.S_Move) {
                        if (pp.children.indexOf(p) > 0)
                            noPowerRail = true;
                    }
                    p = p.parent;
                    if (noPowerRail)
                        break;
                }
                if (!noPowerRail) {
                    if (s instanceof InRangeCall_1.InRangeCall || s instanceof OutRangeCall_1.OutRangeCall) {
                        this._sb.appendLine(`<NameCon UId="${s.operationId}" Name="pre" />  <!-- ${s.functionName} -->`);
                    }
                    else {
                        this._sb.appendLine(`<NameCon UId="${s.operationId}" Name="en" />  <!-- ${s.functionName} -->`);
                    }
                }
                noPowerRail = true;
            }
            else if (s.parent instanceof FunctionCall_1.FunctionCall) {
                noPowerRail = true;
            }
            else if (s.parent instanceof BaseCoil_1.BaseCoil && s.parent.children.indexOf(p) === 0) {
                noPowerRail = true;
            }
            else if ((s instanceof Coil_1.Coil || s instanceof SCoil_1.SCoil || s instanceof RCoil_1.RCoil) &&
                s.children.length === 1 &&
                s.children[0] instanceof Signal_1.Signal &&
                (s.parent === null || s.parent instanceof Network_1.Network)) {
                this._sb.appendLine(`<NameCon UId="${s.operationId}" Name="in" />  <!-- ${s.toString()} - ${s.children[0].toString()} -->`);
            }
            else if (s instanceof Signal_1.Signal) {
                if (p.parent instanceof FunctionCall_1.FunctionCall) {
                    noPowerRail = true;
                }
                else {
                    while (p.parent !== null) {
                        const pp = p.parent;
                        if (pp instanceof And_1.And ||
                            pp instanceof CompareOperator_1.CompareOperator ||
                            pp instanceof Convert_1.Convert ||
                            pp instanceof Move_1.Move ||
                            pp instanceof S_Move_1.S_Move) {
                            if (pp.children.indexOf(p) > 0)
                                noPowerRail = true;
                        }
                        else if (pp instanceof FunctionCall_1.FunctionCall) {
                            break;
                        }
                        p = p.parent;
                        if (noPowerRail)
                            break;
                    }
                }
            }
            if (!noPowerRail && s instanceof Signal_1.Signal) {
                const sng = s;
                const par = s.parent;
                if (par instanceof CompareOperator_1.CompareOperator) {
                    this._sb.appendLine(`<NameCon UId="${par.operationId}" Name="pre" />  <!-- ${par.constructor.name} -->`);
                }
                else if (par instanceof Move_1.Move || par instanceof S_Move_1.S_Move || par instanceof Convert_1.Convert) {
                    this._sb.appendLine(`<NameCon UId="${par.operationId}" Name="en" />  <!-- ${par.constructor.name} -->`);
                }
                else {
                    this._sb.appendLine(`<NameCon UId="${sng.operationId}" Name="in" />  <!-- ${sng.name} -->`);
                }
            }
        }
        this._sb.appendLine('</Wire>');
        this._currentId++;
    }
    fixChildAndsAndSingleOr(s) {
        let fixAgain = false;
        const newChildren = [];
        if (s !== null && s.children !== null) {
            if (s instanceof BaseCoil_1.BaseCoil && s.children.length === 2 && s.children[1] instanceof Signal_1.Signal) {
                s.children[1] = new And_1.And(s.children[1]);
            }
            else {
                for (const op of s.children.slice()) {
                    if ((s instanceof And_1.And || s instanceof Or_1.Or) && op instanceof Or_1.Or && op.children.length === 1) {
                        for (const p of op.children) {
                            newChildren.push(p);
                            fixAgain = true;
                        }
                    }
                    else if (s instanceof And_1.And && op instanceof And_1.And) {
                        for (const p of op.children) {
                            newChildren.push(p);
                            s.children.push(p);
                            fixAgain = true;
                        }
                    }
                    else {
                        newChildren.push(op);
                        this.fixChildAndsAndSingleOr(op);
                    }
                }
                s.children = newChildren;
                if (fixAgain)
                    this.fixChildAndsAndSingleOr(s);
            }
        }
    }
    escapeForXml(text) {
        return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    printTreeParent(signal) {
        if (signal !== null) {
            let t = '';
            if (signal instanceof Signal_1.Signal)
                t = ` (${signal.name})`;
            if (signal instanceof Coil_1.Coil)
                t = ` (${signal.signal.name})`;
            if (signal instanceof Network_1.Network)
                t = ` (${signal.networkTitle ?? ''})`;
            if (signal instanceof CodeBlock_1.CodeBlock)
                t = ` (${signal.name ?? ''})`;
            const p = this.printTreeParent(signal.parent);
            return (p !== '' ? p + ' -> ' : '') + signal.constructor.name + t;
        }
        return '';
    }
    setParent(s) {
        for (const op of s.children) {
            if (op.parent !== null) {
                throw new Error('\n\nIOperationOrSignal reused wich is not valid!\n' +
                    this.printTreeParent(op.parent) + '\n\n' +
                    this.printTreeParent(s) + '\n\n');
            }
            op.parent = s;
            this.setParent(op);
        }
    }
    getXml(idRef) {
        this.fixChildAndsAndSingleOr(this._block);
        this.setParent(this._block);
        const allChildren = (0, IEnumerableExtensions_1.flatten)(this._block.children, x => x.children);
        const networks = allChildren.filter((x) => x instanceof Network_1.Network);
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
                this._sb.appendLine(`<Text>${network.description ?? ''}</Text>`);
                this._sb.appendLine('</AttributeList>');
                this._sb.appendLine('</MultilingualTextItem>');
                this._sb.appendLine(`<MultilingualTextItem ID="${idRef.value}" CompositionName="Items">`);
                idRef.value++;
                this._sb.appendLine('<AttributeList>');
                this._sb.appendLine('<Culture>en-GB</Culture>');
                this._sb.appendLine(`<Text>${network.descriptionEnglish ?? ''}</Text>`);
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
            }
            catch (ex) {
                throw new Error(`Error generating Network: ${network.networkTitle} in Block: ${this._block.name}\n${ex.message}`);
            }
        }
        return this._sb.toString();
    }
    getAllOrSignals(sng) {
        const result = [];
        if (sng instanceof And_1.And) {
            if (sng.children.length > 0 && sng.children[0] instanceof Or_1.Or) {
                const or = sng.children[0];
                for (const o of or.children) {
                    result.push(...this.getAllOrSignals(o));
                }
            }
            else {
                result.push(sng.children[0]);
            }
        }
        else {
            result.push(sng);
        }
        return result;
    }
    isIPartName(op) {
        return 'partName' in op && typeof op.partName === 'string';
    }
    isIFunctionOperation(op) {
        // Check if op implements IFunctionOperation (Move, Convert, S_Move)
        return op instanceof Move_1.Move || op instanceof Convert_1.Convert || op instanceof S_Move_1.S_Move;
    }
}
exports.KopCodeHelper = KopCodeHelper;
KopCodeHelper.debug = null;
//# sourceMappingURL=KopCodeHelper.js.map