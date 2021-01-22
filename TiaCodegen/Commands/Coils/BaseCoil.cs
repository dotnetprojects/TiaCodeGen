using System;
using System.Collections.Generic;
using System.Linq;
using TiaCodegen.Commands.Signals;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Coils
{
    public class BaseCoil : IOperationOrSignal, ICoil
    {
        public string DebugInfo { get; set; }
        public BaseCoil(Signal signal, IOperationOrSignal op = null)
        {
            Signal = signal;
            Children = new List<IOperationOrSignal>();
            Children.Add(signal);
            if (op != null)
                Children.Add(op);
        }

        public bool Negated { get; set; }

        public Signal Signal { get; set; }

        public virtual List<IOperationOrSignal> Children { get; set; }

        public ulong OperationId { get; set; }

        public IOperationOrSignal Parent { get; set; }

        public bool DoNotCreateContact { get; set; }

        public int Cardinality { get; set; }

        public virtual int CreateContactAndFillCardinality(IOperationOrSignal parent)
        {
            this.Cardinality = 1;
            return this.Cardinality;
        }

        public override string ToString()
        {
            return this.GetType().Name;
        }

        public IOperationOrSignal Clone()
        {
            try
            {
                var inst = (BaseOperationOrSignal)Activator.CreateInstance(this.GetType(), this.Signal.Clone());
                var props = this.GetType().GetProperties();
                foreach (var p in props)
                {
                    if (p.Name == "Children" || p.Name == "Parent" || p.Name == "SignalId" || p.Name == "OperationId" || p.Name == "Cardinality" || p.Name == "DoNotCreateContact")
                        continue;
                    p.SetValue(inst, p.GetValue(this));
                }
                foreach (var c in Children.Skip(1))
                {
                    inst.Children.Add(c.Clone());
                }

                return inst;
            }
            catch (Exception ex)
            {
                throw new Exception("Error Clone: " + this.GetType().Name, ex);
            }
        }
    }
}
