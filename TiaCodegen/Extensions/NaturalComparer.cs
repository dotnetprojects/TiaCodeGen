using System.Collections.Generic;

namespace DotNetProjects.TiaCodegen.Extensions
{
    public class NaturalComparer : IComparer<string>
    {
        public int Compare(string x, string y)
        {
            if (x == y) return 0;
            if (x == null) return -1;
            if (y == null) return 1;

            int i = 0, j = 0;
            while (i < x.Length && j < y.Length)
            {
                char cx = x[i];
                char cy = y[j];

                // If both are digits, compare numbers
                if (char.IsDigit(cx) && char.IsDigit(cy))
                {
                    long vx = 0;
                    while (i < x.Length && char.IsDigit(x[i]))
                        vx = vx * 10 + (x[i++] - '0');

                    long vy = 0;
                    while (j < y.Length && char.IsDigit(y[j]))
                        vy = vy * 10 + (y[j++] - '0');

                    if (vx != vy)
                        return vx < vy ? -1 : 1;
                }
                else
                {
                    // Compare non-digits case-insensitively
                    int cmp = char.ToUpperInvariant(cx).CompareTo(char.ToUpperInvariant(cy));
                    if (cmp != 0)
                        return cmp;

                    i++;
                    j++;
                }
            }

            // If one string is longer
            return x.Length - y.Length;
        }
    }

}
