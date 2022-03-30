﻿using NUnit.Framework;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using TiaCodegen.Blocks;
using TiaCodegen.Commands;
using TiaCodegen.Commands.Coils;
using TiaCodegen.Commands.Comparisons;
using TiaCodegen.Commands.Functions;
using TiaCodegen.Commands.Functions.Base;
using TiaCodegen.Commands.Signals;
using TiaCodegen.Enums;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Samples
{
    [TestFixture]
    public class SampleTests
    {
        const string TestInterface = @"
<Interface>
	<Sections xmlns=""http://www.siemens.com/automation/Openness/SW/Interface/v3"">
	  <Section Name=""Input"">
		<Member Name=""Initial_Call"" Datatype=""Bool"" Accessibility=""Public"" Informative=""true"">
		  <Comment>
			<MultiLanguageText Lang=""en-US"">Initial call of this OB</MultiLanguageText>
		  </Comment>
		</Member>
		<Member Name=""Remanence"" Datatype=""Bool"" Accessibility=""Public"" Informative=""true"">
		  <Comment>
			<MultiLanguageText Lang=""en-US"">=True, if remanent data are available</MultiLanguageText>
		  </Comment>
		</Member>
	  </Section>
	  <Section Name=""Temp"">
		<Member Name=""Daten"" Datatype=""Struct"">
		  <Member Name=""Bool1"" Datatype=""Bool"" />
		  <Member Name=""Bool2"" Datatype=""Bool"" />
		  <Member Name=""Bool3"" Datatype=""Bool"" />
		  <Member Name=""Bool4"" Datatype=""Bool"" />
		  <Member Name=""Dint1"" Datatype=""DInt"" />
		  <Member Name=""Dint2"" Datatype=""DInt"" />
		  <Member Name=""Dint3"" Datatype=""DInt"" />
		  <Member Name=""Dint4"" Datatype=""DInt"" />
		  <Member Name=""Real1"" Datatype=""Real"" />
		  <Member Name=""Real2"" Datatype=""Real"" />
		  <Member Name=""Real3"" Datatype=""Real"" />
		  <Member Name=""Real4"" Datatype=""Real"" />
		</Member>
	  </Section>
	  <Section Name=""Constant"" />
	</Sections>
</Interface>";

        [Test]
        public void CreateBlock1()
        {
            var codeblock = new CodeBlock();
            var nw = new Network("Test1", "Test1en");

            nw.Add(
                new And(
                    new Signal("#Bool1"),
                new Distributor
                (
                    new RCoil(new Signal("#Bool2")),
                    new Coil(new Signal("#Bool3"))
                )));

            codeblock.Add(nw);

            var block = new Block("Test", "blabla", codeblock);
            block.Interface = TestInterface;
            var xml = block.GetCode();
        }

        [Test]
        public void CreateBlock2()
        {
            var codeblock = new CodeBlock();

            var nw = new Network("Test2", "Test2en");
            nw.Add(
            new And(
                new Signal("#Bool1"),
                new Signal("#Bool2"),
                new Convert(
                    new Signal("#Real1", SignalType.Real),
                    new Signal("#Dint2", SignalType.DInt)
                ),
                new Distributor(
                    new And(
                        new Move(
                            new Signal("#Real3"),
                            new Signal("#Real4")
                        ),
                        new SCoil(new Signal("#Bool3"))
                    ),
                    new And(
                        new Gt(
                            new Signal("#Real1", SignalType.Real),
                            new Signal("#Real2", SignalType.Real)
                        ),
                        new SCoil(new Signal("#Bool4"))
                    )
                )
            )
        );

            codeblock.Add(nw);

            var block = new Block("Test", "blabla", codeblock);
            var xml = block.GetCode();
            block.Interface = TestInterface;
        }

        [Test]
        public void CreateBlock3()
        {
            var codeblock = new CodeBlock();

            var nw = new Network("Test2", "Test2en");
            nw.Add(
                new Coil(
                    new Signal("#Bool1"),
                    new And(
                        new Signal("#Bool2"),
                        new Or(
                             new Signal("#Bool3"),
                             new And(
                                new Signal("#Bool1"),
                                new Signal("#Bool4")
                            )
                        )
                    )
                )
            );

            codeblock.Add(nw);

            var block = new Block("Test", "blabla", codeblock);
            block.Interface = TestInterface;
            var xml = block.GetCode();
        }

        [Test]
        public void DynamicSample1()
        {
            var codeblock = new CodeBlock();

            var signals = new List<string>() { "#Bool1", "#Bool2", "#Bool3" };
            var and = new And();
            foreach (var s in signals)
                and.Add(new Signal(s));

            var nw = new Network("Test2", "test2en");
            nw.Add(
                new Coil(
                    new Signal("#Bool4"),
                    and
                )
            );

            codeblock.Add(nw);

            var block = new Block("Test", "blabla", codeblock);
            block.Interface = TestInterface;
            var xml = block.GetCode();
        }

        [Test]
        public void TestCallWithOr()
        {
            var codeblock = new CodeBlock();

            var nw = new Network("Test2", "Test2en");

            var f = new FunctionBlockCall("CheckContour", "CheckContourInstance");
            f.Interface["BoolPar"] = new IOperationOrSignalDirectionWrapper(new Or(new Signal("P1"), new Signal("P2")), Direction.InOut);
            f.Children.AddRange(f.Interface.Values.Where(x => x.OperationOrSignal != null).Select(x => x.OperationOrSignal));
            nw.Add(f);

            codeblock.Add(nw);

            var block = new Block("Test", "blabla", codeblock);
            block.Interface = TestInterface;
            var xml = block.GetCode();
        }

        [Test]
        public void TestCallWithInRange()
        {
            var codeblock = new CodeBlock();

            var nw = new Network("Test2", "Test2en");

            var f = new InRangeCall(new Signal(1), new Signal(2), new Signal(3), new Coil(new Signal("MW0", SignalType.Int)));
            nw.Add(f);

            codeblock.Add(nw);

            var block = new Block("Test", "blabla", codeblock);
            block.Interface = TestInterface;
            var xml = block.GetCode();
        }

        [Test]
        public void TestCallWithTOn()
        {
            var codeblock = new CodeBlock() { Safety = true };

            var nw = new Network("Test2", "Test2en");

            var f = new TONCall("Hallo", pt: new Signal("T#4m", SignalType.ConstantTime));
            nw.Add(f);

            codeblock.Add(nw);

            var block = new Block("Test", "blabla", codeblock);
            block.Interface = TestInterface;
            var xml = block.GetCode();
        }

        [Test]
        public void TestCallWithTPAndDistributor()
        {
            var codeblock = new CodeBlock() { Safety = false };

            var nw = new Network("Test2", "Test2en");
            var and =
                new And(
                new Signal("#aaa"),
                new TPCall("PulseStartPrint",
                    pt: new Signal("T#100ms", SignalType.ConstantTime),
                    q: new Distributor(
                        new Coil(new Signal("#bbbb")),
                        new RCoil(new Signal("#cccc")),
                        new SCoil(new Signal("#dddd"))
                    )
                )
            );

            nw.Add(and);

            codeblock.Add(nw);

            var block = new Block("Test", "blabla", codeblock);
            block.Interface = TestInterface;
            var xml = block.GetCode();
        }

        [Test]
        public void DistributorWithOr()
        {
            var codeblock = new CodeBlock() { Safety = false };

            var nw = new Network("Test2", "Test2en");
            nw.Add(
                new And(
                    new Signal("asd"),
                    new Distributor(
                        new SCoil(new Signal("x")),
                        new And(
                            new Or(
                                new And(
                                    new Signal("a"),
                                    new Signal("h")
                                ),
                                new And(
                                    new Signal("b"),
                                    new Signal("f")
                                )
                            ),
                            new SCoil(new Signal("c"))
                        )
                    )
                )
            );

            codeblock.Add(nw);

            var block = new Block("Test", "blabla", codeblock);
            block.Interface = TestInterface;
            var xml = block.GetCode();
        }

        [Test]
        public void MultipleOr()
        {
            var codeblock = new CodeBlock() { Safety = false };

            var nw = new Network("Test2", "Test2en");
            nw.Add(
                new Coil(
                    new Signal("a"),
                    new And(
                        new Signal("1"),
                        new Or(
                            new And(
                                new Or(
                                    new Signal("b"),
                                    new Signal("c")
                                ),
                                new Signal("d")
                            ),
                            new Signal("e")
                        )
                    )
                )
            );

            codeblock.Add(nw);

            var block = new Block("Test", "blabla", codeblock);
            block.Interface = TestInterface;
            var xml = block.GetCode();
        }

        [Test]
        public void PeripheryFixedSignal()
        {
            var codeblock = new CodeBlock() { Safety = false };

            var nw = new Network("Test3", "Test3en");
            nw.Add(
                new Coil(
                    new FixedPeripherySignal("=PBG10.6+FBG11-BV1:4"),
                    new And(
                        new Signal("1")
                    )
                )
            );

            codeblock.Add(nw);

            var block = new Block("Test", "blabla", codeblock);
            block.Interface = TestInterface;
            var xml = block.GetCode();
        }
    }
}
