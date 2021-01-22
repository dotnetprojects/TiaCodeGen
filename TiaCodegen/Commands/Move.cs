using System.Linq;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands
{
    public class Move : BaseOperationOrSignal, IFunctionOperation
    {
        public Move(params IOperationOrSignal[] operationOrSignals)
            : base(operationOrSignals)
        { }

        public override int Cardinality { get { return Children.Count() - 1; } }
    }
}
