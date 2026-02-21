export function flatten<T>(e: T[] | null | undefined, f: (t: T) => T[]): T[] {
    if (!e) return [];
    return e.flatMap(c => flatten(f(c), f)).concat(e);
}
