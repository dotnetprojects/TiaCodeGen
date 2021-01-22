using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Comparisons
{
    public class Ge : CompareOperator // >=
    {
        public Ge(params IOperationOrSignal[] operationOrSignals)
            : base(operationOrSignals)
        { }
    }
}
