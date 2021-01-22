using TiaCodegen.Commands.Signals;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Coils
{
    public class PCoil : BaseNPCoil
    {
        public PCoil(Signal signal, Signal helpSignal, IOperationOrSignal op = null) : base(signal, helpSignal, op)
        { }
    }
}
