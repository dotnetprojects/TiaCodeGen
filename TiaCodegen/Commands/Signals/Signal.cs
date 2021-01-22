using System;
using System.Collections.Generic;
using System.Text;
using TiaCodegen.Enums;
using TiaCodegen.Interfaces;

namespace TiaCodegen.Commands.Signals
{
    public class Signal : IOperationOrSignal
    {
        public string DebugInfo { get; set; }
        public Signal(string name, SignalType signalType = SignalType.Bool, string customType = null)
        {
            Name = name;
            SignalType = signalType;
            Children = new List<IOperationOrSignal>();
            CustomType = customType;
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
            return txt.Replace("\\.", "🌴");
        }

        public string Unescape(string txt)
        {
            return txt.Replace("🌴", ".").Replace("\\\\", "\\");
        }

        public IOperationOrSignal Clone()
        {
            try
            {
                var inst = new Signal(this.Name);
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
            if (SignalType == SignalType.Constant && !Name.StartsWith("#"))
            {
                var value = Name.IndexOf(",");
                sb.AppendLine("<Access Scope=\"GlobalConstant\" UId=\"" + id + "\">");
                sb.AppendLine("<Constant Name=\"" + Name.Substring(0, value) + "\">");
                sb.AppendLine("</Constant>");
                sb.AppendLine("</Access>");
            }
            else if (SignalType == SignalType.ConstantBool && !Name.StartsWith("#"))
            {
                sb.AppendLine("<Access Scope=\"LiteralConstant\" UId=\"" + id + "\">");
                sb.AppendLine("<Constant>");
                sb.AppendLine("<ConstantType>Bool</ConstantType>");
                sb.AppendLine("<ConstantValue>" + Name + "</ConstantValue>");
                sb.AppendLine("</Constant>");
                sb.AppendLine("</Access>");
            }
            else if (SignalType == SignalType.ConstantTime && !Name.StartsWith("#"))
            {
                sb.AppendLine("<Access Scope=\"TypedConstant\" UId=\"" + id + "\">");
                sb.AppendLine("<Constant>");
                sb.AppendLine("<ConstantValue>" + Name + "</ConstantValue>");
                sb.AppendLine("</Constant>");
                sb.AppendLine("</Access>");
            }
            else if (SignalType == SignalType.ConstantUInt && !Name.StartsWith("#"))
            {
                sb.AppendLine("<Access Scope=\"LiteralConstant\" UId=\"" + id + "\">");
                sb.AppendLine("<Constant>");
                sb.AppendLine("<ConstantType>UInt</ConstantType>");
                sb.AppendLine("<ConstantValue>" + Name + "</ConstantValue>");
                sb.AppendLine("</Constant>");
                sb.AppendLine("</Access>");
            }
            else if (SignalType == SignalType.ConstantInt && !Name.StartsWith("#"))
            {
                sb.AppendLine("<Access Scope=\"LiteralConstant\" UId=\"" + id + "\">");
                sb.AppendLine("<Constant>");
                sb.AppendLine("<ConstantType>Int</ConstantType>");
                sb.AppendLine("<ConstantValue>" + Name + "</ConstantValue>");
                sb.AppendLine("</Constant>");
                sb.AppendLine("</Access>");
            }
            else if (SignalType == SignalType.ConstantString && !Name.StartsWith("#"))
            {
                sb.AppendLine("<Access Scope=\"LiteralConstant\" UId=\"" + id + "\">");
                sb.AppendLine("<Constant>");
                sb.AppendLine("<ConstantType>String</ConstantType>");
                sb.AppendLine("<ConstantValue>" + Name + "</ConstantValue>");
                sb.AppendLine("</Constant>");
                sb.AppendLine("</Access>");
            }
            else if (SignalType == SignalType.ConstantWord && !Name.StartsWith("#"))
            {
                sb.AppendLine("<Access Scope=\"TypedConstant\" UId=\"" + id + "\">");
                sb.AppendLine("<Constant>");
                sb.AppendLine("<ConstantValue>" + Name + "</ConstantValue>");
                sb.AppendLine("</Constant>");
                sb.AppendLine("</Access>");
            }
            else if (SignalType == SignalType.Void && !Name.StartsWith("#"))
            {
                sb.AppendLine("<Access Scope=\"LiteralConstant\" UId=\"" + id + "\">");
                sb.AppendLine("<Constant>");
                sb.AppendLine("<ConstantType>Void</ConstantType>");
                sb.AppendLine("<ConstantValue>" + Name + "</ConstantValue>");
                sb.AppendLine("</Constant>");
                sb.AppendLine("</Access>");
            }
            else if (SignalType == SignalType.UDT && !Name.StartsWith("#"))
            {
                sb.AppendLine("<Access Scope=\"GlobalVariable\" UId=\"" + id + "\">" + "  <!-- P1: " + Name + " -->");
                sb.AppendLine("<Symbol>");
                for (int i = 0; i < Escape(Name).Split('.').Length; i++) // Aufsplitten von a.b.c in einzel Elemente
                {
                    var part = Unescape(Escape(Name).Split('.')[i]);

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
                                p1 = Unescape(Escape(Name).Split('.')[i]);
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
            else if (SignalType == SignalType.Byte && !Name.StartsWith("#"))
            {
                sb.AppendLine("<Access Scope=\"GlobalVariable\" UId=\"" + id + "\">");
                sb.AppendLine("<Symbol>");
                foreach (var parte in Escape(Name).Split('.')) // Aufsplitten von a.b.c in einzel Elemente
                {
                    var part = Unescape(parte);
                    sb.AppendLine("<Component Name=\"" + part + "\" />");
                }
                sb.AppendLine("<Address Informative=\"true\" BitOffset=\"0\" BlockNumber=\"0\" Type=\"Byte\" Area=\"None\" />");
                sb.AppendLine("</Symbol>");
                sb.AppendLine("</Access>");
            }
            else if (SignalType == SignalType.String && !Name.StartsWith("#"))
            {
                sb.AppendLine("<Access Scope=\"GlobalVariable\" UId=\"" + id + "\">" + "  <!-- P2: " + Name + " -->");
                sb.AppendLine("<Symbol>");
                foreach (var parte in Escape(Name).Split('.')) // Aufsplitten von a.b.c in einzel Elemente
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
                if (Name.StartsWith("#"))
                {
                    sb.AppendLine("<Access Scope=\"LocalVariable\" UId=\"" + id + "\">");
                    LocalName = Name.Substring(1);
                }
                else
                {
                    sb.AppendLine("<Access Scope=\"GlobalVariable\" UId=\"" + id + "\">" + "  <!-- P3: " + Name + " -->");
                }
                sb.AppendLine("<Symbol>");
                var cnt = Escape(LocalName).Split('.').Length;
                if (this is FixedSignal)
                    cnt = 1;
                for (int i = 0; i < cnt; i++) // Aufsplitten von a.b.c in einzel Elemente
                {
                    var part = Unescape(Escape(LocalName).Split('.')[i]);
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
                            while (p1 != null)
                            {
                                i++;
                                p1 = Unescape(Escape(LocalName).Split('.')[i]);
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
                sb.AppendLine("<Address Area=\"None\" Type=\"Bool\" BlockNumber=\"0\" BitOffset=\"0\" Informative=\"true\" />");
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
