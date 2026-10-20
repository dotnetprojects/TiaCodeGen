using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TiaCodegen.Commands.Comparisons;
using TiaCodegen.Enums;
using TiaCodegen.Interfaces;
using TiaCodegen.Internal;

namespace TiaCodegen.Commands.Signals
{
    public class Signal : IOperationOrSignal
    {
        private bool? _local;
        private bool IsLocal => _local ?? Name.StartsWith("#");

        /// <summary>Creates a global signal from components. Dots and backslashes in each component are literal.</summary>
        public Signal(string[] components, SignalType signalType = SignalType.Bool, string customType = null, string description = null)
            : this(SymbolPath.Join(components), signalType, customType, description)
        {
            _local = false;
        }

        /// <summary>Creates a local signal from components without a leading # scope marker.</summary>
        public static Signal Local(string[] components, SignalType signalType = SignalType.Bool, string customType = null, string description = null)
        {
            var signal = new Signal(components, signalType, customType, description);
            signal.Name = "#" + signal.Name;
            signal._local = true;
            return signal;
        }

        /// <summary>Creates a global signal from components.</summary>
        public static Signal Global(string[] components, SignalType signalType = SignalType.Bool, string customType = null, string description = null)
            => new Signal(components, signalType, customType, description);

        public string DebugInfo { get; set; }
        public Signal(string name, SignalType signalType = SignalType.Bool, string customType = null, string description = null)
        {
            Name = name;
            SignalType = signalType;
            Children = new List<IOperationOrSignal>();
            CustomType = customType;
            Description = description;
        }

        public Signal(int value)
        {
            Name = value.ToString();
            SignalType = SignalType.ConstantInt;
            Children = new List<IOperationOrSignal>();
        }

        public Signal(bool value)
        {
            Name = value.ToString().ToUpper();
            SignalType = SignalType.ConstantBool;
            Children = new List<IOperationOrSignal>();
        }

        public ulong OperationId { get; set; }

        public ulong SignalId { get; set; }

        public string Name { get; private set; }

        public string Description { get; private set; }

        public SignalType SignalType { get; private set; }

        public string CustomType { get; set; }

        public List<IOperationOrSignal> Children { get; set; }

        public IOperationOrSignal Parent { get; set; }

        public bool DoNotCreateContact { get; set; }

        public int Cardinality { get; set; }

        public virtual int CreateContactAndFillCardinality(IOperationOrSignal parent)
        {
            this.Cardinality = 1;
            return this.Cardinality;
        }

        public string Escape(string txt)
        {
            return SymbolPath.Escape(txt);
        }

        public string Unescape(string txt)
        {
            return SymbolPath.Unescape(txt);
        }

        public IOperationOrSignal Clone()
        {
            try
            {
                var inst = new Signal(this.Name);
                inst._local = _local;
                var props = this.GetType().GetProperties();
                foreach (var p in props)
                {
                    if (p.Name == "Children" || p.Name == "Parent" || p.Name == "SignalId" || p.Name == "OperationId" || p.Name == "Cardinality" || p.Name == "DoNotCreateContact")
                        continue;
                    p.SetValue(inst, p.GetValue(this));
                }
                foreach (var c in Children)
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

        public void AddXmlToStringBuilder(ulong id, StringBuilder sb)
        {
            string LocalName;
            if (SignalType == SignalType.Constant && !IsLocal)
            {
                var value = Name.IndexOf(",");
                sb.AppendLine("<Access Scope=\"GlobalConstant\" UId=\"" + id + "\">");
                if (value == -1)
                    sb.AppendLine("<Constant Name=\"" + Name + "\">");
                else
                    sb.AppendLine("<Constant Name=\"" + Name.Substring(0, value) + "\">");
                sb.AppendLine("</Constant>");
                sb.AppendLine("</Access>");
            }
            else if (SignalType == SignalType.ConstantBool && !IsLocal)
            {
                sb.AppendLine("<Access Scope=\"LiteralConstant\" UId=\"" + id + "\">");
                sb.AppendLine("<Constant>");
                sb.AppendLine("<ConstantType>Bool</ConstantType>");
                sb.AppendLine("<ConstantValue>" + Name + "</ConstantValue>");
                sb.AppendLine("</Constant>");
                sb.AppendLine("</Access>");
            }
            else if (SignalType == SignalType.ConstantTime && !IsLocal)
            {
                sb.AppendLine("<Access Scope=\"TypedConstant\" UId=\"" + id + "\">");
                sb.AppendLine("<Constant>");
                sb.AppendLine("<ConstantValue>" + Name + "</ConstantValue>");
                sb.AppendLine("</Constant>");
                sb.AppendLine("</Access>");
            }
            else if (SignalType == SignalType.ConstantUInt && !IsLocal)
            {
                sb.AppendLine("<Access Scope=\"LiteralConstant\" UId=\"" + id + "\">");
                sb.AppendLine("<Constant>");
                sb.AppendLine("<ConstantType>UInt</ConstantType>");
                sb.AppendLine("<ConstantValue>" + Name + "</ConstantValue>");
                sb.AppendLine("</Constant>");
                sb.AppendLine("</Access>");
            }
            else if (SignalType == SignalType.ConstantUDInt && !IsLocal)
            {
                sb.AppendLine("<Access Scope=\"LiteralConstant\" UId=\"" + id + "\">");
                sb.AppendLine("<Constant>");
                sb.AppendLine("<ConstantType>UDInt</ConstantType>");
                sb.AppendLine("<ConstantValue>" + Name + "</ConstantValue>");
                sb.AppendLine("</Constant>");
                sb.AppendLine("</Access>");
            }
            else if (SignalType == SignalType.ConstantInt && !IsLocal)
            {
                sb.AppendLine("<Access Scope=\"LiteralConstant\" UId=\"" + id + "\">");
                sb.AppendLine("<Constant>");
                sb.AppendLine("<ConstantType>Int</ConstantType>");
                sb.AppendLine("<ConstantValue>" + Name + "</ConstantValue>");
                sb.AppendLine("</Constant>");
                sb.AppendLine("</Access>");
            }
            else if (SignalType == SignalType.ConstantReal && !IsLocal)
            {
                sb.AppendLine("<Access Scope=\"LiteralConstant\" UId=\"" + id + "\">");
                sb.AppendLine("<Constant>");
                sb.AppendLine("<ConstantType>Real</ConstantType>");
                sb.AppendLine("<ConstantValue>" + Name + "</ConstantValue>");
                sb.AppendLine("</Constant>");
                sb.AppendLine("</Access>");
            }
            else if (SignalType == SignalType.ConstantString && !IsLocal)
            {
                sb.AppendLine("<Access Scope=\"LiteralConstant\" UId=\"" + id + "\">");
                sb.AppendLine("<Constant>");
                sb.AppendLine("<ConstantType>String</ConstantType>");
                sb.AppendLine("<ConstantValue>" + Name + "</ConstantValue>");
                sb.AppendLine("</Constant>");
                sb.AppendLine("</Access>");
            }
            else if (SignalType == SignalType.ConstantWord && !IsLocal)
            {
                sb.AppendLine("<Access Scope=\"TypedConstant\" UId=\"" + id + "\">");
                sb.AppendLine("<Constant>");
                sb.AppendLine("<ConstantValue>" + Name + "</ConstantValue>");
                sb.AppendLine("</Constant>");
                sb.AppendLine("</Access>");
            }
            else if (SignalType == SignalType.Void && !IsLocal)
            {
                sb.AppendLine("<Access Scope=\"LiteralConstant\" UId=\"" + id + "\">");
                sb.AppendLine("<Constant>");
                sb.AppendLine("<ConstantType>Void</ConstantType>");
                sb.AppendLine("<ConstantValue>" + Name + "</ConstantValue>");
                sb.AppendLine("</Constant>");
                sb.AppendLine("</Access>");
            }
            else if (SignalType == SignalType.UDT && !IsLocal)
            {
                sb.AppendLine("<Access Scope=\"GlobalVariable\" UId=\"" + id + "\">" + "  <!-- P1: " + Name + " -->");
                sb.AppendLine("<Symbol>");
                for (int i = 0; i < SymbolPath.Split(Name).Length; i++) // Aufsplitten von a.b.c in einzel Elemente
                {
                    var part = Unescape(SymbolPath.Split(Name)[i]);

                    var idx = part.IndexOf("[") + 1; // Aufsplitten von Arrays
                    if (idx > 0)
                    {
                        sb.AppendLine("<Component Name=\"" + part.Substring(0, idx - 1) + "\">");
                        var arrays = part.Substring(idx, part.Length - idx - 1);

                        if (arrays.Contains("\""))
                        {
                            sb.AppendLine("<Access Scope=\"GlobalConstant\">");
                            sb.AppendLine("<Constant Name=" + arrays + ">");
                            sb.AppendLine("</Constant>");
                            sb.AppendLine("</Access>");
                        }
                        else if (!part.Contains("]"))
                        {
                            var p1 = part.Substring(idx, part.Length - idx);
                            var accessType = "GlobalVariable";
                            if (p1[0] == '#')
                            {
                                p1 = p1.Substring(1);
                                accessType = "LocalVariable";
                            }
                            sb.AppendLine("<Access Scope=\"" + accessType + "\">");
                            sb.AppendLine("<Symbol>");
                            sb.AppendLine("<Component Name=\"" + p1 + "\" />");
                            while (p1 != null)
                            {
                                i++;
                                p1 = Unescape(SymbolPath.Split(Name)[i]);
                                if (p1.Contains("]"))
                                {
                                    sb.AppendLine("<Component Name=\"" + p1.Substring(0, p1.Length - 1) + "\" />");
                                    p1 = null;
                                }
                                else
                                    sb.AppendLine("<Component Name=\"" + p1 + "\" />");
                            }
                            sb.AppendLine("</Symbol>");
                            sb.AppendLine("</Access>");
                        }
                        else
                        {
                            foreach (var arr in arrays.Split(','))
                            {
                                sb.AppendLine("<Access Scope=\"LiteralConstant\">");
                                sb.AppendLine("<Constant>");
                                sb.AppendLine("<ConstantType>DInt</ConstantType>");
                                sb.AppendLine("<ConstantValue>" + arr + "</ConstantValue>");
                                sb.AppendLine("</Constant>");
                                sb.AppendLine("</Access>");
                            }
                        }
                    }
                    else
                    {
                        sb.AppendLine("<Component Name=\"" + part + "\">");
                    }
                    sb.AppendLine("</Component>");
                }
                sb.AppendLine("<Address Area=\"None\" Type=\"Block_UDT\" BlockNumber=\"0\" BitOffset=\"0\" Informative=\"true\" />");
                sb.AppendLine("</Symbol>");
                sb.AppendLine("</Access>");
            }
            else if (SignalType == SignalType.Byte && !IsLocal)
            {
                sb.AppendLine("<Access Scope=\"GlobalVariable\" UId=\"" + id + "\">");
                sb.AppendLine("<Symbol>");
                foreach (var parte in SymbolPath.Split(Name)) // Aufsplitten von a.b.c in einzel Elemente
                {
                    var part = Unescape(parte);
                    sb.AppendLine("<Component Name=\"" + part + "\" />");
                }
                sb.AppendLine("<Address Informative=\"true\" BitOffset=\"0\" BlockNumber=\"0\" Type=\"Byte\" Area=\"None\" />");
                sb.AppendLine("</Symbol>");
                sb.AppendLine("</Access>");
            }
            else if (SignalType == SignalType.String && !IsLocal)
            {
                sb.AppendLine("<Access Scope=\"GlobalVariable\" UId=\"" + id + "\">" + "  <!-- P2: " + Name + " -->");
                sb.AppendLine("<Symbol>");
                foreach (var parte in SymbolPath.Split(Name)) // Aufsplitten von a.b.c in einzel Elemente
                {
                    var part = Unescape(parte);
                    var idx = part.IndexOf("[") + 1; // Aufsplitten von Arrays
                    if (idx > 0)
                    {
                        sb.AppendLine("<Component Name=\"" + part.Substring(0, idx - 1) + "\">");
                        var arrays = part.Substring(idx, part.Length - idx - 1);

                        if (arrays.Contains("\""))
                        {
                            sb.AppendLine("<Access Scope=\"GlobalConstant\">");
                            sb.AppendLine("<Constant Name=" + arrays + ">");
                            sb.AppendLine("</Constant>");
                            sb.AppendLine("</Access>");
                        }
                        else
                        {
                            foreach (var arr in arrays.Split(','))
                            {
                                sb.AppendLine("<Access Scope=\"LiteralConstant\">");
                                sb.AppendLine("<Constant>");
                                sb.AppendLine("<ConstantType>DInt</ConstantType>");
                                sb.AppendLine("<ConstantValue>" + arr + "</ConstantValue>");
                                sb.AppendLine("</Constant>");
                                sb.AppendLine("</Access>");
                            }
                        }
                    }
                    else
                    {
                        sb.AppendLine("<Component Name=\"" + part + "\">");
                    }
                    sb.AppendLine("</Component>");
                }
                sb.AppendLine("<Address Area=\"None\" Type=\"String\" BlockNumber=\"0\" BitOffset=\"0\" Informative=\"true\" />");
                sb.AppendLine("</Symbol>");
                sb.AppendLine("</Access>");
            }
            else
            {
                LocalName = Name;
                if (IsLocal)
                {
                    sb.AppendLine("<Access Scope=\"LocalVariable\" UId=\"" + id + "\">");
                    LocalName = Name.Substring(1);
                }
                else
                {
                    sb.AppendLine("<Access Scope=\"GlobalVariable\" UId=\"" + id + "\">" + "  <!-- P3: " + Name + " -->");
                }
                sb.AppendLine("<Symbol>");
                var cnt = SymbolPath.Split(LocalName).Length;
                if (this is FixedSignal)
                    cnt = 1;
                for (int i = 0; i < cnt; i++) // Aufsplitten von a.b.c in einzel Elemente
                {
                    var part = Unescape(SymbolPath.Split(LocalName)[i]);
                    if (this is FixedSignal)
                        part = LocalName;

                    var idx = part.IndexOf("[") + 1; // Aufsplitten von Arrays
                    if (idx > 0)
                    {
                        sb.AppendLine("<Component Name=\"" + part.Substring(0, idx - 1) + "\">");
                        var arrays = part.Substring(idx, part.Length - idx - 1);

                        if (arrays.Contains("\""))
                        {
                            sb.AppendLine("<Access Scope=\"GlobalConstant\">");
                            sb.AppendLine("<Constant Name=" + arrays + ">");
                            sb.AppendLine("</Constant>");
                            sb.AppendLine("</Access>");
                        }
                        else if (!part.Contains("]"))
                        {
                            var p1 = part.Substring(idx, part.Length - idx);
                            var accessType = "GlobalVariable";
                            if (p1[0] == '#')
                            {
                                p1 = p1.Substring(1);
                                accessType = "LocalVariable";
                            }
                            sb.AppendLine("<Access Scope=\"" + accessType + "\">");
                            sb.AppendLine("<Symbol>");
                            sb.AppendLine("<Component Name=\"" + p1 + "\" />");
                            bool noClose = false;
                            while (p1 != null)
                            {
                                i++;
                                p1 = Unescape(SymbolPath.Split(LocalName)[i]);
                                if (p1.Contains(","))
                                {
                                    var innerParts = p1.Split(',');
                                    sb.AppendLine("<Component Name=\"" + innerParts[0] + "\" />");
                                    foreach (var p in innerParts.Skip(1))
                                    {
                                        var pNe = p.Trim();
                                        if (pNe.Contains("]"))
                                        {
                                            pNe = pNe.Substring(0, pNe.Length - 1);
                                        }
                                        if (int.TryParse(pNe, out _))
                                        {
                                            noClose = true;
                                            sb.AppendLine("</Symbol>");
                                            sb.AppendLine("</Access>");

                                            sb.AppendLine("<Access Scope=\"LiteralConstant\">");
                                            sb.AppendLine("<Constant>");
                                            sb.AppendLine("<ConstantType>DInt</ConstantType>");
                                            sb.AppendLine("<ConstantValue>" + pNe + "</ConstantValue>");
                                            sb.AppendLine("</Constant>");
                                            sb.AppendLine("</Access>");
                                        }
                                        else
                                        {
                                            sb.AppendLine("</Symbol>");
                                            sb.AppendLine("</Access>");

                                            var accessTypePne = "GlobalVariable";
                                            if (pNe[0] == '#')
                                            {
                                                pNe = pNe.Substring(1);
                                                accessTypePne = "LocalVariable";
                                            }
                                            sb.AppendLine("<Access Scope=\"" + accessTypePne + "\">");
                                            sb.AppendLine("<Symbol>");
                                            sb.AppendLine("<Component Name=\"" + pNe + "\" />");
                                        }
                                    }
                                    if (p1.Contains("]"))
                                    {
                                        p1 = null;
                                    }
                                }
                                else
                                {
                                    if (p1.Contains("]"))
                                    {
                                        sb.AppendLine("<Component Name=\"" + p1.Substring(0, p1.Length - 1) + "\" />");
                                        p1 = null;
                                    }
                                    else
                                        sb.AppendLine("<Component Name=\"" + p1 + "\" />");
                                }
                            }
                            if (!noClose)
                            {
                                sb.AppendLine("</Symbol>");
                                sb.AppendLine("</Access>");
                            }
                        }
                        else
                        {
                            foreach (var arr in arrays.Split(','))
                            {
                                sb.AppendLine("<Access Scope=\"LiteralConstant\">");
                                sb.AppendLine("<Constant>");
                                sb.AppendLine("<ConstantType>DInt</ConstantType>");
                                sb.AppendLine("<ConstantValue>" + arr + "</ConstantValue>");
                                sb.AppendLine("</Constant>");
                                sb.AppendLine("</Access>");
                            }
                        }
                    }
                    else
                    {
                        if (this is FixedPeripherySignal)
                        {
                            sb.AppendLine("<Component Name=\"" + part + "\" SimpleAccessModifier=\"Periphery\">");
                        }
                        else
                            sb.AppendLine("<Component Name=\"" + part + "\">");
                    }
                    sb.AppendLine("</Component>");
                }
                //if (this is FixedPeripherySignal)
                //    sb.AppendLine("<Address Area=\"PeripheryInput\" Type=\"Bool\" BitOffset=\"0\" Informative=\"true\" />");
                //else
                //    sb.AppendLine("<Address Area=\"None\" Type=\"Bool\" BlockNumber=\"0\" BitOffset=\"0\" Informative=\"true\" />");
                sb.AppendLine("</Symbol>");
                sb.AppendLine("</Access>");
            }
        }

        public override string ToString()
        {
            return this.GetType().Name + "(" + Name + ")";
        }
    }
}
