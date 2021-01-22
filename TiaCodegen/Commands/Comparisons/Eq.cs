using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Comparisons
{
    public class Eq : CompareOperator // ==
    {
        public Eq(params IOperationOrSignal[] operationOrSignals)
            : base(operationOrSignals)
        { }
    }
}
