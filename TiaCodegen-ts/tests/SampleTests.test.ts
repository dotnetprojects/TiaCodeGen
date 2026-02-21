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
import { Eq } from '../src/Commands/Comparisons/Eq';
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

    test('DoubleCarrierTest', () => {
        const codeblock = new CodeBlock();
        codeblock.safety = false;
        const nw = new Network('Test', 'Testen');

        nw.add(
            new And(
                new Eq(new Signal('#Configuration.General.SingleDoubleCarrier', SignalType.Int), new Signal(2)),
                new Distributor(
                    new And(
                        new Or(
                            new Signal('#DoubleCarrier.Sensors.V[#Configuration.General.CoordinationAxisConveyor, 1]'),
                            new Signal('#DoubleCarrier.Sensors.R[#Configuration.General.CoordinationAxisConveyor, 1]'),
                        ),
                        new Coil(new Signal('#CarrierGeneral.States.CarriageOccupied[2]')),
                    ),
                    new And(
                        new Signal('#DoubleCarrierData.MOrder.DataPresent'),
                        new Coil(new Signal('#CarrierGeneral.States.CarriageDataPresent[2]')),
                    ),
                ),
            ),
        );

        codeblock.add(nw);

        const block = new Block('Test', 'blabla', codeblock);
        const xml = block.getCode();

        const expectedXml = '  <SW.Blocks.FC ID="0">    <AttributeList>            <HeaderFamily>General</HeaderFamily>      <HeaderVersion>1.0</HeaderVersion>      <MemoryLayout>Optimized</MemoryLayout>      <Name>Test</Name>       <Namespace />      <ProgrammingLanguage>LAD</ProgrammingLanguage>    </AttributeList>    <ObjectList><SW.Blocks.CompileUnit ID="1" CompositionName="CompileUnits"> <!--Test--><AttributeList><NetworkSource><FlgNet xmlns="http://www.siemens.com/automation/Openness/SW/NetworkSource/FlgNet/v1"><Parts><Access Scope="LocalVariable" UId="21"><Symbol><Component Name="CarrierGeneral"></Component><Component Name="States"></Component><Component Name="CarriageDataPresent"><Access Scope="LiteralConstant"><Constant><ConstantType>DInt</ConstantType><ConstantValue>2</ConstantValue></Constant></Access></Component></Symbol></Access><Access Scope="LocalVariable" UId="22"><Symbol><Component Name="CarrierGeneral"></Component><Component Name="States"></Component><Component Name="CarriageOccupied"><Access Scope="LiteralConstant"><Constant><ConstantType>DInt</ConstantType><ConstantValue>2</ConstantValue></Constant></Access></Component></Symbol></Access><Access Scope="LocalVariable" UId="23"><Symbol><Component Name="Configuration"></Component><Component Name="General"></Component><Component Name="SingleDoubleCarrier"></Component></Symbol></Access><Access Scope="LocalVariable" UId="24"><Symbol><Component Name="DoubleCarrier"></Component><Component Name="Sensors"></Component><Component Name="R"><Access Scope="LocalVariable"><Symbol><Component Name="Configuration" /><Component Name="General" /><Component Name="CoordinationAxisConveyor" /></Symbol></Access><Access Scope="LiteralConstant"><Constant><ConstantType>DInt</ConstantType><ConstantValue>1</ConstantValue></Constant></Access></Component></Symbol></Access><Access Scope="LocalVariable" UId="25"><Symbol><Component Name="DoubleCarrier"></Component><Component Name="Sensors"></Component><Component Name="V"><Access Scope="LocalVariable"><Symbol><Component Name="Configuration" /><Component Name="General" /><Component Name="CoordinationAxisConveyor" /></Symbol></Access><Access Scope="LiteralConstant"><Constant><ConstantType>DInt</ConstantType><ConstantValue>1</ConstantValue></Constant></Access></Component></Symbol></Access><Access Scope="LocalVariable" UId="26"><Symbol><Component Name="DoubleCarrierData"></Component><Component Name="MOrder"></Component><Component Name="DataPresent"></Component></Symbol></Access><Access Scope="LiteralConstant" UId="27"><Constant><ConstantType>Int</ConstantType><ConstantValue>2</ConstantValue></Constant></Access><Part Name="Eq" UId="28"><TemplateValue Name="SrcType" Type="Type">Int</TemplateValue></Part><Part Name="Contact" UId="29" /><!-- #DoubleCarrier.Sensors.V[#Configuration.General.CoordinationAxisConveyor, 1] --><Part Name="Contact" UId="30" /><!-- #DoubleCarrier.Sensors.R[#Configuration.General.CoordinationAxisConveyor, 1] --><Part Name="O" UId="31"><!-- Or (Signals...) --><TemplateValue Name="Card" Type="Cardinality">2</TemplateValue></Part><Part Name="Coil" UId="32"/><!-- #CarrierGeneral.States.CarriageOccupied[2] --><Part Name="Contact" UId="33" /><!-- #DoubleCarrierData.MOrder.DataPresent --><Part Name="Coil" UId="34"/><!-- #CarrierGeneral.States.CarriageDataPresent[2] --></Parts><Wires><Wire UId="35"><Powerrail /><NameCon UId="28" Name="pre" />  <!-- Eq --></Wire><Wire UId="36"><!-- Wire CompareOperator --><IdentCon UId="23" />  <!-- Signal(#Configuration.General.SingleDoubleCarrier) --><NameCon UId="28" Name="in1" />  <!-- Eq --></Wire><Wire UId="37"><!-- Wire CompareOperator --><IdentCon UId="27" />  <!-- Signal(2) --><NameCon UId="28" Name="in2" />  <!-- Eq --></Wire><Wire UId="38"><!-- Wire Parent FunctionCall (Parent:Or (Signal(#DoubleCarrier.Sensors.V[#Configuration.General.CoordinationAxisConveyor, 1]),Signal(#DoubleCarrier.Sensors.R[#Configuration.General.CoordinationAxisConveyor, 1]))) --><IdentCon UId="25" />  <!-- #DoubleCarrier.Sensors.V[#Configuration.General.CoordinationAxisConveyor, 1] --><NameCon UId="29" Name="operand" />  <!-- #DoubleCarrier.Sensors.V[#Configuration.General.CoordinationAxisConveyor, 1] --></Wire><Wire UId="39"><!-- Wire Parent FunctionCall (Parent:Or (Signal(#DoubleCarrier.Sensors.V[#Configuration.General.CoordinationAxisConveyor, 1]),Signal(#DoubleCarrier.Sensors.R[#Configuration.General.CoordinationAxisConveyor, 1]))) --><IdentCon UId="24" />  <!-- #DoubleCarrier.Sensors.R[#Configuration.General.CoordinationAxisConveyor, 1] --><NameCon UId="30" Name="operand" />  <!-- #DoubleCarrier.Sensors.R[#Configuration.General.CoordinationAxisConveyor, 1] --></Wire><Wire UId="40"><!-- Wire 2 Or --><NameCon UId="29" Name="out" />  <!-- Signal(#DoubleCarrier.Sensors.V[#Configuration.General.CoordinationAxisConveyor, 1]) --><NameCon UId="31" Name="in1" />  <!-- Or (Signal(#DoubleCarrier.Sensors.V[#Configuration.General.CoordinationAxisConveyor, 1]),Signal(#DoubleCarrier.Sensors.R[#Configuration.General.CoordinationAxisConveyor, 1])) --></Wire><Wire UId="41"><!-- Wire 2 Or --><NameCon UId="30" Name="out" />  <!-- Signal(#DoubleCarrier.Sensors.R[#Configuration.General.CoordinationAxisConveyor, 1]) --><NameCon UId="31" Name="in2" />  <!-- Or (Signal(#DoubleCarrier.Sensors.V[#Configuration.General.CoordinationAxisConveyor, 1]),Signal(#DoubleCarrier.Sensors.R[#Configuration.General.CoordinationAxisConveyor, 1])) --></Wire><Wire UId="42"><!-- Wire Parent FunctionCall (Parent:Coil) --><IdentCon UId="22" />  <!-- #CarrierGeneral.States.CarriageOccupied[2] --><NameCon UId="32" Name="operand" />  <!-- #CarrierGeneral.States.CarriageOccupied[2] --></Wire><Wire UId="43"><!-- Wire And --><NameCon UId="31" Name="out" />  <!-- Or --><NameCon UId="32" Name="in" />  <!-- Coil --></Wire><Wire UId="44"><!-- Wire Parent FunctionCall (Parent:And (Signal(#DoubleCarrierData.MOrder.DataPresent),Coil)) --><IdentCon UId="26" />  <!-- #DoubleCarrierData.MOrder.DataPresent --><NameCon UId="33" Name="operand" />  <!-- #DoubleCarrierData.MOrder.DataPresent --></Wire><Wire UId="45"><!-- Wire Parent FunctionCall (Parent:Coil) --><IdentCon UId="21" />  <!-- #CarrierGeneral.States.CarriageDataPresent[2] --><NameCon UId="34" Name="operand" />  <!-- #CarrierGeneral.States.CarriageDataPresent[2] --></Wire><Wire UId="46"><!-- Wire And --><NameCon UId="33" Name="out" />  <!-- #DoubleCarrierData.MOrder.DataPresent --><NameCon UId="34" Name="in" />  <!-- Coil --></Wire><Wire UId="47"><!-- Wire And --><NameCon UId="28" Name="out" />  <!-- Eq --><!-- Distributor --><NameCon UId="29" Name="in" />  <!-- Signal --><NameCon UId="30" Name="in" />  <!-- Signal --><NameCon UId="33" Name="in" />  <!-- Signal --></Wire></Wires></FlgNet></NetworkSource><ProgrammingLanguage>LAD</ProgrammingLanguage></AttributeList><ObjectList><MultilingualText ID="2" CompositionName="Comment"><ObjectList><MultilingualTextItem ID="3" CompositionName="Items"><AttributeList><Culture>de-DE</Culture><Text></Text></AttributeList></MultilingualTextItem><MultilingualTextItem ID="4" CompositionName="Items"><AttributeList><Culture>en-GB</Culture><Text></Text></AttributeList></MultilingualTextItem></ObjectList></MultilingualText><MultilingualText ID="5" CompositionName="Title"><ObjectList><MultilingualTextItem ID="6" CompositionName="Items"><AttributeList><Culture>de-DE</Culture><Text>Test</Text></AttributeList></MultilingualTextItem><MultilingualTextItem ID="7" CompositionName="Items"><AttributeList><Culture>en-GB</Culture><Text>Testen</Text></AttributeList></MultilingualTextItem></ObjectList></MultilingualText></ObjectList></SW.Blocks.CompileUnit>        <MultilingualText ID="8" CompositionName="Title">        <ObjectList>          <MultilingualTextItem ID="9" CompositionName="Items">            <AttributeList>              <Culture>de-DE</Culture>              <Text>blabla</Text>            </AttributeList>          </MultilingualTextItem>          <MultilingualTextItem ID="10" CompositionName="Items">            <AttributeList>              <Culture>en-GB</Culture>              <Text></Text>            </AttributeList>          </MultilingualTextItem>        </ObjectList>      </MultilingualText>      <MultilingualText ID="11" CompositionName="Comment">        <ObjectList>          <MultilingualTextItem ID="12" CompositionName="Items">            <AttributeList>              <Culture>de-DE</Culture>              <Text></Text>            </AttributeList>          </MultilingualTextItem>          <MultilingualTextItem ID="13" CompositionName="Items">            <AttributeList>              <Culture>en-GB</Culture>              <Text></Text>            </AttributeList>          </MultilingualTextItem>        </ObjectList>      </MultilingualText>    </ObjectList>  </SW.Blocks.FC>';
        expect(xml.replace(/\r?\n/g, '')).toEqual(expectedXml.replace(/\r?\n/g, ''));
    });
});