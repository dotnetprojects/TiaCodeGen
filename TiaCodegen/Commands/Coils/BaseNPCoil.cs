using TiaCodegen.Commands.Signals;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Coils
{
    public class BaseNPCoil : BaseCoil
    {
        public BaseNPCoil(Signal signal, Signal helpSignal, IOperationOrSignal op = null) : base(signal, op)
        {
            HelpSignal = helpSignal;
            if (HelpSignal != null)
                Children.Add(helpSignal);
        }

        public Signal HelpSignal { get; set; }
    }
}
