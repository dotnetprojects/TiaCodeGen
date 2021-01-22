using TiaCodegen.Commands.Coils;
using TiaCodegen.Commands.Signals;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands
{
    public class NCoil : BaseNPCoil
    {
        public NCoil(Signal signal, Signal helpSignal, IOperationOrSignal op = null) : base(signal, helpSignal, op)
        { }
    }
}
