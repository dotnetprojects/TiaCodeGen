using System.Linq;
using TiaCodegen.Commands.Functions.Base;
using TiaCodegen.Enums;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Comparisons
{
    public class OutRangeCall : SystemFunctionCall 
    {
        public OutRangeCall(
            IOperationOrSignal min,
            IOperationOrSignal @in,
            IOperationOrSignal max,
            IOperationOrSignal @out,
            IOperationOrSignal eno = null) : base("OutRange", eno)
        {
            DisableEno = false;
            Interface["min"] = new IOperationOrSignalDirectionWrapper(min, Direction.Input);
            Interface["in"] = new IOperationOrSignalDirectionWrapper(@in, Direction.Input);
            Interface["max"] = new IOperationOrSignalDirectionWrapper(max, Direction.Input);
            Interface["out"] = new IOperationOrSignalDirectionWrapper(@out, Direction.Output);

            Children.AddRange(Interface.Values.Where(x => x.OperationOrSignal != null).Select(x => x.OperationOrSignal));
        }
    }
}
