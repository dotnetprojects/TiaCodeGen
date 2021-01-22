using System;
using System.Collections.Generic;
using System.Linq;

namespace TiaCodegen.Internal
{
    internal static class IEnumerableExtensions
    {
        public static IEnumerable<T> Flatten<T>(this IEnumerable<T> e, Func<T, IEnumerable<T>> f)
        {
            if (e == null)
                return new List<T>();

            return e.SelectMany(c => f(c).Flatten(f)).Concat(e);
        }
    }
}
