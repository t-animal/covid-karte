export function getElementOrThrow<E extends Element = Element>(selector: string, baseElement?: Element): E {
    const elem = (baseElement ?? document).querySelector<E>(selector);
    if(elem === null) {
        throw Error(`Could not find element "${selector}" on "${baseElement?.localName ?? 'document'}"`);
    }
    return elem;
}