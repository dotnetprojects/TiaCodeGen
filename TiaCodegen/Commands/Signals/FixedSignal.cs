using TiaCodegen.Enums;

namespace TiaCodegen.Commands.Signals
{
    public class FixedSignal : Signal
    {
        public FixedSignal(string name, SignalType signalType = SignalType.Bool, string customType = null) :
                base(name, signalType, customType)
        { }
    }
}
