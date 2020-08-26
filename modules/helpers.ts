export function getElementOrThrow<E extends Element = Element>(selector: string): E {
    const elem = document.querySelector<E>(selector);
    if(elem === null) {
        throw Error('Could not find county-list element');
    }
    return elem;
}