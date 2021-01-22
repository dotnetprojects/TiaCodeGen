using System.Linq;
using TiaCodegen.Commands.Functions.Base;
using TiaCodegen.Enums;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Functions
{
    public class RTrigCall : SystemFunctionBlockCall
    {
        public RTrigCall(string instanceName,
            IOperationOrSignal clk = null,
            IOperationOrSignal q = null,
            IOperationOrSignal eno = null) : base("R_TRIG", instanceName, eno)
        {
            Interface["CLK"] = new IOperationOrSignalDirectionWrapper(clk, Direction.Input);
            Interface["Q"] = new IOperationOrSignalDirectionWrapper(q, Direction.Output);

            Children.AddRange(Interface.Values.Where(x => x.OperationOrSignal != null).Select(x => x.OperationOrSignal));
        }
    }
}
