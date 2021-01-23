using TiaCodegen.Enums;

namespace TiaCodegen.Commands.Signals
{
    /// <summary>
    /// Normal Signals are splitted at dots. Fixed SIgnals not, usefull for Symbol Table entries wich contain special chars.
    /// </summary>
    public class FixedSignal : Signal
    {
        public FixedSignal(string name, SignalType signalType = SignalType.Bool, string customType = null) :
                base(name, signalType, customType)
        { }
    }
}
