using System.Linq;
using TiaCodegen.Enums;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Functions.Arithmetic
{
    public class DivCall : ArithmeticCall
    {
        public DivCall(string type,
            IOperationOrSignal in1,
            IOperationOrSignal in2,
            IOperationOrSignal out1 = null,
            IOperationOrSignal eno = null) : base("Div", eno)
        {
            DisableEno = true;
            Type = type;
            Interface["IN1"] = new IOperationOrSignalDirectionWrapper(in1, Direction.Input);
            Interface["IN2"] = new IOperationOrSignalDirectionWrapper(in2, Direction.Input);
            Interface["OUT"] = new IOperationOrSignalDirectionWrapper(out1, Direction.Output);

            Children.AddRange(Interface.Values.Where(x => x.OperationOrSignal != null).Select(x => x.OperationOrSignal));
        }
    }
}
