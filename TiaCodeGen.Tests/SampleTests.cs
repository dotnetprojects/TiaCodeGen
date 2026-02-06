using NUnit.Framework;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
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
        public void TestDistributor()
        {
            var codeblock = new CodeBlock();

            var nw = new Network("Test2", "Test2en");
            nw.Add(
                new And(
                    new Not(new Signal("Tag_9")),
                    new Distributor(
                        new And(
                            new Coil(new Signal("#monitoringSignal"))
                        ),
                        new And(
                            new TONCall("OnDelaySafetyDoorSDA11N13", pt: new Signal("T#60s", SignalType.ConstantTime), q: null)
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
        public void TestCallWithCTU()
        {
            var codeblock = new CodeBlock() { Safety = false };

            var nw = new Network("Test2", "Test2en");

            var f = new And(new Signal("aa"), new CTUCall("Hallo", r: new Signal("bbb", SignalType.Bool), pv: new Signal("2", SignalType.ConstantInt), q: new Coil(new Signal("ccc", SignalType.Bool))));
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

        [Test]
        public void ComplexVariableAccessTest1()
        {
            var sb = new StringBuilder();
            var s = new Signal("#A.B.C[#D.E.F, 1]");
            s.AddXmlToStringBuilder(1, sb);
            var xml = sb.ToString();
            Assert.AreEqual("<Access Scope=\"LocalVariable\" UId=\"1\">\r\n<Symbol>\r\n<Component Name=\"A\">\r\n</Component>\r\n<Component Name=\"B\">\r\n</Component>\r\n<Component Name=\"C\">\r\n<Access Scope=\"LocalVariable\">\r\n<Symbol>\r\n<Component Name=\"D\" />\r\n<Component Name=\"E\" />\r\n<Component Name=\"F\" />\r\n</Symbol>\r\n</Access>\r\n<Access Scope=\"LiteralConstant\">\r\n<Constant>\r\n<ConstantType>DInt</ConstantType>\r\n<ConstantValue>1</ConstantValue>\r\n</Constant>\r\n</Access>\r\n</Component>\r\n</Symbol>\r\n</Access>\r\n".Replace("\n", "").Replace("\r", ""), xml.Replace("\n", "").Replace("\r", ""));
        }

        [Test]
        public void ComplexVariableAccessTest2()
        {
            var sb = new StringBuilder();
            var s = new Signal("#A.B.C[#D.E.F, #G.H.I]");
            s.AddXmlToStringBuilder(1, sb);
            var xml = sb.ToString();
            Assert.AreEqual("<Access Scope=\"LocalVariable\" UId=\"1\">\r\n<Symbol>\r\n<Component Name=\"A\">\r\n</Component>\r\n<Component Name=\"B\">\r\n</Component>\r\n<Component Name=\"C\">\r\n<Access Scope=\"LocalVariable\">\r\n<Symbol>\r\n<Component Name=\"D\" />\r\n<Component Name=\"E\" />\r\n<Component Name=\"F\" />\r\n</Symbol>\r\n</Access>\r\n<Access Scope=\"LocalVariable\">\r\n<Symbol>\r\n<Component Name=\"G\" />\r\n<Component Name=\"H\" />\r\n<Component Name=\"I\" />\r\n</Symbol>\r\n</Access>\r\n</Component>\r\n</Symbol>\r\n</Access>\r\n".Replace("\n", "").Replace("\r", ""), xml.Replace("\n", "").Replace("\r", ""));
        }

        [Test]
        public void TestConstant()
        {
            var sb = new StringBuilder();
            var s = new Signal("AAA", SignalType.Constant);
            s.AddXmlToStringBuilder(1, sb);
            var xml = sb.ToString();
            Assert.AreEqual("<Access Scope=\"GlobalConstant\" UId=\"1\">\r\n<Constant Name=\"AAA\">\r\n</Constant>\r\n</Access>\r\n".Replace("\n", "").Replace("\r", ""), xml.Replace("\n", "").Replace("\r", ""));
        }

        [Test]
        public void SystemFunctionDPXX_DAT()
        {
            var codeblock = new CodeBlock() { Safety = false };

            var nw = new Network("TestDPXX_DAT", "TestDPXX_DATen");

            var sf1 = new SystemFunctionCall("DPRD_DAT");
            sf1.Interface["LADDR"] = new IOperationOrSignalDirectionWrapper(new Signal("#Configuration.GeneralMoviC.ModuleHardwareID"), Direction.Input);
            sf1.Interface["RET_VAL"] = new IOperationOrSignalDirectionWrapper(new Signal("#retVal"), Direction.Output);
            sf1.Interface["RECORD"] = new IOperationOrSignalDirectionWrapper(new Signal("#PeripheryInputsMoviC"), Direction.Output);
            sf1.Children.AddRange(sf1.Interface.Values.Where(x => x.OperationOrSignal != null).Select(x => x.OperationOrSignal));

            nw.Add(sf1);

            codeblock.Add(nw);

            var block = new Block("Test", "blabla", codeblock);
            block.Interface = TestInterface;
            var xml = block.GetCode();

            //Assert.AreEqual("<Access Scope=\"LocalVariable\" UId=\"1\">\r\n<Symbol>\r\n<Component Name=\"A\">\r\n</Component>\r\n<Component Name=\"B\">\r\n</Component>\r\n<Component Name=\"C\">\r\n<Access Scope=\"LocalVariable\">\r\n<Symbol>\r\n<Component Name=\"D\" />\r\n<Component Name=\"E\" />\r\n<Component Name=\"F\" />\r\n</Symbol>\r\n</Access>\r\n<Access Scope=\"LiteralConstant\">\r\n<Constant>\r\n<ConstantType>DInt</ConstantType>\r\n<ConstantValue>1</ConstantValue>\r\n</Constant>\r\n</Access>\r\n</Component>\r\n</Symbol>\r\n</Access>\r\n".Replace("\n", "").Replace("\r", ""), xml.Replace("\n", "").Replace("\r", ""));
        }

        [Test]
        public void ComplexOr()
        {
            var codeblock = new CodeBlock() { Safety = false };

            var nw = new Network("T1", "T1");

            nw.Add(
                new Coil(
                    new Signal("Test11"),
                    new Or(
                        new And(
                            new Signal("Test1"),
                            new Or(
                                new And(
                                    new Signal("Test2"),
                                    new Or(
                                        new Signal("Test3"),
                                        new Signal("Test4")
                                    )
                                    { DebugInfo = "aaa" }
                                ),
                                new Signal("Test5")
                            )
                            { DebugInfo = "bbb" }
                        ),
                        new And(
                            new Signal("Test6"),
                            new Or(
                                new And(
                                    new Signal("Test7"),
                                    new Or(
                                        new Signal("Test8"),
                                        new Signal("Test9")
                                    )
                                    { DebugInfo = "ccc" }
                                ),
                                new Signal("Test10")
                            )
                            { DebugInfo = "ddd" }
                        )
                    )
                    { DebugInfo = "eee" }
                )
            );
            codeblock.Add(nw);

            var block = new Block("Test", "blabla", codeblock);
            block.Interface = TestInterface;
            var xml = block.GetCode();
        }

        [Test]
        public void ComplexOr2()
        {
            var codeblock = new CodeBlock() { Safety = false };

            var nw = new Network("T1", "T1");

            nw.Add(
                new Coil(
                    new Signal("Test11"),
                    new Or(
                        new Signal("Test12"),
                        new Or(
                            new And(
                                new Signal("Test1"),
                                new Or(
                                    new And(
                                        new Signal("Test2"),
                                        new Or(
                                            new Signal("Test3"),
                                            new Signal("Test4")
                                        )
                                    ),
                                    new Signal("Test5")
                                )
                            ),
                            new And(
                                new Signal("Test6"),
                                new Or(
                                    new And(
                                        new Signal("Test7"),
                                        new Or(
                                            new Signal("Test8"),
                                            new Signal("Test9")
                                        )
                                    ),
                                    new Signal("Test10")
                                )
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
        public void Complex3()
        {
            var codeblock = new CodeBlock() { Safety = false };

            var nw = new Network("T1", "T1");

            nw.Add(
                new Coil(
                    new Signal("Test11"),
                        new And(
                            new Signal("Test1"),
                            new Or(
                                new Signal("Test2")
                        )
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
