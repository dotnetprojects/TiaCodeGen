using System.Linq;
using TiaCodegen.Commands.Functions.Base;
using TiaCodegen.Enums;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Functions
{
    public class SubCall : SystemFunctionCall
    {
        public string Type { get; set; }

        public SubCall(string type,
            IOperationOrSignal in1,
            IOperationOrSignal in2,
            IOperationOrSignal in3 = null,
            IOperationOrSignal in4 = null,
            IOperationOrSignal in5 = null,
            IOperationOrSignal in6 = null,
            IOperationOrSignal in7 = null,
            IOperationOrSignal in8 = null,
            IOperationOrSignal in9 = null,
            IOperationOrSignal in10 = null,
            IOperationOrSignal in11 = null,
            IOperationOrSignal in12 = null,
            IOperationOrSignal in13 = null,
            IOperationOrSignal in14 = null,
            IOperationOrSignal in15 = null,
            IOperationOrSignal in16 = null,
            IOperationOrSignal in17 = null,
            IOperationOrSignal in18 = null,
            IOperationOrSignal in19 = null,
            IOperationOrSignal in20 = null,
            IOperationOrSignal in21 = null,
            IOperationOrSignal in22 = null,
            IOperationOrSignal in23 = null,
            IOperationOrSignal in24 = null,
            IOperationOrSignal in25 = null,
            IOperationOrSignal in26 = null,
            IOperationOrSignal in27 = null,
            IOperationOrSignal in28 = null,
            IOperationOrSignal in29 = null,
            IOperationOrSignal in30 = null,
            IOperationOrSignal in31 = null,
            IOperationOrSignal in32 = null,
            IOperationOrSignal in33 = null,
            IOperationOrSignal in34 = null,
            IOperationOrSignal in35 = null,
            IOperationOrSignal in36 = null,
            IOperationOrSignal in37 = null,
            IOperationOrSignal in38 = null,
            IOperationOrSignal in39 = null,
            IOperationOrSignal in40 = null,
            IOperationOrSignal in41 = null,
            IOperationOrSignal in42 = null,
            IOperationOrSignal in43 = null,
            IOperationOrSignal in44 = null,
            IOperationOrSignal in45 = null,
            IOperationOrSignal in46 = null,
            IOperationOrSignal in47 = null,
            IOperationOrSignal in48 = null,
            IOperationOrSignal in49 = null,
            IOperationOrSignal in50 = null,
            IOperationOrSignal out1 = null,
            IOperationOrSignal eno = null) : base("Sub", eno)
        {
            DisableEno = true;
            Type = type;
            Interface["IN1"] = new IOperationOrSignalDirectionWrapper(in1, Direction.Input);
            Interface["IN2"] = new IOperationOrSignalDirectionWrapper(in2, Direction.Input);
            Interface["IN3"] = new IOperationOrSignalDirectionWrapper(in3, Direction.Input);
            Interface["IN4"] = new IOperationOrSignalDirectionWrapper(in4, Direction.Input);
            Interface["IN5"] = new IOperationOrSignalDirectionWrapper(in5, Direction.Input);
            Interface["IN6"] = new IOperationOrSignalDirectionWrapper(in6, Direction.Input);
            Interface["IN7"] = new IOperationOrSignalDirectionWrapper(in7, Direction.Input);
            Interface["IN8"] = new IOperationOrSignalDirectionWrapper(in8, Direction.Input);
            Interface["IN9"] = new IOperationOrSignalDirectionWrapper(in9, Direction.Input);
            Interface["IN10"] = new IOperationOrSignalDirectionWrapper(in10, Direction.Input);
            Interface["IN11"] = new IOperationOrSignalDirectionWrapper(in11, Direction.Input);
            Interface["IN12"] = new IOperationOrSignalDirectionWrapper(in12, Direction.Input);
            Interface["IN13"] = new IOperationOrSignalDirectionWrapper(in13, Direction.Input);
            Interface["IN14"] = new IOperationOrSignalDirectionWrapper(in14, Direction.Input);
            Interface["IN15"] = new IOperationOrSignalDirectionWrapper(in15, Direction.Input);
            Interface["IN16"] = new IOperationOrSignalDirectionWrapper(in16, Direction.Input);
            Interface["IN17"] = new IOperationOrSignalDirectionWrapper(in17, Direction.Input);
            Interface["IN18"] = new IOperationOrSignalDirectionWrapper(in18, Direction.Input);
            Interface["IN19"] = new IOperationOrSignalDirectionWrapper(in19, Direction.Input);
            Interface["IN20"] = new IOperationOrSignalDirectionWrapper(in20, Direction.Input);
            Interface["IN21"] = new IOperationOrSignalDirectionWrapper(in21, Direction.Input);
            Interface["IN22"] = new IOperationOrSignalDirectionWrapper(in22, Direction.Input);
            Interface["IN23"] = new IOperationOrSignalDirectionWrapper(in23, Direction.Input);
            Interface["IN24"] = new IOperationOrSignalDirectionWrapper(in24, Direction.Input);
            Interface["IN25"] = new IOperationOrSignalDirectionWrapper(in25, Direction.Input);
            Interface["IN26"] = new IOperationOrSignalDirectionWrapper(in26, Direction.Input);
            Interface["IN27"] = new IOperationOrSignalDirectionWrapper(in27, Direction.Input);
            Interface["IN28"] = new IOperationOrSignalDirectionWrapper(in28, Direction.Input);
            Interface["IN29"] = new IOperationOrSignalDirectionWrapper(in29, Direction.Input);
            Interface["IN30"] = new IOperationOrSignalDirectionWrapper(in30, Direction.Input);
            Interface["IN31"] = new IOperationOrSignalDirectionWrapper(in31, Direction.Input);
            Interface["IN32"] = new IOperationOrSignalDirectionWrapper(in32, Direction.Input);
            Interface["IN33"] = new IOperationOrSignalDirectionWrapper(in33, Direction.Input);
            Interface["IN34"] = new IOperationOrSignalDirectionWrapper(in34, Direction.Input);
            Interface["IN35"] = new IOperationOrSignalDirectionWrapper(in35, Direction.Input);
            Interface["IN36"] = new IOperationOrSignalDirectionWrapper(in36, Direction.Input);
            Interface["IN37"] = new IOperationOrSignalDirectionWrapper(in37, Direction.Input);
            Interface["IN38"] = new IOperationOrSignalDirectionWrapper(in38, Direction.Input);
            Interface["IN39"] = new IOperationOrSignalDirectionWrapper(in39, Direction.Input);
            Interface["IN40"] = new IOperationOrSignalDirectionWrapper(in40, Direction.Input);
            Interface["IN41"] = new IOperationOrSignalDirectionWrapper(in41, Direction.Input);
            Interface["IN42"] = new IOperationOrSignalDirectionWrapper(in42, Direction.Input);
            Interface["IN43"] = new IOperationOrSignalDirectionWrapper(in43, Direction.Input);
            Interface["IN44"] = new IOperationOrSignalDirectionWrapper(in44, Direction.Input);
            Interface["IN45"] = new IOperationOrSignalDirectionWrapper(in45, Direction.Input);
            Interface["IN46"] = new IOperationOrSignalDirectionWrapper(in46, Direction.Input);
            Interface["IN47"] = new IOperationOrSignalDirectionWrapper(in47, Direction.Input);
            Interface["IN48"] = new IOperationOrSignalDirectionWrapper(in48, Direction.Input);
            Interface["IN49"] = new IOperationOrSignalDirectionWrapper(in49, Direction.Input);
            Interface["IN50"] = new IOperationOrSignalDirectionWrapper(in50, Direction.Input);
            Interface["OUT"] = new IOperationOrSignalDirectionWrapper(out1, Direction.Output);

            Children.AddRange(Interface.Values.Where(x => x.OperationOrSignal != null).Select(x => x.OperationOrSignal));
        }
    }
}
