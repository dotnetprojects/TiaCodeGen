import { CodeBlock } from '../src/Blocks/CodeBlock';
import { Network } from '../src/Blocks/Network';
import { Block } from '../src/Blocks/Block';
import { And } from '../src/Commands/And';
import { Or } from '../src/Commands/Or';
import { Not } from '../src/Commands/Not';
import { Distributor } from '../src/Commands/Distributor';
import { Move } from '../src/Commands/Move';
import { Convert } from '../src/Commands/Convert';
import { S_Move } from '../src/Commands/S_Move';
import { Signal, FixedSignal, FixedPeripherySignal } from '../src/Commands/Signals/Signal';
import { Coil } from '../src/Commands/Coils/Coil';
import { SCoil } from '../src/Commands/Coils/SCoil';
import { RCoil } from '../src/Commands/Coils/RCoil';
import { Gt } from '../src/Commands/Comparisons/Gt';
import { InRangeCall } from '../src/Commands/Comparisons/InRangeCall';
import { FunctionBlockCall } from '../src/Commands/Functions/Base/FunctionBlockCall';
import { SystemFunctionCall } from '../src/Commands/Functions/Base/SystemFunctionCall';
import { TONCall } from '../src/Commands/Functions/TONCall';
import { IOperationOrSignalDirectionWrapper } from '../src/Interfaces/IOperationOrSignalDirectionWrapper';
import { Direction } from '../src/Enums/Direction';
import { SignalType } from '../src/Enums/SignalType';
import { StringBuilder } from '../src/utils/StringBuilder';

const TestInterface = `
<Interface>
\t<Sections xmlns="http://www.siemens.com/automation/Openness/SW/Interface/v3">
\t  <Section Name="Input">
\t\t<Member Name="Initial_Call" Datatype="Bool" Accessibility="Public" Informative="true">
\t\t  <Comment>
\t\t\t<MultiLanguageText Lang="en-US">Initial call of this OB</MultiLanguageText>
\t\t  </Comment>
\t\t</Member>
\t  </Section>
\t  <Section Name="Temp">
\t\t<Member Name="Daten" Datatype="Struct">
\t\t  <Member Name="Bool1" Datatype="Bool" />
\t\t  <Member Name="Bool2" Datatype="Bool" />
\t\t</Member>
\t  </Section>
\t  <Section Name="Constant" />
\t</Sections>
</Interface>`;

describe('SampleTests', () => {
    test('CreateBlock1', () => {
        const codeblock = new CodeBlock();
        const nw = new Network('Test1', 'Test1en');

        nw.add(
            new And(
                new Signal('#Bool1'),
                new Distributor(
                    new RCoil(new Signal('#Bool2')),
                    new Coil(new Signal('#Bool3')),
                ),
            ),
        );

        codeblock.add(nw);

        const block = new Block('Test', 'blabla', codeblock);
        block.blockInterface = TestInterface;
        const xml = block.getCode();
        expect(xml).toBeTruthy();
        expect(xml).toContain('SW.Blocks.FC');
    });

    test('CreateBlock2', () => {
        const codeblock = new CodeBlock();
        const nw = new Network('Test2', 'Test2en');
        nw.add(
            new And(
                new Signal('#Bool1'),
                new Signal('#Bool2'),
                new Convert(
                    new Signal('#Real1', SignalType.Real),
                    new Signal('#Dint2', SignalType.DInt),
                ),
                new Distributor(
                    new And(
                        new Move(
                            new Signal('#Real3'),
                            new Signal('#Real4'),
                        ),
                        new SCoil(new Signal('#Bool3')),
                    ),
                    new And(
                        new Gt(
                            new Signal('#Real1', SignalType.Real),
                            new Signal('#Real2', SignalType.Real),
                        ),
                        new SCoil(new Signal('#Bool4')),
                    ),
                ),
            ),
        );

        codeblock.add(nw);
        const block = new Block('Test', 'blabla', codeblock);
        const xml = block.getCode();
        expect(xml).toBeTruthy();
    });

    test('CreateBlock3', () => {
        const codeblock = new CodeBlock();
        const nw = new Network('Test2', 'Test2en');
        nw.add(
            new Coil(
                new Signal('#Bool1'),
                new And(
                    new Signal('#Bool2'),
                    new Or(
                        new Signal('#Bool3'),
                        new And(
                            new Signal('#Bool1'),
                            new Signal('#Bool4'),
                        ),
                    ),
                ),
            ),
        );

        codeblock.add(nw);
        const block = new Block('Test', 'blabla', codeblock);
        block.blockInterface = TestInterface;
        const xml = block.getCode();
        expect(xml).toBeTruthy();
    });

    test('DynamicSample1', () => {
        const codeblock = new CodeBlock();
        const signals = ['#Bool1', '#Bool2', '#Bool3'];
        const and = new And();
        for (const s of signals) and.add(new Signal(s));

        const nw = new Network('Test2', 'test2en');
        nw.add(new Coil(new Signal('#Bool4'), and));
        codeblock.add(nw);

        const block = new Block('Test', 'blabla', codeblock);
        block.blockInterface = TestInterface;
        const xml = block.getCode();
        expect(xml).toBeTruthy();
    });

    test('TestCallWithOr', () => {
        const codeblock = new CodeBlock();
        const nw = new Network('Test2', 'Test2en');

        const f = new FunctionBlockCall('CheckContour', 'CheckContourInstance');
        f.iface['BoolPar'] = new IOperationOrSignalDirectionWrapper(
            new Or(new Signal('P1'), new Signal('P2')),
            Direction.InOut,
        );
        for (const w of Object.values(f.iface)) {
            if (w.operationOrSignal !== null) f.children.push(w.operationOrSignal);
        }
        nw.add(f);
        codeblock.add(nw);

        const block = new Block('Test', 'blabla', codeblock);
        block.blockInterface = TestInterface;
        const xml = block.getCode();
        expect(xml).toBeTruthy();
    });

    test('TestDistributor', () => {
        const codeblock = new CodeBlock();
        const nw = new Network('Test2', 'Test2en');
        nw.add(
            new And(
                new Not(new Signal('Tag_9')),
                new Distributor(
                    new And(new Coil(new Signal('#monitoringSignal'))),
                    new And(
                        new TONCall('OnDelaySafetyDoorSDA11N13', new Signal('T#60s', SignalType.ConstantTime)),
                    ),
                ),
            ),
        );

        codeblock.add(nw);
        const block = new Block('Test', 'blabla', codeblock);
        block.blockInterface = TestInterface;
        const xml = block.getCode();
        expect(xml).toBeTruthy();
    });

    test('TestCallWithInRange', () => {
        const codeblock = new CodeBlock();
        const nw = new Network('Test2', 'Test2en');

        const f = new InRangeCall(
            new Signal(1),
            new Signal(2),
            new Signal(3),
            new Coil(new Signal('MW0', SignalType.Int)),
        );
        nw.add(f);
        codeblock.add(nw);

        const block = new Block('Test', 'blabla', codeblock);
        block.blockInterface = TestInterface;
        const xml = block.getCode();
        expect(xml).toBeTruthy();
    });

    test('TestCallWithTOn', () => {
        const codeblock = new CodeBlock();
        codeblock.safety = true;
        const nw = new Network('Test2', 'Test2en');

        const f = new TONCall('Hallo', new Signal('T#4m', SignalType.ConstantTime));
        nw.add(f);
        codeblock.add(nw);

        const block = new Block('Test', 'blabla', codeblock);
        const xml = block.getCode();
        expect(xml).toBeTruthy();
        expect(xml).toContain('F_LAD');
    });

    test('FixedPeripherySignalTest', () => {
        const codeblock = new CodeBlock();
        const nw = new Network('Test3', 'Test3en');
        nw.add(
            new Coil(
                new FixedPeripherySignal('=PBG10.6+FBG11-BV1:4'),
                new And(new Signal('1')),
            ),
        );

        codeblock.add(nw);
        const block = new Block('Test', 'blabla', codeblock);
        block.blockInterface = TestInterface;
        const xml = block.getCode();
        expect(xml).toBeTruthy();
    });

    test('ComplexVariableAccessTest1', () => {
        const sb = new StringBuilder();
        const s = new Signal('#A.B.C[#D.E.F, 1]');
        s.addXmlToStringBuilder(1, sb);
        const xml = sb.toString();
        const expected = '<Access Scope="LocalVariable" UId="1">\r\n<Symbol>\r\n<Component Name="A">\r\n</Component>\r\n<Component Name="B">\r\n</Component>\r\n<Component Name="C">\r\n<Access Scope="LocalVariable">\r\n<Symbol>\r\n<Component Name="D" />\r\n<Component Name="E" />\r\n<Component Name="F" />\r\n</Symbol>\r\n</Access>\r\n<Access Scope="LiteralConstant">\r\n<Constant>\r\n<ConstantType>DInt</ConstantType>\r\n<ConstantValue>1</ConstantValue>\r\n</Constant>\r\n</Access>\r\n</Component>\r\n</Symbol>\r\n</Access>\r\n';
        expect(xml.replace(/\r?\n/g, '')).toEqual(expected.replace(/\r?\n/g, ''));
    });

    test('ComplexVariableAccessTest2', () => {
        const sb = new StringBuilder();
        const s = new Signal('#A.B.C[#D.E.F, #G.H.I]');
        s.addXmlToStringBuilder(1, sb);
        const xml = sb.toString();
        const expected = '<Access Scope="LocalVariable" UId="1">\r\n<Symbol>\r\n<Component Name="A">\r\n</Component>\r\n<Component Name="B">\r\n</Component>\r\n<Component Name="C">\r\n<Access Scope="LocalVariable">\r\n<Symbol>\r\n<Component Name="D" />\r\n<Component Name="E" />\r\n<Component Name="F" />\r\n</Symbol>\r\n</Access>\r\n<Access Scope="LocalVariable">\r\n<Symbol>\r\n<Component Name="G" />\r\n<Component Name="H" />\r\n<Component Name="I" />\r\n</Symbol>\r\n</Access>\r\n</Component>\r\n</Symbol>\r\n</Access>\r\n';
        expect(xml.replace(/\r?\n/g, '')).toEqual(expected.replace(/\r?\n/g, ''));
    });

    test('TestConstant', () => {
        const sb = new StringBuilder();
        const s = new Signal('AAA', SignalType.Constant);
        s.addXmlToStringBuilder(1, sb);
        const xml = sb.toString();
        const expected = '<Access Scope="GlobalConstant" UId="1">\r\n<Constant Name="AAA">\r\n</Constant>\r\n</Access>\r\n';
        expect(xml.replace(/\r?\n/g, '')).toEqual(expected.replace(/\r?\n/g, ''));
    });

    test('SystemFunctionDPXX_DAT', () => {
        const codeblock = new CodeBlock();
        codeblock.safety = false;
        const nw = new Network('TestDPXX_DAT', 'TestDPXX_DATen');

        const sf1 = new SystemFunctionCall('DPRD_DAT');
        sf1.iface['LADDR'] = new IOperationOrSignalDirectionWrapper(
            new Signal('#Configuration.GeneralMoviC.ModuleHardwareID'),
            Direction.Input,
        );
        sf1.iface['RET_VAL'] = new IOperationOrSignalDirectionWrapper(new Signal('#retVal'), Direction.Output);
        sf1.iface['RECORD'] = new IOperationOrSignalDirectionWrapper(
            new Signal('#PeripheryInputsMoviC'),
            Direction.Output,
        );
        for (const w of Object.values(sf1.iface)) {
            if (w.operationOrSignal !== null) sf1.children.push(w.operationOrSignal);
        }
        nw.add(sf1);
        codeblock.add(nw);

        const block = new Block('Test', 'blabla', codeblock);
        block.blockInterface = TestInterface;
        const xml = block.getCode();
        expect(xml).toBeTruthy();
    });

    test('ComplexOr', () => {
        const codeblock = new CodeBlock();
        codeblock.safety = false;
        const nw = new Network('T1', 'T1');

        const or3 = new Or(new Signal('Test3'), new Signal('Test4'));
        or3.debugInfo = 'aaa';
        const innerAnd1 = new And(new Signal('Test2'), or3);

        const or1Inner = new Or(innerAnd1, new Signal('Test5'));
        or1Inner.debugInfo = 'bbb';

        const or3b = new Or(new Signal('Test8'), new Signal('Test9'));
        or3b.debugInfo = 'ccc';
        const innerAnd2 = new And(new Signal('Test7'), or3b);

        const or1Inner2 = new Or(innerAnd2, new Signal('Test10'));
        or1Inner2.debugInfo = 'ddd';

        const outerOr = new Or(
            new And(new Signal('Test1'), or1Inner),
            new And(new Signal('Test6'), or1Inner2),
        );
        outerOr.debugInfo = 'eee';

        nw.add(new Coil(new Signal('Test11'), outerOr));
        codeblock.add(nw);

        const block = new Block('Test', 'blabla', codeblock);
        block.blockInterface = TestInterface;
        const xml = block.getCode();
        expect(xml).toBeTruthy();
    });

    test('Complex3', () => {
        const codeblock = new CodeBlock();
        codeblock.safety = false;
        const nw = new Network('T1', 'T1');

        nw.add(
            new Coil(
                new Signal('Test11'),
                new And(new Signal('Test1'), new Or(new Signal('Test2'))),
            ),
        );
        codeblock.add(nw);

        const block = new Block('Test', 'blabla', codeblock);
        block.blockInterface = TestInterface;
        const xml = block.getCode();
        expect(xml).toBeTruthy();
    });
});
