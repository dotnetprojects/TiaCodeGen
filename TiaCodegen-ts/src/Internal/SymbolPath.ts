// Split before decoding escapes, so an escaped backslash before a dot does
// not accidentally escape the separator as well.
export function splitSymbolPath(path: string): string[] {
    const parts: string[] = [];
    let part = '';
    for (let i = 0; i < path.length; i++) {
        const c = path[i];
        if (c === '\\' && i + 1 < path.length && (path[i + 1] === '\\' || path[i + 1] === '.'))
            part += c + path[++i];
        else if (c === '.') {
            parts.push(part);
            part = '';
        } else part += c;
    }
    parts.push(part);
    return parts;
}

export function unescapeSymbolComponent(component: string): string {
    let result = '';
    for (let i = 0; i < component.length; i++) {
        let c = component[i];
        if (c === '\\' && i + 1 < component.length && (component[i + 1] === '\\' || component[i + 1] === '.'))
            c = component[++i];
        result += c;
    }
    return result;
}

export function escapeSymbolComponent(component: string): string {
    return component.replace(/\\/g, '\\\\').replace(/\./g, '\\.');
}

export function joinSymbolPath(components: readonly string[]): string {
    if (!Array.isArray(components) || components.length === 0 || components.some(c => typeof c !== 'string' || c.length === 0))
        throw new Error('Provide at least one non-empty path component.');
    return components.map(escapeSymbolComponent).join('.');
}
